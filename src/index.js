import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';

const Mousetrap = require('mousetrap');

const remote = window.require('electron').remote;
const clipboard = remote.getGlobal('currentClipboard');
const hideWindow = remote.getGlobal('hide');
const db = remote.getGlobal('db');

export let clipsCount = 0;
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

        updateClipCount();
    }
};

export const getClips = (page, func) => {
    const pageSize = 10;

    db.find({})
        .sort({createdAtMs: -1})
        .skip(page * pageSize)
        .limit(pageSize)
        .exec(func);
};

export const getClipsSlice = (start, offset, func) => {
    db.find({})
        .sort({createdAtMs: -1})
        .skip(start)
        .limit(offset)
        .exec(func);
};


// const getAllClips = (func) => {
//     db.find({})
//         .sort({createdAtMs: -1})
//         .exec(func);
// };

const updateClipCount = () => {
    getClipCount((err, count) => {
        if (handleErr(err)) return;
        clipsCount = count;
    });
};


export const getClipCount = (func) => {
    db.count({}).exec(func);
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

updateClipCount();

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
