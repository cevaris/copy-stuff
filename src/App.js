import React, {Component} from 'react';
import ClipList from "./components/ClipList";
import ClipSearch from "./components/ClipSearch";
import ClipBindings from "./components/ClipBindings";

class App extends Component {
    render() {
        return (
            <div className="App">
                <ClipBindings/>
                <ClipSearch/>
                <ClipList/>
            </div>
        );
    }
}

export default App;
