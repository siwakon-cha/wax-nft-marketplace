import {formatNumber, formatWAX, getAuthorLink, getOwnerLink} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import React, {useEffect, useState} from "react";
import moment from 'moment';
import Link from '../common/util/input/Link'
import ReactTooltip from "react-tooltip";
import {getNumberName} from "../helpers/FormatLinks";
import cn from "classnames";
import {useTranslation} from "react-i18next";

const AssetDetails = (props) => {
    const asset = props.asset;
    const assetId = props.assetId;
    const newOwner = props.newOwner;
    const [mintExistence, setMintExistence] = useState(null);
    const [priceInfo, setPriceInfo] = useState('Loading...');
    const [assetCount, setAssetCount] = useState('Loading...');
    const [burnedCount, setBurnedCount] = useState(null);

    const {name, owner, author, number, category, variant, rarity, color, border, type, templateId,
        timestamp, mint, offer, sender, mdata, attr7, attr8, attr9, attr10, verified, burned} = asset;

    const assetData = mdata ? JSON.parse(mdata) : null;

    const {t} = useTranslation('common');

    const utc = moment.utc(timestamp).toDate();
    const date = timestamp ? moment(utc).local().format('YYYY-MM-DD HH:mm:ss') : '';

    const numberTerm = getNumberName(t, author);

    const getMintInExistence = async () => {
        if (burned)
            get(`mint-in-existence/${assetId}`).then(res => setMintExistence(res['mint']));
    };

    useEffect(() => {
        if (process.browser)
            Promise.all([
                get('price-info/' + assetId).then((result) => {setPriceInfo(result)}),
                getMintInExistence(),
                get('asset-count/' + assetId).then(
                    (result) => {setAssetCount(result['cnt']); setBurnedCount(result['burned'])})
            ]);
    }, [assetId]);

    const searchIcon = <img className={cn('w-5 h-5 flex ml-1 my-0')} src="/search.svg"/>;
    const searchItemClassName = cn('flex cursor-pointer justify-end');

    const tdClassFirst = cn('text-left w-1/3');
    const tdClassLast = cn('text-right w-2/3 overflow-x-auto');
    const tableClass = cn('w-full my-auto');

    return (
        <div className={cn(
            'relative w-full p-8 text-sm text-neutral'
        )}>
            <div className={"text-left text-white mb-8 font-light text-4xl"}>{name}</div>
            <table className={tableClass}>
                <tr>
                    <td className={tdClassFirst}>Asset ID:</td>
                    <td className={tdClassLast}><Link href={`/asset/${assetId}`}>{assetId}</Link></td>
                </tr>
                {templateId ? <tr>
                    <td className={tdClassFirst}>Template ID:</td>
                    <td className={tdClassLast}><Link href={`/template/${templateId}`}>{templateId}</Link></td>
                </tr> : '' }
                <tr>
                    <td className={tdClassFirst}>{t('asset.name')}:</td>
                    <td className={tdClassLast}>{name}</td>
                </tr>
                {(number || number === 0) && <tr>
                    <td className={tdClassFirst}>{numberTerm}:</td>
                    <td className={tdClassLast}>{number}</td>
                </tr> }
                <tr>
                    <td className={tdClassFirst}>{t('asset.mint')}:</td>
                    <td className={tdClassLast}>#{mint}</td>
                </tr>
                {mintExistence ? <tr>
                    <td className={tdClassFirst}>{t('asset.mint_existence')}:</td>
                    <td className={tdClassLast}>#{mintExistence}</td>
                </tr> : ''}
                <tr>
                    <td className={tdClassFirst}>{t('asset.number_of_assets')}:</td>
                    <td className={tdClassLast}>
                        <div className="inline-flex leading-6"><a className="text-white underline" data-tip={t('asset.available')} target="_blank" href={
                            `/explorer?tab=assets&term=${escape(name)}&collection=${author}&category=${category}${
                                variant ? `&variant=${variant}` : ''}${rarity ? `&rarity=${rarity}` : ''}${
                                color ? `&color=${color}` : ''}${border ? `&border=${border}` : ''}${
                                type ? `&type=${type}` : ''}&attr7=${attr7 ? attr7 : ''}&attr8=${
                                attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${
                                attr10 ? attr10 : ''}&exact_search=true&on_sale=false&search_type=assets`}>
                            {assetCount}
                        </a>
                            {burnedCount ? ' / ' : ''}
                            {burnedCount ? <div data-tip={t('asset.burned')}>{burnedCount}🔥</div> : ''}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('asset.owner')}:</td>
                    <td className={tdClassLast}>{getOwnerLink(newOwner ? newOwner : (offer ? sender : owner))}</td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('profile.collection')}:</td>
                    <td className={tdClassLast}>
                        <div className="inline-flex">{verified ? <div className={'mr-1'}>
                            <img src="/verified.svg" className="w-4 h-4" /></div> : ''}<div>{getAuthorLink(author)}</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('asset.category')}:</td>
                    <td className={tdClassLast}>{category}</td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('asset.created')}:</td>
                    <td className={tdClassLast}>{date}</td>
                </tr>
            </table>
            <h2>{t('general.data')}</h2>
            <table className={tableClass}>
                {assetData && Object.keys(assetData).map(key => (
                    <tr>
                        <td className={tdClassFirst}>{key}:</td>
                        <td className={tdClassLast}>{(''+assetData[key])}</td>
                    </tr>))}
            </table>
            <h2>{t('search.market')}</h2>
            <table className={tableClass}>
                <tr>
                    <td className={tdClassFirst}>{t('asset.average_bought')}:</td>
                    <td className={tdClassLast}>
                        {priceInfo && priceInfo['isLoading'] ? 'Loading...' : priceInfo['average'] ? `${formatWAX(priceInfo['average'])}` : ''}
                        {priceInfo && priceInfo['isLoading'] ? '' : priceInfo['average_usd'] ? <span className='text-sm' >/${formatNumber(priceInfo['average_usd'])}</span> : '-'}
                    </td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('asset.num_sales')}:</td>
                    <td className={tdClassLast}>
                        {priceInfo && priceInfo['isLoading'] ? 'Loading...' : priceInfo['num_sales'] ? `${priceInfo['num_sales']}` : ''}
                    </td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>{t('asset.lowest_available_price')}:</td>
                    <td className={tdClassLast}>
                        <Link
                              href={`/market/?term=${escape(name)}&collection=${author}&category=${category}&order_by=offer_asc&limit=100${
                                  rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${variant}` : ''}${border ? `&border=${
                                      border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true`}
                        >
                            <div className={searchItemClassName}>
                                {priceInfo['isLoading'] ? 'Loading...' : priceInfo['lowest'] ? `${formatWAX(priceInfo['lowest'])}` : ''}
                                {priceInfo['isLoading'] ? '' : priceInfo['lowest_usd'] ? `/ $${formatNumber(priceInfo['lowest_usd'])}` : '-'}
                                {searchIcon}
                            </div>
                        </Link>
                    </td>
                </tr>
                {priceInfo && priceInfo['last_sold'] ? (
                    <tr>
                        <td className={tdClassFirst}>{t('asset.last_sold')}:</td>
                        <td className={tdClassLast}><Link
                               href={`/market/?term=${escape(name)}&collection=${author}&category=${category}&order_by=date_desc&limit=100${
                                  rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${variant}` : ''}${border ? `&border=${
                                      border}` : ''}${color ? `&color=${color}` : ''}${
                                  type ? `&type=${type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=trades`}>
                            <div className={searchItemClassName}>
                                {formatNumber(priceInfo['last_sold'])} WAX / ${formatNumber(priceInfo['last_sold_usd'])}
                                {searchIcon}
                            </div>
                        </Link>
                       </td>
                    </tr>
                ) : '' }
            </table>
            <ReactTooltip />
        </div>
    );
};

export default AssetDetails;
