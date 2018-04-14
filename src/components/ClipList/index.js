import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import {getClips, handleErr, hideWindow, writeToClipboard, reloadApp, pasteClipboard, triggerShiftTab, triggerTab} from "../../index";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

const Mousetrap = require('mousetrap');
const {List} = require('immutable');

class ClipList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clips: [],
            hasMoreItems: true
        };

        this.loadItems = this.loadItems.bind(this);
        this.copyClip = this.copyClip.bind(this);
        // this.textInput = null;
        // this.setTextInputRef = element => {
        //     this.textInput = element;
        // };

        Mousetrap.bind(['down'], (e) => {
            //if (this.textInput) this.textInput.focus();
            triggerTab();
            // let next = e.target.nextSibling;
            // if (next && (next.className.includes('clip-item'))) {
            //     next.focus();
            // }
        });
        Mousetrap.bind(['up'], (e) => {
            //if (this.textInput) this.textInput.focus();
            triggerShiftTab();
            //robot.keyTap('shift','tab');
            // let next = e.target.previousSibling;
            // if (next && (next.className.includes('clip-item'))) {
            //     next.focus();
            // }
        });
        Mousetrap.bind(['enter'], this.copyClip);
    }

    copyClip = (e) => {
        let target = e.target;

        // onclick may have been child class, look at parent
        if (e.target.parentElement.className.includes('clip-item')) {
            target = e.target.parentElement;
        }

        const data = target.getAttribute('data-text');
        if (data && data.trim()) {
            writeToClipboard(data);
        }

        pasteClipboard();
        hideWindow();
    };

    loadItems(page) {
        console.log(page);

        const ref = this;

        const query = {};

        getClips(page, query, (err, docs) => {

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
                        onClick={this.copyClip}
                        style={{textAlign: 'left', wordWrap: 'break-word'}}
                        tabIndex={i + 1}
                        //ref={i === 0 && this.setTextInputRef}
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
            <div>
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

export default ClipList;
