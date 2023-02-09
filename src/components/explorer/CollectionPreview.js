import React, {useEffect, useState} from 'react';

import Link from 'next/link';
import {formatPercentage} from "../helpers/FormatLinks";
import {formatNumber1K} from "../helpers/FormatLinks";
import cn from "classnames";
import {useTranslation} from "react-i18next";

function CollectionPreview(props) {
    const collectionItem = props['collection'];

    const {name, image, collection, thumbnail, verified, hasCollection, usdVolume, growth} = collectionItem;

    const {t} = useTranslation('common');

    useEffect(() => {

    }, []);

    let titleClass = "CollectionPreviewTitle NextLink";

    if (verified)
        titleClass += " verified";

    if (name && name.length > 25)
        titleClass += " Small";

    return (
            <div className={"CollectionPreview"}>
                <div className={"CollectionVolume"}>
                    <div className="Volume">${formatNumber1K(usdVolume)}</div>
                    <Link className='NextLink' href={`/stats?collection=${collection}`}>
                        <img className={cn(
                            'relative h-6 w-6 m-2.5 cursor-pointer'
                        )} src={'/collection_card/Vol_Chart_Icon.svg'}/>
                    </Link>
                    <div className={growth > 0 ? "Change Positive" : growth < 0 ? "Change Negative" : "Change Neutral"}>
                        {growth > 0 ? '+' : ''}{formatPercentage(growth)}
                    </div>
                </div>
                <Link className='NextLink' href={'/collection/' + collection}>
                    <div className={"CollectionPreviewImage NextLink"}>
                        <span className="Center" />
                        <img className={cn('inline')} src={thumbnail ? thumbnail : image} />
                    </div>
                </Link>
                <Link className='NextLink' href={'/collection/' + collection}>
                    <div className={titleClass}>
                        <div>
                            {verified &&
                                <div className={cn(
                                    'absolute w-full h-10 bottom-9'
                                )}>
                                    <img className={cn(
                                        'm-auto'
                                    )} src={"/asset_card/Wabe_winzig.svg"} />
                                </div>
                            }
                            {verified &&
                                <div className={cn(
                                    'absolute w-full h-10 bottom-7'
                                )}>
                                    <img className={cn(
                                        'm-auto'
                                    )} src={"/verified.svg"} />
                                </div>
                            }
                        </div>
                        <div>{name}</div>
                    </div>
                </Link>
                <div className={"CollectionBar"}>
                    { hasCollection ?
                    <Link className='NextLink' href={'/ranking/' + collection}>
                        <div className={"Icon"} >
                                <div className="RankingButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/ranking.svg" alt="Ranking" title={t('navigation.ranking')} />
                            </div>
                        </div>
                    </Link> : '' }
                    <Link className='NextLink' href={'/market?collection=' + collection}>
                        <div className={"Icon"} >
                            <div className="CollectionDetailsButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/shopping-cart-outline.svg" alt="Details" title={t('search.market')} />
                            </div>
                        </div>
                    </Link>
                    { hasCollection ?
                    <Link className='NextLink' href={'/sets/' + collection}>
                        <div className={"Icon"} >
                            <div className="SetsButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/grid-outline.svg" alt="Ranking" title={'Sets'} />
                            </div>
                        </div>
                    </Link> : '' }
                </div>
            </div>
    );
}

export default CollectionPreview;
