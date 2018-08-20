'use strict';

const _ = require('lodash');
const _API = require('./_API');

const URL_API_OLD = 'https://pcj.autologyx.com:443/api/v1/targets';
const URL_API_NEW = 'https://pcj.autologyx.com/api/v2/targetgroup/targetgroup';

const VALID_RESPONSE_STATUSES = [200, 202];

class AutologyxAPI extends _API {
    constructor (_connector, _apiKey, _userName, _password) {
        super();
        this.connector = _connector;
        this.apiKey = _apiKey;
        this.userName = _userName || null;
        this.password = _password || null;
    }

    _getCandidateById (_candidateId) {
        const _axiosConfig = { method: 'get' };

        const _query = {
            connector: this.connector,
            api_key: this.apiKey
        };

        _axiosConfig.url = this.urlJoin(URL_API_OLD, _candidateId, `?${this.querystring.stringify(_query)}`);

        if (this.userName && this.password) {
            _axiosConfig.auth = {
                username: this.userName,
                password: this.password
            };
        }

        return this.axios(_axiosConfig).then(AutologyxAPI._extractRecordsFromResponseWrapper({
            bSingleRecord: true,
            bNewAPI: false
        })).then(_record => {
            return this.recordNormalizer.normalizeCandidate(_record.id, _record.email, _record.field_firstname, _record.field_lastname);
        });
    }

    _getCandidateByEmail (_candidateEmail) {
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_candidate_email: _candidateEmail
        };

        return this._sendRequestToNewApi('candidate', 'get', _query)
            .then(AutologyxAPI._extractRecordsFromResponseWrapper({
                bSingleRecord: true,
                bNewAPI: true
            }))
            .then(_record => {
                return this.recordNormalizer.normalizeCandidate(_record.id, _record.email, _record.field_firstname, _record.field_lastname);
            });
    }

    _getVacancyById (_vacancyId) {
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_vacancy_id: _vacancyId
        };

        return this._sendRequestToNewApi('vacancy', 'get', _query)
            .then(AutologyxAPI._extractRecordsFromResponseWrapper({
                bSingleRecord: true,
                bNewAPI: true
            }))
            .then(_record => {
                return this.recordNormalizer.normalizeVacancy(_record.id, _record.field_vacancy_id, _record.field_branch_name, _record.field_job_title);
            });
    }

    _getCandidateVacancy (_candidateEmail, _vacancyId) {
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_candidate_email: _candidateEmail,
            field_vacancy_pertemps_id: _vacancyId
        };

        return this._sendRequestToNewApi('candidateVacancy', 'get', _query)
            .then(AutologyxAPI._extractRecordsFromResponseWrapper({
                bSingleRecord: true,
                bNewAPI: true
            }))
            .then(_record => {
                return this.recordNormalizer.normalizeCandidateVacancy(
                    _record.id,
                    _record.field_candidate_email, 
                    _record.field_vacancy_pertemps_id, 
                    _record.field_candidate_vacancy_status,
                    _record.created_at
                );
            });
    }

    _getCandidateVacanciesForCandidate (_candidateEmail) {
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_candidate_email: _candidateEmail
        };

        return this._sendRequestToNewApi('candidateVacancy', 'get', _query)
            .then(AutologyxAPI._extractRecordsFromResponseWrapper({
                bSingleRecord: false,
                bNewAPI: true
            }))
            .then(_records => {
                return _records.map(_record => {
                    return this.recordNormalizer.normalizeCandidateVacancy(
                        _record.id,
                        _record.field_candidate_email, 
                        _record.field_vacancy_pertemps_id, 
                        _record.field_candidate_vacancy_status,
                        _record.created_at
                    );
                });
            });
    }

    _getCandidateVacanciesByVacancyId (_vacancyId) {
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_vacancy_pertemps_id: _vacancyId
        };

        return this._sendRequestToNewApi('candidateVacancy', 'get', _query)
            .then(AutologyxAPI._extractRecordsFromResponseWrapper({
                bSingleRecord: false,
                bNewAPI: true
            }))
            .then(_records => {
                return _records.map(_record => {
                    return this.recordNormalizer.normalizeCandidateVacancy(
                        _record.id,
                        _record.field_candidate_email, 
                        _record.field_vacancy_pertemps_id, 
                        _record.field_candidate_vacancy_status,
                        _record.created_at
                    );
                });
            });
    }

    _updateCandidate (_email, _firstName, _lastName) {
        const _data = {
            field_firstname: _firstName,
            field_lastname: _lastName
        };
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_email: _email
        };

        return this._sendRequestToNewApi('candidate', 'patch', _query, _data);
    }

    _setCandidateVacancyStatus (_candidateEmail, _vacancyId, _newStatus) {
        const _data = {
            field_candidate_vacancy_status: _newStatus
        };
        const _query = {
            connector: this.connector,
            api_key: this.apiKey,
            field_candidate_email: _candidateEmail,
            field_vacancy_pertemps_id: _vacancyId
        };

        return this._sendRequestToNewApi('candidateVacancy', 'patch', _query, _data);
    }

    _sendRequestToNewApi (_targetGroup, _method, _query, _data) {
        const _axiosConfig = { method: _method };
        const _group = Number.isInteger(_targetGroup) ? _.toString(_targetGroup) : _.toString(this.globalConfig.get(`targetGroups.${_targetGroup}`));

        _axiosConfig.url = this.urlJoin(URL_API_NEW, _group, `?${this.querystring.stringify(_query)}`);

        if (_data) {
            _axiosConfig.data = _data;
        }

        if (this.userName && this.password) {
            _axiosConfig.auth = {
                username: this.userName,
                password: this.password
            };
        }

        return this.axios(_axiosConfig);
    }

    static _extractRecordsFromResponseWrapper (_config) {
        return function (_response) {
            if (!VALID_RESPONSE_STATUSES.includes(_response.status)) {
                throw new Error(`Request unsuccessful, exited with status code: ${_response.status}`);
            }
    
            if (_config.bNewAPI) {
                const _records = _.get(_response, 'data.results');
    
                if (_config.bSingleRecord) {
                    return _records[0];
                }
    
                return _records;
            }
    
            if (_.has(_response, 'data.objects')) {
                const _records = _.get(_response, 'data.objects');
    
                if (_config.bSingleRecord) {
                    return _records[0];
                }
    
                return _records;
            }
    
            return _.get(_response, 'data');
        }
    }
}

module.exports = AutologyxAPI;