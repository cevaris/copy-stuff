import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import {writeToClipboard} from "./index";

const {List} = require('immutable');
const Mousetrap = require('mousetrap');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clips: [],
            hasMoreItems: true
        };

        Mousetrap.bind(['j', 'down'], (e) => {
            if (this.textInput) this.textInput.focus();
            let next = e.target.nextSibling;
            if (next && e.target.className.includes('clip-item')) {
                next.focus();
            }
        });
        Mousetrap.bind(['k', 'up'], (e) => {
            if (this.textInput) this.textInput.focus();
            let next = e.target.previousSibling;
            if (next && e.target.className.includes('clip-item')) {
                next.focus();
            }
        });

        Mousetrap.bind(['pageup', 'pagedown'], (e) => {
            // disable buttons
            return false;
        });

        Mousetrap.bind(['enter'], (e) => {
            const data = e.target.getAttribute('data-text');
            if(data && data.trim()){
                writeToClipboard(data);
            }
        });

        this.loadItems = this.loadItems.bind(this);
        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
    }

    loadItems(page) {
        console.log(page);

        const ref = this;
        getClips(page, (err, docs) => {

            if (handleErr(err)) return;

            if (!docs || docs.length === 0) {
                ref.setState({
                    hasMoreItems: false
                });
                return;
            }

            ref.setState({
                clips: List(this.state.clips.concat(docs))
            });
        });
    }

    renderItems() {
        return this.state.clips.map((clip, i) => {
            const text = clip.text || '';
            const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');

            return (
                <LazyLoad height={20} key={`${clip.createdAtMs}-${i}`}>
                    <div
                        className={'clip-item'}
                        data-text={text}
                        style={{textAlign: 'left', wordWrap: 'break-word'}}
                        tabIndex={i}
                        ref={i === 0 && this.setTextInputRef}
                    >
                        <p>{createdAt}:</p>
                        <pre style={{wordWrap: 'break-word'}}>{text}</pre>
                    </div>
                </LazyLoad>
            )
        });
    }

    render() {
        return (
            <div className="App">
                <div className="list">
                    <InfiniteScroll
                        pageStart={-1} // actually load page 0
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
