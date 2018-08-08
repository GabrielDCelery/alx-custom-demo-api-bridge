'use strict';

const fs = require('fs');
const PDFDocument = require('pdfkit');

class PdfGenerator {
    constructor () {
        this.writeStream = null;
        this.doc = new PDFDocument();
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