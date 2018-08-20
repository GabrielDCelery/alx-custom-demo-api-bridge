'use strict';

const _ = require('lodash');
const fs = require('fs');
const PDFDocument = require('pdfkit');


const DEFAULT_CONFIG = {
    init: {
        layout: 'portrait',
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    }
}

class PdfGenerator {
    constructor (_config) {
        this.config = _.defaultsDeep({}, _config, DEFAULT_CONFIG);
        this.writeStream = null;
        this.doc = new PDFDocument({ autoFirstPage : false });
        this.doc.addPage(this.config.init);
    }

    callMethod (_method, _arguments = []) {
        Reflect.apply(this.doc[_method], this.doc, _arguments);

        return this;
    }

    addText (_text) {
        this.doc.text(_text);

        return this;
    }

    writeOut (_path) {
        try {
            this.writeStream = fs.createWriteStream(_path);
        } catch (_error) {
            return Promise.reject(_error);
        }

        return new Promise((_accept, _reject) => {
            this.doc.pipe(this.writeStream)
                .on('finish', () => {
                    return _accept(true);
                })
                .on('error', _reject);
            this.doc.end();
        });
    }
}

module.exports = PdfGenerator;