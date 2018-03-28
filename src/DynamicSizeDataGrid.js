// extend third party lib react-data-grid ReactDataGrid
import ReactDataGrid from 'react-data-grid';


class DynamicSizeDataGrid extends ReactDataGrid {
    render() {
        // force viewport columns to always start from zero
        // to prevent row re-rendering when scrolling horizontally
        if (this.base && this.base.viewport) {
            this.base.viewport.getVisibleColStart = () => 0;
        }
        return super.render();
    }
}

export default DynamicSizeDataGrid;
