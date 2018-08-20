'use strict';

const _ = require('lodash');
const config = require('config');
const path = require('path');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const PdfGenerator = require('../scripts/PdfGenerator');
const Emailer = require('../scripts/Emailer');

function createCreditCheckPdf (_firstName = 'FIRST NAME', _lastName = 'LAST NAME', _filePath) {
    let _fingerPrint = '';

    for(let _i = 0, _iMax = 5; _i < _iMax; _i++) {
        _fingerPrint += Math.random().toString(36).substring(2, 15);
    }

    return new PdfGenerator()
        .callMethod('image', [config.get('files.images.logoExperian'), 15, 15, { fit: [100, 50] }])
        .callMethod('font', ['Times-Roman', 8])
        .callMethod('text', ['SAMPLE REPORT - The information in this report is fictious and it to be used for training and educational purposes only.', 50, 80, { width: 200, align: 'justify'}])
        .callMethod('moveDown')
        .callMethod('font', ['Times-Roman', 6])
        .callMethod('text', [`Mock_Report_${_fingerPrint}`, 50, 740])
        .callMethod('moveDown', [3])
        .callMethod('font', ['Times-Roman', 8])
        .callMethod('text', ['Our reference: 00000000/A1', 50, 140])
        .callMethod('text', ['Please quote on all correspondence'])
        .callMethod('moveDown')
        .callMethod('text', [`Date of Report: ${moment(new Date()).format('DD MMMM YYYY')}`])
        .callMethod('moveDown')
        .callMethod('text', ['0000001/0000003/00/2of9'])
        .callMethod('font', ['Times-Roman', 9])
        .callMethod('text', [`${_firstName} ${_lastName}`])
        .callMethod('text', ['186, HIGH STREET'])
        .callMethod('text', ['ANYTOWN'])
        .callMethod('text', ['MIDSHIRE'])
        .callMethod('text', ['A12 4CD'])
        .callMethod('text', ['Customer Support Centre', 465, 140])
        .callMethod('text', ['PO Box 9000'])
        .callMethod('text', ['Nottingham NG80 70WP'])
        .callMethod('text', [`DEAR ${_lastName}`, 50, 270])
        .callMethod('moveDown')
        .callMethod('text', ['Your Credit Report'])
        .callMethod('moveDown')
        .callMethod('text', ['Thank you for applying for a credit report. Your report includes all the information we hold about you at the addresses shown on page2. Information may be printed on both sides of thepaper', { width: 510, align: 'justify' }])
        .callMethod('moveDown')
        .callMethod('text', ['We have included an advice section at the back of the report to explain the different types of information that may be shown in your report and the steps you should take if you have any questions. Please use this information to answer your queries. If you have any questions about the information companies have given to us, you may want to get in touch with them because we need their authorisation to make changes to your report. A list of useful addresses is included in your report.', { width: 510, align: 'justify' }])
        .callMethod('moveDown')
        .callMethod('text', ['The quickest way to get help with your report is to visit our websit ewww.experian.co.uk, click on Consumer Advice and then Your Credit Report Help Centre. If you need to contact us about the information on your report you can also do this from our website. Please remember to quote the reference number at the top of this page. Please also provide the number of each item you are querying (these are printed directly above the item they relate to e.g.E1,C4,P2).', { width: 510, align: 'justify' }])
        .callMethod('moveDown')
        .callMethod('text', ['In the future you may find it more convenient to take advantage of our online CreditExpert service where membership gives you:', { width: 510, align: 'justify' }])
        .callMethod('text', ['- Unlimited access to your credit report and Experian credit score', { width: 510, align: 'justify' }])
        .callMethod('text', ['- Dedicated member support from our UK based credit specialists', { width: 510, align: 'justify' }])
        .callMethod('text', ['- Online credit tips and tools to help you manage your money', { width: 510, align: 'justify' }])
        .callMethod('text', ['- Email or text alerts of any significant changes to your credit status helping protect you from identity fraud', { width: 510, align: 'justify' }])
        .callMethod('moveDown', [2])
        .callMethod('text', ['To find out more and join, simply visit; www.creditexpert.co.uk. In some cases we may ask for documents to confirm your name and address.', { width: 510, align: 'justify' }])
        .callMethod('moveDown', [2])
        .callMethod('text', ['Customer Support Centre', { width: 510, align: 'justify' }])
        .callMethod('image', [config.get('files.images.footerCreditExpert'), 45, 630, { fit: [610, 100] }])
        .callMethod('fillColor', ['orange'])
        .callMethod('font', ['Times-Roman', 50])
        .callMethod('rotate', [-10, { origin: [-20, 400]}])
        .callMethod('text', ['Sample report only', 0, 400, { align: 'center' }])
        .writeOut(_filePath);
}

router.post('/sendrandompdf', function (_req, _res) {
    const _filePath = path.join(config.get('files.tmpFolderPath'), 'random.pdf');

    createCreditCheckPdf(_.get(_req, 'body.target.firstName', null), _.get(_req, 'body.target.lastName', null), _filePath)
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
