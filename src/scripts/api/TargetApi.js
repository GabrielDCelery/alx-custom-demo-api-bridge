'use strict';

const _ = require('lodash');
const urlJoin = require('url-join');
const Api = require('./Api');

class TargetApi extends Api {
    constructor (_url, _connector, _key, _targetId) {
        super(urlJoin(_url, _.toString(_targetId)), _connector, _key);
    }
}

module.exports = TargetApi;
