'use strict';

const _ = require('lodash');
const AutologyxAPI = require('../api/AutologyxAPI');

const DEFAULT_CONFIG = {
    alxConnector: null,
    alxApiKey: null
};

class Candidates {
    constructor (_config) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.autologyxAPI = new AutologyxAPI(this.config.alxConnector, this.config.alxApiKey, this.config.alxUsername, this.config.alxPassword);
    }

    getRecordById (_candidateId) {
        return this.autologyxAPI.getCandidateById(_candidateId);
    }
}

module.exports = Candidates;