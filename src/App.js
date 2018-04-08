import React, {Component} from 'react';
import ClipList from "./components/ClipList";
import ClipSearch from "./components/ClipSearch";

const Mousetrap = require('mousetrap');

class App extends Component {
    constructor(props) {
        super(props);

        Mousetrap.bind(['pageup', 'pagedown'], () => {
            return false; //disable
        });
    }

    render() {
        return (
            <div className="App">
                <ClipSearch/>
                <ClipList/>
            </div>
        );
    }
}

export default App;
