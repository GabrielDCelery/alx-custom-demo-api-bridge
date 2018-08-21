'use strict';

const alxApiConfig = require('config').get('alxAPI');
const express = require('express');
const router = express.Router();

const PayloadValidator = require('../scripts/utils/PayloadValidator');
const Candidates = require('../scripts/controllers/Candidates');
const CandidateVacancies = require('../scripts/controllers/CandidateVacancies');
const ExternalAdaptDataSynchronizer = require('../scripts/controllers/ExternalAdaptDataSynchronizer');

router.get('/', function (_req, _res) {
    return _res.send('Please provide a candidate id in the URL!');
});

router.get('/:candidateId', (_req, _res) => {
    const _alxConnectorConfig = {
        alxConnector: alxApiConfig.connector,
        alxApiKey: alxApiConfig.key
    };

    const candidates = new Candidates(_alxConnectorConfig);
    const candidateVacancies = new CandidateVacancies(_alxConnectorConfig);
    const externalAdaptDataSynchronizer = new ExternalAdaptDataSynchronizer(_alxConnectorConfig);

    const _payload = {
        candidate: {
            firstName: '',
            lastName: '',
            email: ''
        },
        applications: []
    };

    candidates.getRecordById(_req.params.candidateId)
        .then(_candidateRecord => {
            _payload.candidate = _candidateRecord;

            //return externalAdaptDataSynchronizer.start(_payload.candidate.email);
        })
        .then(() => {
            return Promise.all([
                candidates.getRecordById(_req.params.candidateId),
                candidateVacancies.getListOfApplications(_payload.candidate.email)
            ]);
        })
        .then(_results => {
            const [_candidate, _applications] = _results;

            _payload.candidate = _candidate;
            _payload.applications = _applications;
            
            return _res.render('candidateVacancies', {
                success: true,
                payload: _payload
            });
        })
        .catch(_error => {
            return _res.render('candidateVacancies', {
                success: false,
                payload: _error.message
            });
        });
});

router.post('/syncCandidateVacancy', (_req, _res) => {
    try {
        new PayloadValidator(_req.body).checkProperties([
            'candidate_email',
            'vacancy_id'
        ]);
    } catch (_error) {
        return _res.json({ 
            success: false,
            message: _error.message
        });
    }

    const candidateVacancies = new CandidateVacancies({
        alxConnector: alxApiConfig.connector,
        alxApiKey: alxApiConfig.key
    });

    candidateVacancies.syncCandidateVacancy(_req.body.candidate_email, _req.body.vacancy_id)
        .then(() => {
            return _res.json({ 
                success: true,
                message: null
            });
        })
        .catch(_error  => {
            return _res.json({ 
                success: false,
                message: _error.message
            });
        });
});

module.exports = router;
