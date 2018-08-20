'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const AutologyxAPI = require('../api/AutologyxAPI');
const AdaptAPI = require('../api/AdaptAPI');

const DEFAULT_CONFIG = {
    alxConnector: null,
    alxApiKey: null
};

class ExternalAdaptDataSynchronizer {
    constructor (_config) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.autologyxAPI = new AutologyxAPI(this.config.alxConnector, this.config.alxApiKey);
        this.adaptApi = new AdaptAPI();
    }

    start (_candidateEmail) {
        let _adaptCandidate = null;
        let _adaptCandidateVacanciesMap = {};
        let _alxCandidateVacanciesMap = {};

        return this.adaptAPI.getCandidateByEmailAndItsVacancies(_candidateEmail)
            .then(_response => {
                _adaptCandidate = this.adaptAPI.extractCandidateFromResponse(_response);

                const _adaptCandidateVacancies = this.adaptAPI.extractCandidateVacanciesFromResponse(_response);

                _adaptCandidateVacanciesMap = ExternalAdaptDataSynchronizer._generateCandidateVacancyLookupMap(_adaptCandidateVacancies);

                return this.autologyxAPI.getCandidateByEmail(_candidateEmail);
            })
            .then(_alxCandidate => {
                if (_alxCandidate.firstName !== _adaptCandidate.firstName || _alxCandidate.lastName !== _adaptCandidate.lastName) {
                    return this.autologyxAPI.updateCandidate(_adaptCandidate.email, _adaptCandidate.firstName, _adaptCandidate.lastName);
                }
            })
            .then(() => {
                return this.autologyxAPI.getCandidateVacanciesForCandidate(_candidateEmail);
            })
            .then(_alxCandidateVacancies => {
                _alxCandidateVacanciesMap = ExternalAdaptDataSynchronizer._generateCandidateVacancyLookupMap(_alxCandidateVacancies);

                return Promise.map(Object.keys(_adaptCandidateVacanciesMap), _key => {
                    const _alxCandidateVacancy = _alxCandidateVacanciesMap[_key];
                    const _adaptCandidateVacancy = _adaptCandidateVacanciesMap[_key];

                    if (!_alxCandidateVacancy || _adaptCandidateVacancy.status !== _alxCandidateVacancy.status) {
                        return Promise.resolve(null);
                    }

                    return this.autologyxAPI.setCandidateVacancyStatus(_adaptCandidateVacancy.candidateEmail, _adaptCandidateVacancy.vacancyId, _adaptCandidateVacancy.status)
                }, { concurrency: 2 });
            });
    }

    static _generateCandidateVacancyLookupMap (_candidateVacancies) {
        const _map = {};

        _.forEach(_candidateVacancies, _candidateVacancy => {
            _map[ExternalAdaptDataSynchronizer._generateCandidateVacancyKey(_candidateVacancy)] = _candidateVacancy;
        })

        return _map;
    }

    static _generateCandidateVacancyKey (_candidateVacancy) {
        return `${_candidateVacancy.candidateEmail}_${_candidateVacancy.vacancyId}`;
    }
}

module.exports = ExternalAdaptDataSynchronizer;