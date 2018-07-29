'use strict';

const _ = require('lodash');
const config = require('config');
const TargetApi = require('./api/TargetApi');
const TargetsApi = require('./api/TargetsApi');
const Promise = require('bluebird');

const NUM_OF_TARGETS_TO_FETCH = 100;

class CandidateVacancies {
    constructor() {
        this.url = config.get('api.url');
        this.connector = config.get('api.connector');
        this.key = config.get('api.key');

        this.candidatesApi = new TargetsApi(this.url, this.connector, this.key, config.get('targetGroups.candidate'));
        this.vacanciesApi = new TargetsApi(this.url, this.connector, this.key, config.get('targetGroups.vacancy'));
        this.candidateVacanciesApi = new TargetsApi(this.url, this.connector, this.key, config.get('targetGroups.candidateVacancy'));
    }

    getVacancies (_candidateId) {
        const _response = {
            candidate: {},
            applications: []
        };

        const _candidateToVacanciesMap = {};

        return new TargetApi(this.url, this.connector, this.key, _candidateId).getRecords()
            .then(_result => {
                CandidateVacancies._validateApiResults(_result);

                if (_result.data.type !== config.get('targetGroups.candidate')) {
                    throw new Error('This candidate doesn\'t exist in our system.');
                }

                _response.candidate.firstName = _result.data.field_firstname;
                _response.candidate.lastName = _result.data.field_lastname;

                return this.candidateVacanciesApi.getRecords(NUM_OF_TARGETS_TO_FETCH);
            })
            .then(_results => {
                CandidateVacancies._validateApiResults(_results);

                const _vacanciesToFetchMap = {};

                _results.data.objects.forEach(_candidateVacancy => {
                    const _childTargetIds = _candidateVacancy.targets_selected;

                    if (_childTargetIds.length !== 2 || _childTargetIds.indexOf(_candidateId) === -1) {
                        return;
                    }

                    const _candidateVacancyId = _candidateVacancy.id;
                    const _vacancyIndex = _childTargetIds.indexOf(_candidateId) === 0 ? 1 : 0;
                    const _vacancyId = _childTargetIds[_vacancyIndex];

                    _vacanciesToFetchMap[_vacancyId] = true;

                    _candidateToVacanciesMap[_candidateVacancyId] = {
                        vacancyId: _vacancyId,
                        details: _candidateVacancy
                    }
                });

                if (Object.keys(_candidateToVacanciesMap).length === 0) {
                    return [];
                }

                const _vacancyIdsToFetch = _.map(_vacanciesToFetchMap, (_v, _k) => {
                    return _k;
                });

                return Promise.map(_vacancyIdsToFetch, _vacancyId => {
                    return new TargetApi(this.url, this.connector, this.key, _vacancyId).getRecords();
                }, { concurrency: 2 });
            })
            .then(_results => {
                _results.forEach(CandidateVacancies._validateApiResults);

                const _vacancies = {};

                _results.forEach(_result => {
                    _vacancies[_result.data.id] = _result.data;
                });

                _.forEach(_candidateToVacanciesMap, (_v, _k) => {
                    _response.applications.push([
                        _k,
                        _vacancies[_v.vacancyId].field_job_title || '',
                        _vacancies[_v.vacancyId].field_branch_name || '',
                        _v.details.field_candidate_vacancy_status || ''
                    ]);
                });

                return _response;
            });
    }

    static _validateApiResults (_results) {
        if (!_results || _results.status !== 200) {
            throw new Error('We couldn\'t get the data for you, please try again later.');
        }
    }
}

module.exports = CandidateVacancies;
