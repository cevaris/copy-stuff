import React, {Component} from 'react';

class ClipSearch extends Component {

    constructor(props) {
        super(props);

        const Mousetrap = require('mousetrap');
        Mousetrap.bind(['command+f'], () => {
            if (this.searchTextInput) this.searchTextInput.focus();
        });
    }

    render() {
        return (
            <div className="search">
                <input
                    className={'search-field'}
                    type={'text'}
                    tabIndex={0}
                    placeholder={'search for clip text'}
                    style={{width: '100%', height: '20px'}}
                    ref={(input) => {
                        this.searchTextInput = input;
                    }}
                />
            </div>
        );
    }
}

export default ClipSearch;
