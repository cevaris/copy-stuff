import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';

const Mousetrap = require('mousetrap');


class App extends Component {
    constructor() {
        super();

        this.state = {
            clips: [],
        };

        const ref = this;

        getClips((err, docs) => {
            if (handleErr(err)) return;
            ref.setState({
                clips: docs
            });
        });

        let _clipIndex = 0;
        Mousetrap.bind(['j', 'down'], () => {
            _clipIndex++;
            console.log('send down', _clipIndex);
        });
        Mousetrap.bind(['k', 'up'], () => {
            if (_clipIndex > 0) {
                _clipIndex--;
            }
            console.log('send up', _clipIndex);
        });
    }

    _list() {
        return this.state.clips.map((clip, i) => {
            const text = clip.text || '';
            const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
            return (
                <LazyLoad height={20} key={i}>
                    <div style={{textAlign: 'left', wordWrap: 'break-word'}}>
                        {createdAt}:
                        <pre style={{wordWrap: 'break-word'}}>{text}</pre>
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
