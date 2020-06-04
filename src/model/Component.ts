import License from './License'

interface Components {
    component: Component[]
}

interface Component {
    group: string[]
    name: string[]
    version: string[]
    description: string[]
    scope: string[]
    hashes: { hash: string }[]
    licenses: License[]
    purl: string[]
}

interface Vulnerability {
    id: string[]
    title: string[]
    description: string[]
    cvssScore: string[]
    cvssVector: string[]
    cve: string[]
    reference: string[]
}

interface Report {
    coordinates: string[]
    description: string[] | undefined
    reference: string[]
    vulnerabilities: Vulnerability[] | undefined
}

interface ExternalReference {
    _type: string
    url: string
}

interface TestCase {
    '$': {
        classname: string,
        name: string
    }
}

interface XMLFile {
    xml: string
    bom: {
        components: Components[]
        externalReferences: ExternalReference[]
    }
    componentReportExport: {
        reports: {
            entry: Report[]
        }[],
        vulnerable: {
            entry: Report[]
        }[],
        excludedVulnerabilities: {
            entry: Report[]
        }[],
        excludedCoordinates: {
            entry: Report[]
        }[]
    },
    testsuite: {
        '$': {
            tests: string,
            timestamp: string,
            failures: string
        },
        testcase: TestCase[]
    }
}

export {
    XMLFile,
    Component,
    ExternalReference,
    Components,
    Report,
    Vulnerability
};

export default XMLFile;
