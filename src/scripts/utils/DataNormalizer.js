'use strict';

const _ = require('lodash');
const moment = require('moment');

class DataNormalizer {
    static convertDateToUkLocale (_dateValue) {
        if (_.isNil(_dateValue) || _dateValue === '') {
            return '';
        }

        return moment(new Date(_dateValue)).format('DD/MM/YYYY');
    }
}

module.exports = DataNormalizer;