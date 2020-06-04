import {app, BrowserWindow, Menu, dialog} from "electron";
import * as path from "path";
import ParseXML from "./core/ParseXML";
import OpenDialogReturnValue = Electron.OpenDialogReturnValue;
// import * as fs from 'fs';
import WordFileGenerator from "./core/WordFileGenerator";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    // @ts-ignore
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                click: () => {
                    app.exit(0);
                }
            }
        ]
    },
    {
        label: 'XML',
        submenu: [
            {
                label: 'Import XML',
                click: () => {
                    showOpen();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [
            {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
            {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
            {type: "separator"},
            {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
            {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
            {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
        ]
    }
]

const showOpen = (): void => {
    dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'XML', extensions: ['xml']}]})
        .then((result: OpenDialogReturnValue) => {
            if (!result.canceled) {
                const parseXML: ParseXML = new ParseXML(result.filePaths[0], mainWindow);
                const componentsPromise = parseXML.getComponentsArray();
                componentsPromise
                    .then(html => {
                        mainWindow.loadURL("data:text/html;charset=utf-8,"
                            + encodeURIComponent(html));

                        // fs.writeFileSync(`${result.filePaths[0]}.html`, html);
                        try {
                            const wordFileGenerator = new WordFileGenerator(html, `${result.filePaths[0]}.docx`);
                            wordFileGenerator.generateDocumentAndSaveFile();
                        } catch (e) {
                            console.error(e);
                        }
                    })
                    .catch(promiseError => {
                        console.error(promiseError)
                    mainWindow.loadURL("data:text/html;charset=utf-8,"
                        + encodeURIComponent(`<h2>${promiseError}</h2>`));
                    });
            }
        })

        .catch(error => console.error(error));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
