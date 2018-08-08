'use strict';

const _ = require('lodash');
const path = require('path');
const nodeMailer = require('nodemailer');

const DEFAULT_EMAIL_CONFIG = {
    provider: {
        name: "ALX",
        service: "Gmail",
        email: "foo@bar.com",
        password: "FooBar"
    },
    recipient: {
        email: "bar@foo.com",
        subject: "Pdf document",
        text: "Yaaay",
        html: null,
        fileName: "file.pdf"
    }
}

class PdfEmailer {
    sendPdf (_emailConfig) {
        const _config = _.defaultsDeep({}, _emailConfig, DEFAULT_EMAIL_CONFIG);

        return new Promise((_accept, _reject) => {
            const transporter = nodeMailer.createTransport({
                service: _config.provider.service,
                auth: {
                    user: _config.provider.email,
                    pass: _config.provider.password
                }
            });

            const _mailOptions = {
                from: `"${_config.provider.name}" <${_config.provider.email}>`,
                to: _config.recipient.email,
                subject: _config.recipient.subject,
                text: _config.recipient.text,
                html: _config.recipient.html,
                attachments: [{
                    filename: _config.recipient.fileName,
                    path: path.join(__dirname, '../files/test.pdf'),
                    contentType: 'application/pdf'
                }]
            };

            transporter.sendMail(_mailOptions, (_error, _info) => {
                if (_error) {
                    return _reject(_error);
                }

                return _accept(_info);
            });
        });
    }
}

module.exports = PdfEmailer;