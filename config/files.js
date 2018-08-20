'use strict';

const path = require('path');

module.exports = {
    tmpFolderPath: path.join(__dirname, '../tmp'),
    images: {
        logoExperian: path.join(__dirname, '../src/lib/logo_experian.png'),
        footerCreditExpert: path.join(__dirname, '../src/lib/footer_credit_expert.png')
    }
};