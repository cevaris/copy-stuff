import {Component} from 'react';
import {hideWindow, pasteClipboard, triggerShiftTab, triggerTab, writeToClipboard} from "../../index";

const Mousetrap = require('mousetrap');

class ClipBindings extends Component {
    constructor(props) {
        super(props);

        Mousetrap.bind(['pageup', 'pagedown'], () => {
            //disable for now until we can move the tab/focus along with page up/down
            return false;
        });

        this.copyClip = this.copyClip.bind(this);

        Mousetrap.bind(['down'], () => {
            triggerTab();
        });
        Mousetrap.bind(['up'], () => {
            triggerShiftTab();
        });
        Mousetrap.bind(['enter'], this.copyClip);
    }

    copyClip = (e) => {
        let target = e.target;

        // onclick may have been child class, look at parent
        if (e.target.parentElement.className.includes('clip-item')) {
            target = e.target.parentElement;
        }

        const data = target.getAttribute('data-text');
        if (data && data.trim()) {
            writeToClipboard(data);
        }

        pasteClipboard();
        hideWindow();
    };

    render() {
        return (null);
    }
}

export default ClipBindings;
