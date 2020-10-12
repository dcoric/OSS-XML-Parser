import ParseXML from "./core/ParseXML";
import {argv} from "yargs";
import WordFileGenerator from "./core/WordFileGenerator";
import * as path from 'path';

function main() {
    const inputFile = path.join(__dirname, argv.input.toString());
    const outputFile = path.join(__dirname, argv.output ? argv.output.toString() : argv.input.toString() + '.docx');
    console.log('Input:', inputFile);
    console.log('Output', outputFile);
    if (inputFile && inputFile.toLowerCase().endsWith('.xml')) {
        const parseXML: ParseXML = new ParseXML(inputFile);
        const componentsPromise = parseXML.getComponentsArray();
        componentsPromise
            .then(html => {
                console.log('Successfuly parsed');
                try {
                    const wordFileGenerator = new WordFileGenerator(html, outputFile);
                    wordFileGenerator.generateDocumentAndSaveFile();
                } catch (e) {
                    console.error(e);
                }
            })
            .catch(promiseError => {
                console.error(promiseError);
            });
    } else {
        console.error('Input file is required and must be XML');
        return;
    }
}

main();
export default main;