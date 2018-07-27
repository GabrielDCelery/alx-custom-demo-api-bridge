'use strict';

const PORT = 8080;
const HOST = '0.0.0.0';

const express = require('express');

const app = express();

app.use('/candidate', require('./routes/candidate'));

app.listen(PORT, HOST);
