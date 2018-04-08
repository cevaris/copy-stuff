import React, {Component} from 'react';
import ClipList from "./components/ClipList";

const Mousetrap = require('mousetrap');

class App extends Component {
    constructor(props) {
        super(props);

        Mousetrap.bind(['pageup', 'pagedown'], (e) => {
            // disable buttons
            return false;
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
