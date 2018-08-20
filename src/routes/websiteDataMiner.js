'use strict';

const express = require('express');
const router = express.Router();

const WebsiteDataMiner = require('../scripts/WebsiteDataMiner');

router.post('/mine', function (_req, _res) {
    new WebsiteDataMiner(_req.body).process()
        .then(_results => {
            return _res.send({
                success: true,
                payload: _results
            });
        })
        .catch(_error => {
            return _res.send({
                success: false,
                payload: _error.message
            });
        });
});

module.exports = router;
