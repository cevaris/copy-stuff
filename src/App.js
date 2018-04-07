import React, {Component} from 'react';
import './App.css';
import {getClipsSlice, handleErr, clipsCount} from "./index";
import moment from 'moment';
import ListView from './components/ListView';
import {List} from "immutable";

const Mousetrap = require('mousetrap');


// TRY https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js
// https://github.com/rvboris/finalytics-react-old/blob/6077a4e2d37beea6ec1c7080b2067e758a5694d1/src/shared/components/OperationList/index.js
// https://github.com/LucasdeCastro/github-favourites/blob/fed2878ee8472ff79de7231d64a3f7f651392548/src/containers/Repo.js

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clips: List([]),
            height: 0,
            clipIndex: 0,
            loading: 0,
            highWaterMark: 0
        };

        this._loadMoreRows = this._loadMoreRows.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);

        Mousetrap.bind(['j', 'down'], () => {
            if (this.state.clipIndex < this.state.clips.size) {
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

    _rowRenderer({index, key, style}) {
        const {clips} = this.state;
        const row = clips.get(index);

        if (!row) return null;

        const text = row.text || '';
        const createdAt = moment.unix(row.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
        let className = '';
        const content = (
            <div className={className} style={{textAlign: 'left', wordWrap: 'break-word'}}>
                {createdAt}:
                <pre style={{wordWrap: 'break-word'}}>{text}</pre>
            </div>
        );


        return (
            <div key={key} style={style}>
                {content}
            </div>
        );
    }

    _loadMoreRows({startIndex, stopIndex}) {
        console.log('_loadMoreRows', startIndex, stopIndex);
        const ref = this;

        const increment = stopIndex - startIndex + 1;

        this.setState({loading: true});

        getClipsSlice(startIndex, increment, (err, docs) => {
            if (handleErr(err)) return;

            ref.setState({
                clips: List(docs),
                loading: false,
                highWaterMark: stopIndex
            });

            promiseResolver();
        });

        let promiseResolver;

        return new Promise(resolve => {
            promiseResolver = resolve;
        });
    }

    componentWillMount() {
        this._loadMoreRows({startIndex: 0, stopIndex: 10});
    }

    getRef = el => {
        if (el && el.clientHeight) {
            this.el = el;
            this.setState({height: el.clientHeight});
        }
    };

    render() {
        const {clips, height, loading, highWaterMark} = this.state;
        console.log(clips, loading, highWaterMark, clipsCount)
        return (
            <div className={'full-flex'} ref={this.getRef}>
                {height && (
                    <ListView
                        list={clips}
                        rowHeight={130}
                        height={height}
                        isNextPageLoading={loading}
                        loadNextPage={this._loadMoreRows}
                        renderItem={this._rowRenderer}
                        highWaterMark={highWaterMark}
                        total={clipsCount}
                    />
                )}
            </div>
        );
    }
}

export default App;
