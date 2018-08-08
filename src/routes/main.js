'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (_req, _res) {
    return _res.send('Pertemps demo site');
});

module.exports = router;
