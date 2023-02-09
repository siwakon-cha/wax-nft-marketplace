import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import MarketContent from "../common/layout/Content";
import Pagination from "../pagination/Pagination";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import AssetPreview from "../assetpreview/AssetPreview";
import {post} from "superagent/lib/client";
import {Context} from "../waxplorer";
import qs from "qs";
import {get} from "../helpers/Api";

export default function UnclaimedPacksList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 40;
    const [isLoading, setIsLoading] = useState(false);

    const user = props['user'];

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const unpacked = state.unpacked;

    const getAssetsResult = (result, unboxer) => {
        const assets = [];
        if (result && result.success) {
            result.data.map(asset => {
                asset['unboxer'] = unboxer;
                assets.push(asset);
            })
        }

        setAssets(assets);
        setIsLoading(false);
    }

    const getAssets = async (asset_ids) => {
        return await get(
            `assets?ids=${asset_ids}`
        );
    };

    const getUnclaimedPacksResult = (results) => {
        const asset_ids = [];

        let unboxer = null;

        results.map(res => {
            if (res && res.status === 200 && res.body && res.body.rows) {
                res.body.rows.map(row => {
                    if (!unboxer) {
                        unboxer = row.unboxer;
                    }
                    asset_ids.push(row.pack_asset_id)
                });
            }
        });

        if (asset_ids.length > 0)
            getAssets(asset_ids).then(res => getAssetsResult(res, unboxer));
        else {
            setAssets([]);
            setIsLoading(false);
        }
    }

    const getUnclaimedPacks = async () => {
        const promises = [];
        ['atomicpacksx', 'neftyblocksp'].map((contract) => {
            const body = {
                "json": true,
                "code": contract,
                "scope": contract,
                "table": "unboxpacks",
                "table_key": "unboxer",
                "lower_bound": user,
                "upper_bound": user,
                "index_position": 2,
                "key_type": "name",
                "limit": 200,
                "reverse": false,
                "show_payer": false
            }

            const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
            promises.push(post(url, body));
        })

        if (promises.length > 0) {
            Promise.all(promises).then(res => getUnclaimedPacksResult(res));
        }
    }

    const initPacks = (offset) => {
        setIsLoading(true);
        getUnclaimedPacks();
    };

    useEffect(() => {
        initPacks(offset)
        if (unpacked)
            dispatch({ type: 'SET_UNPACKED', payload: false });
    }, [offset, unpacked]);

    return (
        <MarketContent>
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
                                        assets={[asset]}
                                        page={'unclaimed_packs'}
                                    />
                                )
                            }
                        </div>
                    }
                    {isLoading ? '' :
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
        </MarketContent>
    );
}