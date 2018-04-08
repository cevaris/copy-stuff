import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import 'react-virtualized/styles.css';

const {List} = require('immutable');
const Mousetrap = require('mousetrap');

class App extends Component {
    constructor(props) {
        super(props);
        this.loadItems = this.loadItems.bind(this);

        this.state = {
            clips: [],
            clipIndex: 0,
            hasMoreItems: true,
            firstDiv: undefined
        };

        const ref = this;
        getClips(0, (err, docs) => {
            if (handleErr(err)) return;
            console.log('first page', docs);
            ref.setState({
                clips: List(docs),
            });
        });

        Mousetrap.bind(['j', 'down'], (e) => {
            console.log(e);
            if (this.textInput) this.textInput.focus();
            let next = e.target.nextSibling;
            if (next) {
                next.focus();
            }
            // Mousetrap.trigger('tab');
            // const form = event.target.form;
            // const index = Array.prototype.indexOf.call(form, event.target);
            // form.elements[index + 1].focus();
            // event.preventDefault();
            //
            // if (this.state.clipIndex < this.state.clips.size) {
            //     this.setState({
            //         clipIndex: this.state.clipIndex + 1
            //     });
            //     console.log(this.state.clipIndex);
            // }
        });
        Mousetrap.bind(['k', 'up'], (e) => {
            console.log(e);
            if (this.textInput) this.textInput.focus();
            let next = e.target.previousSibling;
            if (next) {
                next.focus();
            }
            // Mousetrap.trigger('shift+tab');
            // if (this.state.clipIndex > 0) {
            //     this.setState({
            //         clipIndex: this.state.clipIndex - 1
            //     });
            //     console.log(this.state.clipIndex);
            // }
        });

        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
    }

    loadItems(page) {
        const ref = this;
        getClips(page, (err, docs) => {
            console.log(page, this.state, ':', docs, ':');

            if (handleErr(err)) return;

            if (!docs || docs.length === 0) {
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

            const adiv = (
                <div className={className} style={{textAlign: 'left', wordWrap: 'break-word'}} tabIndex={i} ref={i === 0 && this.setTextInputRef}>
                    {createdAt}:
                    <pre style={{wordWrap: 'break-word'}}>{text}</pre>
                </div>
            );

            return (
                <LazyLoad height={20} key={`${clip.createdAtMs}-${i}`}>
                    {adiv}
                </LazyLoad>
            )
        });
    }

    render() {
        return (
            <div className="App">
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
