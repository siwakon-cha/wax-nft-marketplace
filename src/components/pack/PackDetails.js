import {formatNumber, getNumberName, getAuthorLink, getOwnerLink} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import React, {useEffect, useState} from "react";
import moment from 'moment';
import Link from 'next/link';
import ReactTooltip from "react-tooltip";
import {useTranslation} from "react-i18next";

const PackDetails = (props) => {
    const asset = props.asset;
    const assetId = props.assetId;

    const newOwner = props.newOwner;
    const assetCount = props.assetCount;
    const burnedCount = props.burnedCount;
    const fullPriceInfo = props.fullPriceInfo;
    const [mintExistence, setMintExistence] = useState(null);
    const [priceInfo, setPriceInfo] = useState('Loading...');

    const {name, owner, author, number, category, variant, rarity, color, border, type,
        timestamp, mint, offer, sender, mdata, attr7, attr8, attr9, attr10, verified, burned} = asset;

    const {t} = useTranslation('common');

    const assetData = mdata ? JSON.parse(mdata) : null;

    const utc = moment.utc(timestamp).toDate();
    const date = moment(utc).local().format('YYYY-MM-DD HH:mm:ss');

    const numberTerm = getNumberName(t, author);

    const getMintInExistence = async () => {
        if (burned)
            get(`mint-in-existence/${assetId}`).then(res => setMintExistence(res['mint']));
    };

    useEffect(() => {
        Promise.all([
            get('price-info/' + assetId).then((result) => {setPriceInfo(result)}),
            getMintInExistence()
        ])
    }, [assetId]);

    let full_lowest = 0;
    let full_lowest_usd = 0;
    let full_average = 0;
    let full_average_usd = 0;
    if (fullPriceInfo && Object.keys(fullPriceInfo).length > 1) {
        Object.keys(fullPriceInfo).map(assetId => {
            const average = fullPriceInfo[assetId]['average'];
            const average_usd = fullPriceInfo[assetId]['average_usd'];
            const lowest = fullPriceInfo[assetId]['lowest'];
            const lowest_usd = fullPriceInfo[assetId]['lowest_usd'];

            if (!average)
                full_average = null;
            if (full_average !== null)
                full_average += average;

            if (!average_usd)
                full_average_usd = null;
            if (full_average_usd !== null)
                full_average_usd += average_usd;

            if (!lowest)
                full_lowest = null;
            if (full_lowest !== null)
                full_lowest += lowest;

            if (!lowest_usd)
                full_lowest_usd = null;
            if (full_lowest_usd !== null)
                full_lowest_usd += lowest_usd;
        })
    }

    return (
        <div className="AssetDetails">
            <div className={"AssetName"}>{name}</div>
            <table>
                <tr>
                    <td>ID:</td>
                    <td>{assetId}</td>
                </tr>
                <tr>
                    <td>{t('asset.name')}:</td>
                    <td>{name}</td>
                </tr>
                {(number || number === 0) && <tr>
                    <td>{numberTerm}:</td>
                    <td>{number}</td>
                </tr> }
                <tr>
                    <td>{t('asset.mint')}:</td>
                    <td>#{mint}</td>
                </tr>
                {mintExistence ? <tr>
                    <td>{t('asset.mint_existence')}:</td>
                    <td>#{mintExistence}</td>
                </tr> : ''}
                <tr>
                    <td>{t('asset.number_of_assets')}:</td>
                    <td>
                        <div className="NumberOfAssets"><a data-tip={t('asset.available')} target="_blank" href={
                            `/explorer?tab=assets&term=${escape(name)}&collection=${author}&category=${category}${
                                variant ? `&variant=${variant}` : ''}${rarity ? `&rarity=${rarity}` : ''}${
                                color ? `&color=${color}` : ''}${border ? `&border=${border}` : ''}${type ? `&type=${
                                    type}` : ''}&attr7=${attr7 ? attr7 : ''}&attr8=${attr8 ? attr8 : ''}&attr9=${
                                attr9 ? attr9 : ''}&attr10=${
                                attr10 ? attr10 : ''}&exact_search=true&on_sale=false&search_type=assets&tab=assets`}>
                            {assetCount}
                        </a>
                            {burnedCount || burned ? ' / ' : ''}
                            {burnedCount || burned ? <div data-tip={t('asset.burned')}>{burnedCount || burned}🔥</div> : ''}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>{t('asset.owner')}:</td>
                    <td>{getOwnerLink(newOwner ? newOwner : (offer ? sender : owner))}</td>
                </tr>
                <tr>
                    <td>{t('profile.collection')}:</td>
                    <td><div className="AuthorTd">{verified ? <div className={'VerifiedIcon'}><img src="/verified.svg" /></div> : ''}<div>{getAuthorLink(author)}</div></div></td>
                </tr>
                <tr>
                    <td>{t('asset.category')}:</td>
                    <td>{category}</td>
                </tr>
                <tr>
                    <td>{t('asset.created')}:</td>
                    <td>{date}</td>
                </tr>
            </table>
            <h2>{t('general.data')}</h2>
            <table>
                {assetData && Object.keys(assetData).map(key => (
                    <tr>
                        <td>{key}:</td>
                        <td>{(''+assetData[key])}</td>
                    </tr>))}
            </table>
            <h2>{t('search.market')}</h2>
            <table>
                <tr>
                    <td>{t('asset.average_bought')}:</td>
                    <td>
                        {priceInfo && priceInfo['isLoading'] ? 'Loading...' : priceInfo['average'] ? `${Math.round(priceInfo['average'] * 100)/100} WAX` : ''}
                        {priceInfo && priceInfo['isLoading'] ? '' : priceInfo['average_usd'] ? <span className='usd' >/${formatNumber(priceInfo['average_usd'])}</span> : '-'}
                    </td>
                </tr>
                <tr>
                    <td>{t('asset.lowest_available_price')}:</td>
                    <td>
                        <Link
                              href={`/market/?term=${escape(name)}&collection=${author}&category=${category}&order_by=offer_asc&limit=100${
                                  rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${variant}` : ''}${border ? `&border=${
                                      border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true`}
                        >
                            <div className="NextLink">
                                {priceInfo['isLoading'] ? 'Loading...' : priceInfo['lowest'] ? `${priceInfo['lowest']} WAX` : ''}
                                {priceInfo['isLoading'] ? '' : priceInfo['lowest'] ? `/ $${formatNumber(priceInfo['lowest_usd'])}` : '-'}
                                <img className="SearchIcon" src="/search.svg"/>
                            </div>
                        </Link>
                    </td>
                </tr>
                {priceInfo && priceInfo['last_sold'] ? (
                    <tr>
                        <td>{t('asset.last_sold')}:</td>
                        <td><Link
                               href={`/market/?term=${escape(name)}&collection=${author}&category=${category}&order_by=date_desc&limit=100${
                                  rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${variant}` : ''}${border ? `&border=${
                                      border}` : ''}${color ? `&color=${color}` : ''}${
                                  type ? `&type=${type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=trades`}>
                            <div className={"NextLink"}>{formatNumber(priceInfo['last_sold'])} WAX / ${formatNumber(priceInfo['last_sold_usd'])}  <img className="SearchIcon" src="/search.svg"/></div>
                        </Link>
                       </td>
                    </tr>
                ) : '' }
                { fullPriceInfo && Object.keys(fullPriceInfo).length > 1 ? <tr><td colSpan={2}><span>-</span></td></tr> : '' }
                { fullPriceInfo && Object.keys(fullPriceInfo).length > 1 ? <tr>
                    <td>{t('asset.lowest_available_price') + ` (${t('search.bundle')})`}:</td>
                    <td>
                        {full_lowest ? `${formatNumber(full_lowest)} WAX` : '-'}
                        {full_lowest && full_lowest_usd ? ` / ${formatNumber(full_lowest_usd)}` : ''}
                    </td>
                </tr> : '' }
                { fullPriceInfo && Object.keys(fullPriceInfo).length > 1 ? <tr>
                    <td>{t('asset.average_bought') + ` (${t('search.bundle')})`}:</td>
                    <td>
                        {full_average ? `${Math.round(full_average * 100)/100} WAX` : ''}
                        {full_average && full_lowest_usd ? ` / $${formatNumber(full_lowest_usd)}` : ''}
                    </td>
                </tr> : '' }
            </table>
            <ReactTooltip />
        </div>
    );
};

export default PackDetails;
