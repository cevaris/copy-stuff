import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import {debounce} from "./utils";
import moment from 'moment';

const Mousetrap = require('mousetrap');


class App extends Component {
    constructor() {
        super();

        this.state = {
            clips: [],
            clipIndex: 0
        };

        const ref = this;

        getClips((err, docs) => {
            if (handleErr(err)) return;
            ref.setState({
                clips: docs
            });
        });

        Mousetrap.bind(['j', 'down'], debounce(() => {
            ref.setState({
                clipIndex: ref.state.clipIndex + 1
            });
            console.log('send down', ref.state.clipIndex);
        }, 10));
        Mousetrap.bind(['k', 'up'], debounce(() => {
            let clipIndex = ref.state.clipIndex;
            if(clipIndex > 0) {
                clipIndex--;
            }

            ref.setState({
                clipIndex: clipIndex
            })
            console.log('send up', ref.state.clipIndex);
        }, 10));
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
