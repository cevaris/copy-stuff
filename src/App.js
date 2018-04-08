import React, {Component} from 'react';
import {writeToClipboard} from "./index";
import ClipList from "./components/ClipList";

const Mousetrap = require('mousetrap');

class App extends Component {
    constructor(props) {
        super(props);

        Mousetrap.bind(['pageup', 'pagedown'], (e) => {
            // disable buttons
            return false;
        });

        Mousetrap.bind(['enter'], (e) => {
            const data = e.target.getAttribute('data-text');
            if (data && data.trim()) {
                writeToClipboard(data);
            }
        });
    }

    render() {
        return (
            <div className="App">
                <ClipList/>
            </div>
        );
    }
}

export default App;
