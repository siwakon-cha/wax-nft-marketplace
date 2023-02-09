import React  from 'react';
import CollectionItem from "./CollectionItem";
import cn from "classnames";

function CollectionList(props) {
    const assets = props['assets'];
    const name = props['name'];
    const zoom = props['zoom'];
    const asImage = props['asImage'];
    const showStats = props['showStats'];
    const refresh = props['refresh'];

    const sortFunc = (a, b) => {
        if (a.type && b.type && a.type !== b.type)
            return ('' + b.type.replace('Gold ', '')).localeCompare(a.type.replace('Gold ', ''));

        if (a.number && b.number && a.number - b.number !== 0)
            return a.number - b.number;

        if (a.author !== 'kogsofficial' || b.author !== 'kogsofficial')
            return 0;

        if (a.color && b.color && ('' + a.color).localeCompare(b.color) !== 0)
            return ('' + a.color).localeCompare(b.color);

        if (a.border && b.border) {
            return a.border - b.border;
        }

        return 0;
    };

    console.log(zoom);

    return (
        <div className={'flex justify-center'}>
            <div className= {cn(
                'grid',
                {'grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3': zoom > 5},
                {'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4': zoom === 5},
                {'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5': zoom === 4},
                {'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6': zoom === 3},
                {'grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7': zoom === 2}
            )} >
                {
                    assets.sort((a, b) => sortFunc(a, b)).map((asset, index) =>
                        <CollectionItem refresh={refresh} showStats={showStats} asImage={asImage} index={index} zoom={zoom} key={name+'_'+index} asset={asset} />)
                }
            </div>
        </div>
    );
}

export default CollectionList;
