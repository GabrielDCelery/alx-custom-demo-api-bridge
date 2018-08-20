'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const AutologyxAPI = require('../api/AutologyxAPI');

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

class VacancyStatusChange {
    constructor (_config) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.autologyxAPI = new AutologyxAPI(this.config.alxConnector, this.config.alxApiKey);
    }

    _processPlaced (_candidateEmail, _vacancyId) {
        return this.autologyxAPI.getCandidateVacanciesByVacancyId(_vacancyId)
            .then(_candidateVacancies => {
                return Promise.map(_candidateVacancies, _cv => {
                    if (_cv.candidateEmail === _candidateEmail) {
                        return Promise.resolve(true);
                    }

                    return this.autologyxAPI.setCandidateVacancyStatus(_cv.candidateEmail, _cv.vacancyId, CANDIDATE_VACANCY_STATUSES.jobFilled);
                }, { concurrency: 2 });
            });
    }

    process (_candidateVacancyStatus, _candidateEmail, _vacancyId) {
        if (!CANDIDATE_VACANCY_STATUSES_METHODS[_candidateVacancyStatus]) {
            return Promise.reject(`Invalid candidate vacancy status -> ${_candidateVacancyStatus}`);
        }

        return this[CANDIDATE_VACANCY_STATUSES_METHODS[_candidateVacancyStatus]](_candidateEmail, _vacancyId);
    }
}

module.exports = VacancyStatusChange;