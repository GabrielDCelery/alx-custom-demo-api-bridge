'use strict';

const config = require('config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/', require('./routes/main'));
app.use('/auth0', require('./routes/auth0'));
app.use('/email', require('./routes/email'));
app.use('/websitedataminer', require('./routes/websiteDataMiner'));
app.use('/candidate', require('./routes/candidate'));

app.listen(config.get('host.port'), config.get('host.host'));
