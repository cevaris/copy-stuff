import React, {Component} from 'react';

class ClipSearch extends Component {
    render() {
        return (
            <div className="search">
                <input
                    className={'search-field'}
                    type={'text'}
                    tabIndex={0}
                    placeholder={'search for clip text'}
                    style={{width: '100%', height: '20px'}}
                />
            </div>
        );
    }
}

export default ClipSearch;
