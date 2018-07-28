'use strict';

const axios = require('axios');
const querystring = require('querystring');

class Api {
    constructor (_url, _connector, _key) {
        this.url = _url;
        this.connector = _connector;
        this.key = _key;
        this.authenticator = {
            generateAxiosCompatibleObj: () => {
                return null;
            }
        };
    }

    setAuthenticator (_authenticator) {
        this.authenticator = _authenticator;
    }

    _generateQueryObj () {
        return {
            connector: this.connector,
            api_key: this.key,
        };
    }

    _generateRequestUrl () {
        return `${this.url}?${querystring.stringify(this._generateQueryObj())}`;
    }

    getRecords () {
        const _axiosConfig = {
            method: 'get',
            url: this._generateRequestUrl()
        };

        const _authObj = this.authenticator.generateAxiosCompatibleObj();

        if (_authObj) {
            _axiosConfig.auth = _authObj;
        }

        return axios(_axiosConfig);
    }
}

module.exports = Api;