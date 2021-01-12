const electron = require('electron');
// Module to control application life.

const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const livestream = require('./livestream.js')
// const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const dialog = electron.dialog;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
});

dialog.showErrorBox = function (title, content) {
    console.log(`${title}\n${content}`);
};

let mainWindow

app.on('ready', async () => {
    try {
        mainWindow = new BrowserWindow({
            // resizable: false,
            width: 1500, height: 1000,
            webPreferences: {
                nodeIntegration: true,
                preload: __dirname + '/preload.js'
            }
        });


        mainWindow.loadURL(startUrl);
        // mainWindow.webContents.openDevTools();
        // await livestream.updateCameraSocket()
        // livestream.livestream()



        mainWindow.on('closed', function () {

            mainWindow = null
        })
    } catch (error) {
        console.log(error)
    }



});

