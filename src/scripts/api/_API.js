'use strict';

const axios = require('axios');
const globalConfig = require('config');
const urlJoin = require('url-join');
const querystring = require('querystring');
const recordNormalizer = require('./recordNormalizer');

class _API {
    constructor () {
        this.urlJoin = urlJoin;
        this.querystring = querystring;
        this.axios = axios;
        this.globalConfig = globalConfig;
        this.recordNormalizer = recordNormalizer;
        this.getCandidateById = this.getCandidateById.bind(this);
        this.getCandidateByEmail = this.getCandidateByEmail.bind(this);
        this.getVacancyById = this.getVacancyById.bind(this);
        this.getCandidateVacancy = this.getCandidateVacancy.bind(this);
        /*
        this.getCandidateByIdAndItsVacancies = this.getCandidateByIdAndItsVacancies.bind(this);
        */
        this.getCandidateVacanciesForCandidate = this.getCandidateVacanciesForCandidate.bind(this);
        this.getCandidateByEmailAndItsVacancies = this.getCandidateByEmailAndItsVacancies.bind(this);
        this.getCandidateVacanciesByVacancyId = this.getCandidateVacanciesByVacancyId.bind(this);
        this.setCandidateVacancyStatus = this.setCandidateVacancyStatus.bind(this);
        this.updateCandidate = this.updateCandidate.bind(this);
    }
    
    getCandidateById (_candidateId) {
        return this._getCandidateById(_candidateId);
    }
    
    getCandidateByEmail (_candidateEmail) {
        return this._getCandidateByEmail(_candidateEmail);
    }

    getVacancyById (_vacancyId) {
        return this._getVacancyById(_vacancyId);
    }

    getCandidateVacancy (_candidateEmail, _vacancyId) {
        return this._getCandidateVacancy(_candidateEmail, _vacancyId);
    }
    /*
    getCandidateByIdAndItsVacancies (_candidateId) {
        return this._getCandidateByIdAndItsVacancies(_candidateId);
    }
    */

    getCandidateVacanciesForCandidate (_candidateEmail) {
        return this._getCandidateVacanciesForCandidate(_candidateEmail);
    }

    getCandidateByEmailAndItsVacancies (_candidateEmail) {
        return this._getCandidateByEmailAndItsVacancies(_candidateEmail);
    }
    
    getCandidateVacanciesByVacancyId (_vacancyId) {
        return this._getCandidateVacanciesByVacancyId(_vacancyId);
    }

    setCandidateVacancyStatus (_candidateEmail, _vacancyId, _newStatus) {
        return this._setCandidateVacancyStatus(_candidateEmail, _vacancyId, _newStatus);
    }

    updateCandidate (_email, _firstName, _lastName) {
        return this._updateCandidate(_email, _firstName, _lastName);
    }
}

module.exports = _API;