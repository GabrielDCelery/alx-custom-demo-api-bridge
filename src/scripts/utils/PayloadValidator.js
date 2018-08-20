'use strict';

const _ = require('lodash');

class PayloadValidator {
    constructor (_payload = {}) {
        this.payload = _payload;
    }

    checkProperty (_property) {
        if (_.isNil(this.payload[_property])) {
            throw new Error(`Payload missing property -> ${_property}`);
        }

        return this;
    }

    checkProperties (_properties) {
        _properties.forEach(_property => {
            this.checkProperty(_property);
        });

        return this;
    }
}

module.exports = PayloadValidator;