import {asBlob} from 'html-docx-js-typescript';
import * as fs from 'fs';

class WordFileGenerator {
    private readonly html: string;
    private readonly fileName: string;

    constructor(html: string, fileName: string) {
        this.html = html;
        if (!fileName.toLowerCase().endsWith('.docx')) fileName += '.docx';
        this.fileName = fileName;
    }

    generateDocumentAndSaveFile = (): void => {
        if (!this.html || !this.fileName) throw new Error('HTML and filename must exist before generating file');
        asBlob(this.html)
            .then((generatedDocxBuffer: Buffer) => {
                fs.writeFileSync(this.fileName, generatedDocxBuffer);
            })
            .catch(error => {
                throw error;
            });
    }
}

export default WordFileGenerator;
