import React, {useContext, useEffect, useState} from 'react';

import {get} from '../helpers/Api'

import {
    getOwnerLink,
    formatNumber,
    formatNumberS,
    getAttributeName,
    getColorName,
    getTypeName,
    getVariantName,
    getRarityName,
    openSearchPopup,
    getBorderName, getNumberName
} from "../helpers/FormatLinks";
import ReactTooltip from "react-tooltip";
import {Context} from "../waxplorer";
import cn from "classnames";
import {useTranslation} from "react-i18next";

function PreviewDetailsTable(props) {
    const asset = props['asset'];
    const priceInfo = props['priceInfo'];
    const newOwner = props['newOwner'];
    const [mintExistence, setMintExistence] = useState(null);
    const currentAsset = props['currentAsset'];
    const {t} = useTranslation('common');
    const calcMint = props['calcMint'];
    const bundleView = props['bundleView'];
    const visible = props['visible'];

    const {assets, bundle, offer} = asset;
    let {
        assetId, aAssetId, category, number, rarity, variant, author, name, mint,
        color, border, type, standard, total, burned, owner, sender, attr7, attr8, attr9, attr10, rarity_score,
        average, usd_average, last_sold, usd_last_sold, lowest, usd_lowest, num_sales, aether_value
    } = asset;

    const getMintInExistence = async() => {
        await get(`mint-in-existence/${assetId}`).then(res => setMintExistence(res['mint']));
    };

    useEffect(() => {
        if (burned && calcMint)
            getMintInExistence()
    }, [calcMint]);

    if (standard && standard === 'atomicassets')
        assetId = aAssetId;

    const assetIds = [];

    if (bundle && !bundleView) {
        const a = assets[currentAsset];
        assetId = a.assetId;
        category = a.category;
        variant = a.variant;
        rarity = a.rarity;
        author = a.author;
        color = a.color;
        border = a.border;
        type = a.type;
        attr7 = a.attr7;
        attr8 = a.attr8;
        attr9 = a.attr9;
        attr10 = a.attr10;
        rarity_score = a.rarity_score;
        assets.forEach(asset => assetIds.push(asset.assetId));
    } else {
        assetIds.push(assetId);
    }

    const numberTerm = getNumberName(t, author);

    const [ state, dispatch ] = useContext(Context);

    const avgWAX = priceInfo && priceInfo['average'] ? priceInfo['average'] : average;
    const avgUSD = priceInfo && priceInfo['average_usd'] ? priceInfo['average_usd'] : usd_average;
    const lastSold = priceInfo && priceInfo['last_sold'] ? priceInfo['last_sold'] : last_sold;
    const lastSoldUSD = priceInfo && priceInfo['last_sold_usd'] ? priceInfo['last_sold_usd'] : usd_last_sold;
    const lowestWAX = priceInfo ? priceInfo['lowest'] : lowest;
    const lowestUSD = priceInfo ? priceInfo['lowest_usd'] : usd_lowest;
    const numSales = priceInfo ? priceInfo['num_sales'] : num_sales;
    const aetherValue = priceInfo ? priceInfo['aether_value'] : aetherValue;

    return (
        <div className={visible ? "AssetPreviewInfo InsideScroll Show" : "AssetPreviewInfo Hidden"}>
            <h2>{t('asset.details')}</h2>
            <table>
              <tbody>
                { assetId && <tr>
                    <td><b>ID:</b></td>
                    <td>{assetId}</td>
                </tr> }
                {number && <tr>
                    <td><b>{numberTerm}:</b></td>
                    <td>{number}</td>
                </tr> }
                <tr>
                    <td><b>{t('asset.owner')}:</b></td>
                    <td>{getOwnerLink(newOwner ? newOwner : (offer ? sender : owner))}</td>
                </tr>
                <tr>
                    <td><b>{t('profile.total')}:</b></td>
                    <td>{total}</td>
                </tr>
                <tr>
                    <td><b>{t('asset.burned')}:</b></td>
                    <td>{burned}</td>
                </tr>
                {mintExistence ? <tr>
                    <td><b>{t('asset.mint_existence')}:</b></td>
                    <td>{mintExistence}</td>
                </tr> : ''}
                <tr>
                    <td><b>{t('asset.category')}:</b></td>
                    <td>{category}</td>
                </tr>
                {variant && <tr>
                    <td><b>{getVariantName(t, author, category)}:</b></td>
                    <td>{variant}</td>
                </tr> }
                {rarity && <tr>
                    <td><b>{getRarityName(t, author, category)}:</b></td>
                    <td>{rarity}</td>
                </tr> }
                {color && <tr>
                    <td><b>{getColorName(t, author, t('search.color'))}:</b></td>
                    <td>{color}</td>
                </tr> }
                {(border || border === 0) && <tr>
                    <td><b>{getBorderName(t, author, category)}:</b></td>
                    <td>{border}</td>
                </tr> }
                {type && <tr>
                    <td><b>{getTypeName(t, author, t('search.type'))}:</b></td>
                    <td>{type}</td>
                </tr> }
                {attr7 && <tr>
                    <td><b>{getAttributeName(t, author, category, 0)}:</b></td>
                    <td>{attr7}</td>
                </tr> }
                {attr8 && <tr>
                    <td><b>{getAttributeName(t, author, category,  1)}:</b></td>
                    <td>{attr8}</td>
                </tr> }
                {attr9 && <tr>
                    <td><b>{getAttributeName(t, author, category, 2)}:</b></td>
                    <td>{attr9}</td>
                </tr> }
                {attr10 && <tr>
                    <td><b>{getAttributeName(t, author, category, 3)}:</b></td>
                    <td>{attr10}</td>
                </tr> }
                { (rarity_score || rarity_score === 0) && <tr>
                    <td><b>{t('ranking.rarity_score')}:</b></td>
                    <td>{formatNumberS(rarity_score)}</td>
                </tr> }
              </tbody>
            </table>
            <h2>{t('search.market')}</h2>
            <table>
                {avgWAX ? (<tr>
                    <td><b>{t('asset.average_sold')}:</b></td>
                    <td>{`${formatNumber(avgWAX)} WAX / $${formatNumber(avgUSD)}`}</td>
                </tr>) : '' }
                {lastSold ? (
                    <tr>
                        <td><b>{t('asset.last_sold')}:</b></td>
                        <td>
                            <div
                                onClick={() => openSearchPopup('trades', bundle ? assets[currentAsset] : asset, dispatch)}
                                className={cn('cursor-pointer flex')}>
                                <div className={cn('m-auto')}>
                                    {formatNumber(lastSold)} WAX / ${formatNumber(lastSoldUSD)}
                                </div>
                                <img className={cn('m-auto w-4 h-4')} src="/search.svg"/>
                            </div>
                       </td>
                    </tr>
                ) : '' }
                {lowestWAX ? (
                    <tr>
                        <td><b>{t('asset.lowest_available_price')}:</b></td>
                        <td>
                            <div
                                onClick={() => openSearchPopup('sales', bundle ? assets[currentAsset] : asset, dispatch)}
                                className={cn('cursor-pointer flex')}>
                                <div className={cn('m-auto')}>
                                    {formatNumber(lowestWAX)} WAX / ${formatNumber(lowestUSD)}
                                </div>
                                <img className={cn('m-auto w-4 h-4')} src="/search.svg"/>
                            </div>
                        </td>
                    </tr>
                ) : '' }
                {numSales ? (
                    <tr>
                        <td><b>{t('asset.num_sales')}:</b></td>
                        <td>
                            {numSales}
                        </td>
                    </tr>
                ) : '' }
                {aetherValue ? (
                    <tr>
                        <td><b>Aether:</b></td>
                        <td>
                            <div>{formatNumberS(aetherValue / 10000.0)}  <img className="SearchIcon" src="/aether_icon.png"/></div>
                        </td>
                    </tr>
                ) : '' }
            </table>
            <ReactTooltip />
        </div>
    );
}

export default PreviewDetailsTable;
