# XML converter

## Project requirements:

* Node 12.x.x and up

## Starting and building project

* run `npm install` or `yarn install`
* for starting run `npm start` or `yarn start`
* to build windows installer run `npm run build-win` or `yarn build-win`
    * installer will be inside `dist/` folder 


## Supported XML formats:

- oss review toolkit BOM file</li>
- Sonatype OSS index scan</li>

## Importing XML File
    
Select **XML** from File Menu, and **Import XML**
File will be automatically parsed and the results will be displayed on the screen

## Generate Word File

Word file output is automatically generated in same folder XML is found and the file name will match XML file name

### Example:
XML file location: `C:\Users\example\Desktop\bom.xml`

Output Word file: `C:\Users\example\Desktop\bom.xml.docx`

## Possible Errors

If the XML format is not supported, the user will see the message on the screen.
