'use strict';

const _ = require('lodash');
const config = require('config');
const path = require('path');
const express = require('express');
const router = express.Router();

const PdfGenerator = require('../scripts/PdfGenerator');
const Emailer = require('../scripts/Emailer');

router.post('/sendrandompdf', function (_req, _res) {
    const _filePath = path.join(config.get('files.tmpFolderPath'), 'random.pdf');

    let _randomString = '';

    for(let _i = 0, _iMax = 100; _i < _iMax; _i++) {
        _randomString += Math.random().toString(36).substring(2, 15);
    }

    new PdfGenerator().addText(_randomString)
        .writeOut(_filePath)
        .then(() => {
            return new Emailer().sendPdf(_req.body, _filePath);
        })
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
