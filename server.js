'use strict';

const config = require('config');
const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/candidate', require('./src/routes/candidate'));

app.listen(config.get('host.port'), config.get('host.host'));
