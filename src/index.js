import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';

const remote = window.require('electron').remote;
const clipboard = remote.getGlobal('currentClipboard');
let last = '';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

const Datastore = require('nedb');
export const db = new Datastore({
    filename: './data.db',
    autoload: false
});

const check_clipboard_for_changes = () => {
    const current = clipboard() || '';

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
