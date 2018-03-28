import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import logo from './logo.svg';
import './App.css';
import {getClips, handleErr} from "./index";
import moment from 'moment';
import DynamicSizeDataGrid from './DynamicSizeDataGrid';
import PropTypes from 'prop-types';

// Custom Formatter component
class ClipFormatter extends React.Component {
    static propTypes = {
        value: PropTypes.string
    };

    shouldComponentUpdate(nextProps: any): boolean {
        return nextProps.value !== this.props.value;
    }

    render() {
        console.log(this.props);
        const clip = JSON.parse(this.props.value || '{}');
        const text = clip.text || '';
        const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
        return (
            <div style={{textAlign: 'left', wordWrap: 'break-word'}}>
                {createdAt}:
                <pre style={{wordWrap: 'break-word'}}>{text}</pre>
            </div>
        );
    }
}

class App extends Component {
    constructor() {
        super();

        this._columns = [
            {
                key: 'clip',
                name: 'Clip',
                formatter: ClipFormatter,
                resizable: true
            }
        ];
        this._rows = [];

        const ref = this;
        getClips((err, docs) => {
            if (handleErr(err)) return;
            ref._rows = docs;
            ref.setState({
                loaded: true
            });
        });

        this.state = {
            loaded: false
        };
    }

    _rowGetter = (i) => {
        //const createdAt = moment.unix(clip.createdAtMs / 1000).format('dddd, MMMM Do, YYYY h:mm:ss A');
        return {clip: JSON.stringify(this._rows[i])};
    };

    _clipLength = () => {
        return this._rows.length || 0;
    };

    _list() {
        return this._rows.map((clip, i) => {
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
        if (this.state.loaded) {
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
                        <DynamicSizeDataGrid
                            enableCellSelect={true}
                            columns={this._columns}
                            rowGetter={this._rowGetter}
                            rowsCount={this._clipLength()}
                            />);
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }


    }
}

export default App;
