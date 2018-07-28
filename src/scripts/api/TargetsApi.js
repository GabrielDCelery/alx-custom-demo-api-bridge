'use strict';

const Api = require('./Api');

class TargetsApi extends Api {
    constructor (_url, _connector, _key, _type) {
        super (_url, _connector, _key);

        this.type = _type;
    }

    _generateQueryObj () {
        const _queryObj = super._generateQueryObj();

        _queryObj.type = this.type;

        if (this.limit) {
            _queryObj.limit = this.limit;
        }

        return _queryObj;
    }

    getRecords (_limit) {
        this.limit = _limit;

        return super.getRecords();
    }
}

module.exports = TargetsApi;
