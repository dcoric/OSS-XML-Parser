import {Parser} from 'xml2js';
import {Components, XMLFile} from '../model/Component';
import {detectBufferEncoding} from 'tslint/lib/utils';
import * as fs from 'fs';
import GenerateHTML from "./GenerateHTML";

class ParseXML {
    private parser = new Parser();
    private elements: string[] = ['<head><script type="application/javascript">function selectText(e){var t,n,o=document.getElementById(e);window.getSelection&&document.createRange?""==(t=window.getSelection()).toString()&&window.setTimeout(function(){(n=document.createRange()).selectNodeContents(o),t.removeAllRanges(),t.addRange(n),document.execCommand("copy")},1):document.selection&&""==(t=document.selection.createRange()).text&&((n=document.body.createTextRange()).moveToElementText(o),n.select(),setTimeout(document.execCommand("copy"),10))}</script> </head></head><body id="whole-body" onclick="selectText(this.id)"><div>'];

    constructor(private _xmlPath: string, private _window?: Electron.BrowserWindow) {
    }

    set xmlPath(newPath: string) {
        this._xmlPath = newPath;
    }

    get xmlPath(): string {
        return this._xmlPath;
    }

    getComponentsArray = (): Promise<string> => {
        const filePath = this.xmlPath;
        const promise: Promise<string> = new Promise((resolve, reject) => {
            fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if (err) throw err;
                this.parser.parseStringPromise(
                    data.toString(
                        'utf-8'
                    )
                )
                    .then((parsingResult: XMLFile) => {
                        let htmlGenerator;
                        if (parsingResult.bom) {
                            console.log('Parsing as bom file');
                            const componentsArray: Components[] = parsingResult.bom.components;
                            htmlGenerator = new GenerateHTML({components: componentsArray});
                        } else if (parsingResult.componentReportExport) {
                            console.log('Parsing as componentReportExport file');
                            const componentReportExport = parsingResult.componentReportExport;
                            const reports = componentReportExport.reports[0].entry;
                            const vulnerableEntries = componentReportExport.vulnerable[0].entry;
                            const excludedVulnerabilities = componentReportExport.excludedVulnerabilities[0].entry;
                            const excludedCoordinates = componentReportExport.excludedCoordinates[0].entry;
                            htmlGenerator = new GenerateHTML(
                                {
                                    reportEntries: reports,
                                    vulnerableEntries, excludedVulnerabilities, excludedCoordinates
                                }
                            );
                        } else if (parsingResult.testsuite) {
                            console.log('Parsing as TestSuite');
                            const numberOfTests = parsingResult.testsuite.$.tests;
                            const numberOfFailures = parsingResult.testsuite.$.failures;
                            const timestamp = new Date(parsingResult.testsuite.$.timestamp);
                            const testCaseArray = parsingResult.testsuite.testcase;
                            htmlGenerator = new GenerateHTML(
                                {numberOfTests, numberOfFailures, timestamp, testCaseArray}
                            );
                        } else {
                            console.log('XML Format is not supported', parsingResult);
                            reject({message: 'XML Format is not supported', code: parsingResult});
                        }
                        resolve(htmlGenerator.getHTML());
                    })
                    .catch((parseError: Error | null) => {
                        // TODO: show dialog
                        reject(parseError.message);
                    });
            });
        });
        return promise;
    }
}

export default ParseXML;
