import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import AssetPreview from "../assetpreview/AssetPreview";
import {Context} from "../waxplorer";
import qs from "qs";
import {get} from "../helpers/Api";
import Pagination from "../pagination/Pagination";

function MyPacksList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 40;
    const [isLoading, setIsLoading] = useState(false);

    const user = props['user'];
    const author = props['author'];
    const unpacked = state.unpacked;

    const getPacksResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initPacks = async (page) => {
        setIsLoading(true);
        await get(
            `unpackable-packs/${user}?author=${author ? author : ''}`
        ).then((result) => getPacksResult(result));
    };

    useEffect(() => {
        initPacks(offset)
        if (unpacked)
            dispatch({ type: 'SET_PACKED', payload: false });
    }, [offset, unpacked]);

    console.log();

    return (
        <div className={cn('w-full grid grid-cols-8 gap-10')}>
            <div
                className={cn(
                    'col-span-8 sm:col-span-8',
                )}
            >

                { !isLoading && assets &&
                    <Pagination
                        result={assets.data}
                        offset={offset}
                        setOffset={setOffset}
                        limit={limit}
                        location={"Top"}
                    />
                 }
                { isLoading ? <LoadingIndicator /> :
                    <div className={cn(
                        "relative w-full mb-24",
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    )}>
                        {
                            assets && assets.map((asset, index) =>
                                <AssetPreview
                                    {...props}
                                    key={index}
                                    index={index}
                                    asset={asset}
                                    page={'packs'}
                                    {...props}
                                />
                            )
                        }
                    </div>
                }
                { !isLoading && assets &&
                    <Pagination
                        result={assets.data}
                        offset={offset}
                        setOffset={setOffset}
                        limit={limit}
                        location={"Bottom"}
                    />
                }
            </div>
        </div>
    );
}

export default MyPacksList;