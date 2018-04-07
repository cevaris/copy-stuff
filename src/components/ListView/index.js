import React from "react";
import {InfiniteLoader, List, AutoSizer} from "react-virtualized";
import "react-virtualized/styles.css";

export default ({
                    list,
                    renderItem,
                    loadNextPage,
                    isNextPageLoading,
                    highWaterMark,
                    total,
                    ...otherProps
                }) => {

    const hasNextPage = highWaterMark < total;

    const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

    const isRowLoaded = ({index}) => !hasNextPage || index < list.size;

    const rowRenderer = ({index, key, style}) => {
        if (!isRowLoaded({index}))
            return (
                <div key={key} style={style}>
                    Loading...
                </div>
            );

        const item = list.get(index);
        return renderItem({item, index, key, style});
    };

    return (
        <InfiniteLoader
            rowCount={total}
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
        >
            {({onRowsRendered, registerChild}) => (
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            {...otherProps}
                            height={height}
                            width={width}
                            rowCount={list.size}
                            ref={registerChild}
                            rowRenderer={rowRenderer}
                            onRowsRendered={onRowsRendered}
                        />
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader>
    );
};