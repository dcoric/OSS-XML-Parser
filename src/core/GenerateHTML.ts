import {Components, Report} from "../model/Component";
import * as _ from 'lodash';

enum TYPES {
    UNKNOWN_TYPE = '_'
}

export default class GenerateHTML {
    private readonly components: Components[];
    private readonly reportEntries: Report[];
    private readonly vulnerableEntries: Report[];
    private readonly excludedVulnerabilities: Report[];
    private readonly excludedCoordinates: Report[];
    private readonly numberOfTests: string;
    private readonly numberOfFailures: string;
    private readonly timestamp: Date;
    private readonly testCaseArray: string;
    constructor(htmlProperties: any) {
        const {components,
            reportEntries,
            vulnerableEntries,
            excludedVulnerabilities,
            excludedCoordinates,
            numberOfTests,
            numberOfFailures,
            timestamp,
            testCaseArray} = htmlProperties;
        this.components = components;
        this.reportEntries = reportEntries;
        this.vulnerableEntries = vulnerableEntries;
        this.excludedVulnerabilities = excludedVulnerabilities;
        this.excludedCoordinates = excludedCoordinates;
        this.numberOfTests = numberOfTests;
        this.numberOfFailures = numberOfFailures;
        this.timestamp = timestamp;
        this.testCaseArray = testCaseArray;
    }

    private renderReportEntries(reportEntries: Report[], elements: string[], groupTitle: string): void {
        elements.push(...[
            '<h3>',
            groupTitle,
            '</h3>'
        ]);
        _.each(reportEntries, (entry: any) => {
            const {key: nameArray, value: valueArray} = entry;
            const key = nameArray[0];
            const value = valueArray[0];
            const {coordinates, description, reference, vulnerabilities} = value;

            elements.push(...[
                `<h4>Dependency</h4>`,
                `<p>${key}</p>`,
                `<p><b>Coordinates:</b> ${coordinates[0]}</p>`,
                `<p><b>Description:</b> ${description ? description[0] : ''}</p>`,
                `<p><b>Reference:</b> ${reference[0]}</p>`,
                `<p>Vulnerabilities: ${!(vulnerabilities && vulnerabilities.length && vulnerabilities[0]) ? 0 : ''} </p>`
            ]);

            if (vulnerabilities && vulnerabilities.length) {
                elements.push(...[
                    `<ul>`
                ]);
                _.each(vulnerabilities[0].vulnerability, (vulnerability: any) => {
                    if (!vulnerability) return;
                    // tslint:disable-next-line:no-shadowed-variable
                    const {id, title, description, cvssScore, cvssVector, cve, reference} = vulnerability;
                    elements.push(...[
                        '<li>',
                        `<p><b>ID:</b> ${id[0]}</p>`,
                        `<p><b>Title:</b> ${title[0]}</p>`,
                        `<p><b>Description:</b> ${description[0]}</p>`,
                        `<p><b>CVSS Score:</b> ${cvssScore[0]}</p>`,
                        `<p><b>CVSS Vector:</b> ${cvssVector[0]}</p>`,
                        `<p><b>CVE:</b> ${cve[0]}</p>`,
                        `<p><b>Reference:</b> ${reference[0]}</p>`,
                        '</li>'
                    ]);
                });
                elements.push(...[
                    `</ul>`
                ]);
            } else {
                return;
            }
        });
    }

    private renderReportHTML(): string {
        const elements: string[] = [];
        const reportEntries = [...(this.reportEntries || [])];
        const vulnerableEntries = [...(this.vulnerableEntries || [])];
        const excludedVulnerabilities = [...(this.excludedVulnerabilities || [])];
        const excludedCoordinates = [...(this.excludedCoordinates || [])];
        this.renderReportEntries(reportEntries, elements, 'Reports');
        this.renderReportEntries(vulnerableEntries, elements, 'Vulnerables');
        this.renderReportEntries(excludedVulnerabilities, elements, 'Excluded Vulnerabilities');
        this.renderReportEntries(excludedCoordinates, elements, 'Excluded Coordinates');
        elements.push('</div></body>');
        return elements.join('');
    }

    private renderComponentsHTML(): string {
        {
            const elements: string[] = [];
            const licenseTypes: any = {};
            const components = this.components;
            if (Array.isArray(components)) {
                const component = components[0].component;
                if (component && component.length) {
                    _.each(component, (cmpt) => {
                        const {group, name, version, purl, licenses} = cmpt;
                        const license = _.get(licenses, '[0].license[0]', {});
                        if (license.id) licenseTypes[license.id] = license.text;
                        elements.push(...[
                            `<h4>Dependency</h4>`,
                            `<p>${purl}</p>`,
                            `<b>Group-id:</b> ${group}</p>`,
                            `<p><b>Artifact-id:</b> ${name}</p>`,
                            `<p><b>Version:</b> ${version}</p>`,
                            `<p>Licenses:</p>`,
                            license.id ? `<ul><li><a href="#${license.id}">${license.id}</a></li></ul>` : ''
                        ]);
                    });
                    elements.push('</div>');
                    _.forEach(licenseTypes, (licenseText, id) => {
                        if (id && id !== 'undefined') {
                            elements.push(...[
                                `<h3 id='${id}'>${id}</h3>`,
                                `<div>${licenseText[0][TYPES.UNKNOWN_TYPE]}</div>`
                            ]);
                        }
                    });
                    elements.push('</div></body>');
                    return elements.join('');
                }
            }
        }
    }

    private renderTestSuiteHTML(): string {
        return `<h1>Number of tests: ${this.numberOfTests}</h1>`;
    }

    public getHTML(): string {
        if (this.reportEntries && this.reportEntries.length) {
            return this.renderReportHTML();
        }

        if (this.components && this.components.length) {
            return this.renderComponentsHTML();
        }

        if (this.numberOfTests) {
            return this.renderTestSuiteHTML();
        }
        return '<h1>Unknown file type</h1>';
    }
}
