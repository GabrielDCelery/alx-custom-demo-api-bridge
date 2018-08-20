'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const AutologyxAPI = require('../api/AutologyxAPI');
const DataNormalizer = require('../utils/DataNormalizer');

const DEFAULT_CONFIG = {
    alxConnector: null,
    alxApiKey: null
};

const CANDIDATE_VACANCY_STATUSES = {
    placed: 'Placed',
    jobFilled: 'Job Filled'
};

const CANDIDATE_VACANCY_STATUSES_METHODS = {
    'Placed': '_syncPlacedCandidateVacancy'
};

class CandidateVacancies {
    constructor (_config) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.autologyxAPI = new AutologyxAPI(this.config.alxConnector, this.config.alxApiKey);
    }

    getListOfApplications (_candidateEmail) {
        let _candidateVacancies = null;

        return this.autologyxAPI.getCandidateVacanciesForCandidate(_candidateEmail)
            .then(_result => {
                _candidateVacancies = _result;

                const _vacancyIdsToFetch = [];

                _candidateVacancies.forEach(_candidateVacancy => {
                    if (_vacancyIdsToFetch.includes(_candidateVacancy.vacancyId)) {
                        return;
                    }

                    _vacancyIdsToFetch.push(_candidateVacancy.vacancyId);
                });

                return Promise.map(_vacancyIdsToFetch, _vacancyId => {
                    return this.autologyxAPI.getVacancyById(_vacancyId);
                }, { concurrency: 2 });
            })
            .then(_vacancies => {
                const _vacancyMap = {};

                _vacancies.forEach(_vacancy => {
                    _vacancyMap[_vacancy.vacancyId] = _vacancy;
                });

                return _candidateVacancies.map(_cv => {
                    return {
                        id: _cv.alxId,
                        branchName: _vacancyMap[_cv.vacancyId].branchName,
                        jobTitle: _vacancyMap[_cv.vacancyId].jobTitle,
                        status: _cv.status,
                        createdAt: DataNormalizer.convertDateToUkLocale(_cv.createdAt)
                    };
                });
            });
    }

    _syncPlacedCandidateVacancy (_candidateEmail, _vacancyId) {
        return this.autologyxAPI.getCandidateVacanciesByVacancyId(_vacancyId)
            .then(_candidateVacancies => {
                return Promise.map(_candidateVacancies, _cv => {
                    if (_cv.candidateEmail === _candidateEmail) {
                        return Promise.resolve(true);
                    }

                    return this.autologyxAPI.setCandidateVacancyStatus(_cv.candidateEmail, _cv.vacancyId, 'Unsuccessful'/*CANDIDATE_VACANCY_STATUSES.jobFilled*/);
                }, { concurrency: 2 });
            });
    }

    syncCandidateVacancy (_candidateEmail, _vacancyId) {
        return this.autologyxAPI.getCandidateVacancy(_candidateEmail, _vacancyId)
            .then(_candidateVacancy => {
                const _methodToCall = CANDIDATE_VACANCY_STATUSES_METHODS[_candidateVacancy.status];

                if (this[_methodToCall]) {
                    return this[_methodToCall](_candidateEmail, _vacancyId);
                }

                return true;
            });
    }
}

module.exports = CandidateVacancies;