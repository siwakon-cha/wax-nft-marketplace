import React from 'react';
import {useAsync} from "react-async";
import Link from "next/link";

import {get} from "../helpers/Api";
import {formatNumber} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

const loadTopSale = async () => {
    return await get(`load-top-sale`);
};

const TopSale = () => {
    const { data, error, isLoading }  = useAsync({ promiseFn: loadTopSale });

    const {t} = useTranslation('common');

    return (
        <div className="TopSale">
            <h1>{t('analytics.top_sale_24h')}</h1>
            {isLoading || !data ? ''
                :
                <div className="TopSaleItem">
                    <Link href={`/asset/${data['assetId']}`}><div className="TopSaleImage">
                        {data['image'].includes('video:') ?
                            <video
                                width="250"
                                height="250"
                                loop={true}
                                autoPlay={true}
                                muted={true}
                                playsInline={true}
                                poster={data['image'] && !data['image'].includes('video:') ? data['image'] : data['backimg']}
                            >
                                <source src={`https://ipfs.hivebp.io/ipfs/${data['image'].replace('video:', '')}`} />
                                Your browser does not support the video tag.
                            </video> : <img src={data['image']} />
                        }
                    </div></Link>
                    <div className={"TopSaleContent"}>
                        <Link href={`/asset/${data['assetId']}`}><div className={'TopSaleName NextLink'}>{data['name']}{data['mint']? ` #${data['mint']}` : ''}</div></Link>
                        <div className={'TopSalePrice'}>{formatNumber(data['price'])} WAX / ${formatNumber(data['usdPrice'])}</div>
                        <div className={'TopSaleTransfer'}><div>{t('search.seller')}:</div><Link href={`/user/${data['seller']}`}><div className={"NextLink"}>{data['seller']}</div></Link></div>
                        <div className={'TopSaleTransfer'}><div>{t('search.buyer')}:</div><Link href={`/user/${data['buyer']}`}><div className={"NextLink"}>{data['buyer']}</div></Link></div>
                    </div>
                </div>
            }
        </div>
    );
};

export default TopSale;
