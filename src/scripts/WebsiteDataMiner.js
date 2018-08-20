'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');

const DEFAULT_CONFIG = {
    url: null,
    selectorMap: {}
};

class WebsiteDataMiner {
    constructor (_config = {}) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.$ = null;
    }

    process () {
        return WebsiteDataMiner.sendRequestAsPromise({
            method: 'GET',
            url: this.config.url,
            headers: {
                'content-type': 'application/json'
            }
        }).then(_response => {
            this.$ = cheerio.load(_response);

            const _results = {};

            _.forEach(this.config.selectorMap, (_v, _k) => {
                let _value = WebsiteDataMiner.normalizeValue(this.$(_v).text());

                _value = typeof _value === 'string' ? _value.trim() : _value;
                _results[_k] = _.toString(_value) || 'Could not find value';
            });

            return _results;
        });
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

    static normalizeValue (_value) {
        try {
            return JSON.parse(_value);
        } catch (_error) {
            return _value;
        }
    }
}

module.exports = WebsiteDataMiner;