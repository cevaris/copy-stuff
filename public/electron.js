const {app, clipboard, globalShortcut, BrowserWindow, Menu} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const robot = require('robotjs');

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

    app.dock.hide(); //hides app in alt+tab dock
    win.setAlwaysOnTop(true, "floating");
    win.setVisibleOnAllWorkspaces(true);
    win.setFullScreenable(false);
    hide();

    win.on('blur', () => {
        console.log('hiding');
        hide();
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

    const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');
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

const identity = (x) => x;

// sample current app metadata
const activeWin = require('active-win');
let _currentApp = null;
const _checkCurrentApp = () => {
    activeWin()
        .then(
            (result) => _currentApp = result,
            identity
        )
};
setInterval(_checkCurrentApp, 200);
///////////////////////////////////////////////////

global.currentApp = () => {
    return _currentApp;
};

global.currentClipboard = () => {
    return clipboard.readText() || clipboard.readText('selection');
};

global.hide = () => {
    // https://github.com/electron/electron/issues/2640
    Menu.sendActionToFirstResponder('hide:');
    win.hide();
};

global.reloadApp = () => {
    win.reload();
};

global.writeToClipboard = (value) => {
    clipboard.writeText(value);
    console.log('copied', value);
};

// HACK!! https://github.com/octalmage/robotjs/issues/336
function waitUntilWindowIsHidden() {
    return new Promise((resolve, reject) => {
        let tries = 1;
        const maxTries = 10;
        const interval = setInterval(() => {
            if (!win.isVisible() || tries > maxTries) {
                tries++;
                clearInterval(interval);
                if (tries > maxTries) {
                    reject('main window is still open')
                } else {
                    resolve()
                }
            }
        }, 5)
    })
}

global.pasteClipboard = () => {
    waitUntilWindowIsHidden().then(() => {
        robot.keyTap('v', 'command')
    });
};

global.triggerTab = () => {
    robot.keyTap('tab');
};

global.triggerShiftTab = () => {
    robot.keyTap('tab', 'shift');
};

