'use strict';

const express = require('express');
const router = express.Router();

const PayloadValidator = require('../scripts/utils/PayloadValidator');
const Candidates = require('../scripts/controllers/Candidates');
const CandidateVacancies = require('../scripts/controllers/CandidateVacancies');
//const VacancyStatusChange = require('../scripts/controllers/VacancyStatusChange');
const ExternalAdaptDataSynchronizer = require('../scripts/controllers/ExternalAdaptDataSynchronizer');

router.get('/', function (_req, _res) {
    return _res.send('Please provide a candidate id in the URL!');
});

router.get('/:candidateId', (_req, _res) => {
    const candidates = new Candidates({
        alxConnector: 'pcj_test_api',
        alxApiKey: 'a35c447294f010bb41ccc3e43eab6c72107b43de'
    });
    const candidateVacancies = new CandidateVacancies({
        alxConnector: 'pcj_test_api',
        alxApiKey: 'a35c447294f010bb41ccc3e43eab6c72107b43de'
    });
    const externalAdaptDataSynchronizer = new ExternalAdaptDataSynchronizer({
        alxConnector: 'pcj_test_api',
        alxApiKey: 'a35c447294f010bb41ccc3e43eab6c72107b43de'
    });

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
            console.log(_results)
            const [_candidate, _applications] = _results;

            _payload.candidate = _candidate;
            _payload.applications = _applications;
            
            return _res.render('candidateVacancies', {
                success: true,
                payload: _payload
            });
        })
        .catch(_error => {
            console.log(_error)
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
            'vacancy_id',
            'connector',
            'api_key'
        ]);
    } catch (_error) {
        return _res.json({ 
            success: false,
            message: _error.message
        });
    }

    const candidateVacancies = new CandidateVacancies({
        alxConnector: _req.body.connector,
        alxApiKey: _req.body.api_key
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
