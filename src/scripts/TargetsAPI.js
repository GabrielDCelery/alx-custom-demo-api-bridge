'use strict';

const _ = require('lodash');

const querystring = require('querystring');
const path = require('path');
const config = require('config');
const axios = require('axios');

const REQUEST_LIMIT = 1000;

class TargetsApi {
    getTargets (_type) {
        const _query = {
            connector: config.get('api.connector'),
            api_key: config.get('api.key'),
            limit: REQUEST_LIMIT,
            type: _type
        };
        const _url = `${config.get('api.url')}?${querystring.stringify(_query)}`;
    }

    getSingleTarget (_targetId) {
        const _query = {
            connector: config.get('api.connector'),
            api_key: config.get('api.key')
        };
        const url = `${path.join(config.get('api.url'), _targetId)}?${querystring.stringify(_query)}`;
    }
}

module.exports = TargetsApi;
