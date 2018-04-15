import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import {getClips, handleErr} from "../../index";
import moment from 'moment';

const {List} = require('immutable');

class ClipList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clips: List(),
        };
    }

    componentWillMount() {
        const ref = this;
        getClips(0, {}, (err, docs) => {
            if (handleErr(err)) return;
            ref.setState({
                clips: this.state.clips.concat(docs)
            });
        });
    }

    renderItems() {
        return this.state.clips.map((clip, i) => {
            const text = clip.text || '';
            const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');

            return (
                <LazyLoad
                    height={0} // has to be 0 for InfiniteScroll.loadMore to fire
                    key={`${clip.createdAtMs}-${i}`}
                    resize={true}
                    overflow={true}
                >
                    <div
                        className={'clip-item'}
                        data-text={text}
                        onClick={this.copyClip}
                        tabIndex={i + 1}
                    >
                        <p>{createdAt}:</p>
                        <pre className={'clip-text'}>{text}</pre>
                    </div>
                </LazyLoad>
            )
        });
    }

    render() {
        return (
            <div className="list">
                {this.renderItems()}
            </div>
        );
    }
}

export default ClipList;
