import ParseXML from "./core/ParseXML";
import {argv} from "yargs";
import WordFileGenerator from "./core/WordFileGenerator";
import * as path from 'path';
import * as fs from 'fs';

function main() {
    const inputFile = argv.input.toString();
    const outputFile = argv.output
        ? argv.output.toString()
        : argv.input.toString()
            .replace('.xml', '.docx')
            .replace('.XML', '.docx');
    console.log('Input:', inputFile);
    console.log('Output', outputFile);
    if (inputFile) {
        if (inputFile.toLowerCase().endsWith('*.xml')) {
            console.log('Running wildcard:');
            const directoryPath = path.join(
                __dirname, inputFile
                    .replace('*.xml', '')
                    .replace('*.XML', '')
            );
            fs.readdir(directoryPath,  (err, files) => {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                files.forEach((file) => {
                    // Do whatever you want to do with the file
                    console.log(file);
                    if (file.toLowerCase().endsWith('.xml')) {
                        const output = file.toLowerCase().replace('.xml', '.docx');
                        generateWordFromInputFile(
                            path.join(directoryPath, file),
                            path.join(directoryPath, output)
                        );
                    }
                });
            });
        } else {
            generateWordFromInputFile(
                path.join(__dirname, inputFile),
                path.join(__dirname, outputFile)
            );
        }

    } else {
        console.error('Input file is required and must be XML');
        return;
    }
}

const generateWordFromInputFile = (inputFile: string, outputFile: string) => {
    console.log('Parsing input', inputFile);
    console.log('Outputting', outputFile);
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
}

main();
export default main;