'use strict';

const express = require('express');
const router = express.Router();

const Auth0Connector = require('../scripts/Auth0Connector');
const auth0connector = new Auth0Connector();

router.post('/', function (_req, _res) {
    auth0connector.forwardRequest(_req.body)
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
