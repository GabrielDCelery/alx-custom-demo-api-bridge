'use strict';

const express = require('express');
const router = express.Router();

const CandidateVacancies = require('../scripts/CandidateVacancies');

const cv = new CandidateVacancies();

router.get('/:candidateId', function (_req, _res) {
    //cv.getVacancies(parseInt(_req.params.candidateId))
    const _response = { 
        candidate: { 
            firstName: 'Derek', 
            lastName: 'Danquah' 
        },
        applications: [
            [ '5', 'Developer', 'IBM', 'Applied' ],
            [ '3', 'Cleaner', 'Autologyx', 'Rejected' ] 
        ] 
    };
  
    return Promise.resolve(_response)
        .then(_results => {
            return _res.render('candidateVacancies', {
                success: true,
                payload: _results
            });
        })
        .catch(_error => {
            return _res.render('candidateVacancies', {
                success: false,
                payload: _error.message
            });
        });
});

module.exports = router;
