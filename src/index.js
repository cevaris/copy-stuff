import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';

const remote = window.require('electron').remote;
const clipboard = remote.getGlobal('currentClipboard');
const hideWindow = remote.getGlobal('hide');
const db = remote.getGlobal('db');
let last = '';

const checkClipboardForChanges = () => {
    const current = clipboard();

    // if clipboard sent junk
    if (!current) return;

    //handle init when last = ''
    if(!last){
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

// Subscribers
// Check for changes at an interval.
setInterval(checkClipboardForChanges, 200);

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
