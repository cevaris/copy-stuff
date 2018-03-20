const {app, clipboard, globalShortcut, BrowserWindow, ipcMain} = require('electron');
const {client} = require('electron-connect');
const path = require('path');
const url = require('url');
const moment = require('moment');

const Datastore = require('nedb');
let db = new Datastore({
    filename: './data.db',
    autoload: false
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

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });

    console.log('launching window');
    client.create(win);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
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
let last;
const check_clipboard_for_changes = () => {
    const current = clipboard.readText() || clipboard.readText('selection');

    if (!current) {
        clipboard.writeText('', 'selction');
        clipboard.writeText('');
    }

    if (!last) {
        last = '';
    }

    if (current !== last && current !== '') {
        last = current;
        console.log(current);
        // add to list

        const doc = mkClip(current);
        db.insert(doc, function (err, newDoc) {
            if (handleErr(err)) return;
            console.log(newDoc);

            getClips(function (err, docs) {
                if (handleErr(err)) return;
                renderClips(docs);
            });
        });
    }
};

const getClips = (func) => {
    db.find({})
        .sort({createdAt: -1})
        .limit(10)
        .exec(func);
};

const mkClip = (clip) => {
    const unixMs = moment.utc().valueOf();
    return {
        text: clip,
        createdAt: unixMs
    }
};

const renderClips = (clips) => {
    console.log(clips);
};

const handleErr = (err) => {
    if (err) {
        console.log(err);
    }
    return err;
};

// Subscribers
// Check for changes at an interval.
setInterval(check_clipboard_for_changes, 200);

db.loadDatabase(function (err) {
    getClips(function (err, docs) {
        if (handleErr(err)) return;
        renderClips(docs);
    });
});
