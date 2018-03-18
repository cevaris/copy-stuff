"use strict";
const {ipcRenderer} = require('electron');

let electron =				require('electron');

let last_value =			null;

/*================================================================================================*/

/*································································································*/
function post_ipc_message(message)
{
    ipcRenderer.send('clipboard_message', message);
}

/*································································································*/
/*
Normally the listener would take the form: function listener(event, message){}.
However, because our windows are sandboxed the event parameter is dropped and all we get
is the message parameter, so the listener needs to be: function listener(message){}.
*/
function add_ipc_message_listener(listener)
{
    ipcRenderer.on('ipc_message', listener);
}

/*································································································*/
function remove_ipc_message_listener(listener)
{
    ipcRenderer.removeListener('ipc_message', listener);
}

/*================================================================================================*/

function check_clipboard_for_changes()
{
    let value = electron.clipboard.readText();
    if(last_value !== value)clipboard_changed(value);
}

function clipboard_changed(value)
{
    last_value = value;
    post_ipc_message({action: 'clipboard_changed', value: value});
}

// Get the initial value of the clipboard.
clipboard_changed(electron.clipboard.readText());

// Check for changes at an interval.
setInterval(check_clipboard_for_changes, 250);
