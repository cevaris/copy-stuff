import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import 'react-virtualized/styles.css'


const Mousetrap = require('mousetrap');


class App extends Component {
    constructor(props) {
        super(props);
        this.loadItems = this.loadItems.bind(this);

        this.state = {
            clips: [],
            clipIndex: 0,
            hasMoreItems: true
        };


        const ref = this;
        getClips(0, (err, docs) => {
            if (handleErr(err)) return;
            console.log('first page', docs);
            ref.setState({
                clips: docs
            });
        });

        Mousetrap.bind(['j', 'down'], () => {
            if (this.state.clipIndex < this.state.clips.length) {
                this.setState({
                    clipIndex: this.state.clipIndex + 1
                });
                console.log(this.state.clipIndex);
            }
        });
        Mousetrap.bind(['k', 'up'], () => {
            if (this.state.clipIndex > 0) {
                this.setState({
                    clipIndex: this.state.clipIndex - 1
                });
                console.log(this.state.clipIndex);
            }
        });
    }

    loadItems(page) {
        const ref = this;
        getClips(page, (err, docs) => {
            console.log(page, this.state, ':', docs, ':');

            if (handleErr(err)) return;

            if (docs.length === 0) {
                ref.setState({
                    hasMoreItems: false
                });
                return;
            }

            ref.setState({
                clips: this.state.clips.concat(docs)
            });
        });
    }

    renderItems() {
        const clipIndex = this.state.clipIndex;
        return this.state.clips.map((clip, i) => {
            const text = clip.text || '';
            const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
            let className = '';

            if (i === clipIndex) {
                className = 'selected-clip';
            }
            return (
                <LazyLoad height={20} key={`${clip.createdAtMs}-${i}`}>
                    <div className={className} style={{textAlign: 'left', wordWrap: 'break-word'}}>
                        {createdAt}:
                        <pre style={{wordWrap: 'break-word'}}>{text}</pre>
                    </div>
                </LazyLoad>
            )
        });
    }

    render() {
        return (
            <div className="App" onKeyPressCapture={this.inputListener}>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="list">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadItems}
                        hasMore={this.state.hasMoreItems}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                    >
                        {this.renderItems()}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

export default App;
