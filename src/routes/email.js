'use strict';

const express = require('express');
const router = express.Router();

const PdfEmailer = require('../scripts/PdfEmailer');
const pdfEmailer = new PdfEmailer();

router.post('/pdf', function (_req, _res) {
    pdfEmailer.sendPdf(_req.body)
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
