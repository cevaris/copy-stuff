import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';

const Mousetrap = require('mousetrap');

const remote = window.require('electron').remote;
export const writeToClipboard = remote.getGlobal('writeToClipboard');
const clipboard = remote.getGlobal('currentClipboard');
const hideWindow = remote.getGlobal('hide');
const db = remote.getGlobal('db');
let last = '';

const checkClipboardForChanges = () => {
    const current = clipboard();

    // if clipboard sent junk
    if (!current) return;

    //handle init when last = ''
    if (!last) {
        last = current;
    }

    if (current !== last) {
        last = current;

        const doc = mkClip(current);
        db.insert(doc, function (err, newDoc) {
            if (handleErr(err)) return;
        });
    }
};

export const getClips = (page, func) => {
    const pageSize = 50;

    db.find({})
        .sort({createdAtMs: -1})
        .skip(page * pageSize)
        .limit(pageSize)
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

// Subscribers
// Check for changes at an interval.
setInterval(checkClipboardForChanges, 200);

Mousetrap.bind(['escape'], () => {
    hideWindow();
});

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
