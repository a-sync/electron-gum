'use strict';
const {app, ipcMain, BrowserWindow} = require('electron');
//app.commandLine.appendSwitch('--allow-http-screen-capture');
//app.commandLine.appendSwitch('--enable-usermedia-screen-capturing');

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();
require('electron-unhandled')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = null;
}

function createMainWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            preload: require('path').join(__dirname, 'preload.js')
        }
    });

    const url = require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, 'index.html')
    });

    win.loadURL(url);
    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});
