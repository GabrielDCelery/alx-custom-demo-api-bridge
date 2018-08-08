'use strict';

const _ = require('lodash');
const config = require('config');
const request = require('request');

// Used reques, because axios was throwing errors and we don't have the time to debug (look into it later)

class Auth0Connector {
    constructor() {
        this.audienceUrl = config.get('auth0.audienceUrl');
        this.tokenUrl = config.get('auth0.tokenUrl')
    }

    _getAccessTokenFromAuth0(_clientId, _clientSecret) {
        let _options = null;
        
        try {
            _options = {
                method: 'post',
                url: this.tokenUrl,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: _clientId, 
                    client_secret: _clientSecret, 
                    audience: this.audienceUrl, 
                    grant_type: 'client_credentials'
                })
            };
        } catch (_error) {
            return Promise.reject(_error);
        }
        
        return Auth0Connector.sendRequestAsPromise(_options)
            .then(_response => {
                const _accessToken = _.get(Auth0Connector.tryJSONparse(_response), 'access_token', null);

                if (!_accessToken) {
                    throw new Error('Request failed to get an access token!');
                }

                return _accessToken;
            });
    }

    forwardRequest(_requestConfig) {
        let _method = null;
        let _url = null;
        let _clientId = null;
        let _clientSecret = null;

        try {
            _method = Auth0Connector._validateConfig(_.get(_requestConfig, 'method', null), 'request method').toLowerCase();
            _url = Auth0Connector._validateConfig(_.get(_requestConfig, 'url', null), 'request url');
            _clientId = Auth0Connector._validateConfig(_.get(_requestConfig, 'auth.client_id', null), 'client id');
            _clientSecret = Auth0Connector._validateConfig(_.get(_requestConfig, 'auth.client_secret', null), 'client secret');
        } catch (_error) {
            return Promise.reject(_error);
        }

        return this._getAccessTokenFromAuth0(_clientId, _clientSecret)
            .then(_accessToken => {
                const _options = {
                    method: _method,
                    url: _url,
                    headers: {
                        'authorization': `Bearer ${_accessToken}`,
                        'content-type': 'application/json'
                    }
                };

                const _body = _.get(_requestConfig, 'body', null);

                if (_body) {
                    _options.body = JSON.stringify(_body);
                }

                return Auth0Connector.sendRequestAsPromise(_options);
            })
            .then(Auth0Connector.tryJSONparse);
    }

    static _validateConfig(_value, _name) {
        if (!_value) {
            throw new Error(`Failed to send a ${_name}`);
        }

        return _value;
    }

    static sendRequestAsPromise (_options) {
        return new Promise((_accept, _reject) => {
            request(_options, (_error, response, _body) => {
                if (_error) {
                    return _reject(_error)
                }

                return _accept(_body);
            });
        })
    }

    static tryJSONparse (_response) {
        try {
            return JSON.parse(_response);
        } catch (_error) {
            return _response;
        }
    }
}

module.exports = Auth0Connector;