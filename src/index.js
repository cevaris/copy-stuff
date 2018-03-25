import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';

const remote = window.require('electron').remote;
const clipboard = remote.getGlobal('currentClipboard');
const hideWindow = remote.getGlobal('hide');
let last = '';

const Datastore = require('nedb');
const db = new Datastore({
    filename: './data.db',
    autoload: false
});

const check_clipboard_for_changes = () => {
    const current = clipboard() || '';

    if (current !== last && current !== '') {
        last = current;

        const doc = mkClip(current);
        db.insert(doc, function (err, newDoc) {
            if (handleErr(err)) return;
        });
    }
};

export const getClips = (func) => {
    db.find({})
        .sort({createdAtMs: -1})
        .exec(func);
};

const mkClip = (clip) => {
    const unixMs = moment.utc().valueOf();
    return {
        text: clip,
        createdAtMs: unixMs
    }
};

export const handleErr = (err) => {
    if (err) {
        console.log(err);
    }
    return err;
};

db.loadDatabase(function (err) {
    if (handleErr(err)) return;
    console.log('loaded db');
});

// Subscribers
// Check for changes at an interval.
setInterval(check_clipboard_for_changes, 200);

document.onkeydown = function(evt) {
    evt = evt || window.event;
    let isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        hideWindow();
    }
};

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
