import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';

class App extends Component {
    constructor() {
        super();

        this.state = {
            clips: []
        };

        const ref = this;

        getClips((err, docs) => {
            if (handleErr(err)) return;
            ref.setState({
                clips: docs
            });
        });
    }

    _list() {
        return this.state.clips.map((clip, i) => {
            const text = clip.text || '';
            const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
            return (
                <LazyLoad height={20} key={i} offset={10} once={true}>
                    <div style={{'text-align': 'left', 'word-wrap': 'break-word'}}>
                        {createdAt}:
                        <pre>{text}</pre>
                    </div>
                </LazyLoad>
            )
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="list">
                    {this._list()}
                </div>
            </div>
        );
    }
}

export default App;
