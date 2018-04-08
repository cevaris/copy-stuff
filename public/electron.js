const {app, clipboard, globalShortcut, BrowserWindow} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const Datastore = require('nedb');
global.db = new Datastore({
    filename: 'var/data.db',
    autoload: true
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });

    app.dock.hide();
    win.setAlwaysOnTop(true, "floating");
    win.setVisibleOnAllWorkspaces(true);
    win.setFullScreenable(false);
    win.hide();

    win.on('blur', () => {
        console.log('hiding');
        win.hide();
    });

    globalShortcut.register('ctrl+super+v', () => {
        console.log('ctrl+super+v is pressed');
        win.show();
    });

    console.log('launching window');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
        installExtension(extension)
            .then((name) => console.log(`Added Extension: ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });

    console.log('ready');

    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    console.log('window-all-closed');
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    console.log('activate');
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
global.currentClipboard = () => {
    return clipboard.readText() || clipboard.readText('selection');
};

global.hide = () => {
    win.hide();
};
