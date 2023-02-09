import {formatNumber, getAuthorLink} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import React, {useEffect, useState} from "react";
import Link from 'next/link';
import ReactTooltip from "react-tooltip";
import {useTranslation} from "react-i18next";

const TemplateDetails = (props) => {
    const template = props.template;
    const templateId = props.templateId;
    const assetCount = props.assetCount;
    const burnedCount = props.burnedCount;
    const [priceInfo, setPriceInfo] = useState('Loading...');
    const {t} = useTranslation('common');
    const {name, author, category, mdata, verified} = template;

    const assetData = mdata ? JSON.parse(mdata) : null;

    useEffect(() => {
        if (process.browser)
            Promise.all([
                get('price-info-template/' + templateId).then((result) => {setPriceInfo(result)})
            ]);
    }, [templateId]);

    return (
        <div className="AssetDetails">
            <div className={"AssetName"}>{name}</div>
            <table>
                <tr>
                    <td>ID:</td>
                    <td>{templateId}</td>
                </tr>
                <tr>
                    <td>{t('asset.name')}:</td>
                    <td>{name}</td>
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
                    <td>{t('asset.number_of_assets')}:</td>
                    <td>
                        <div className="NumberOfAssets">
                            <a data-tip={t('asset.available')} target="_blank" href={`/explorer?tab=assets&template_id=${templateId}&collection=${author}&category=${category}&exact_search=true&on_sale=false&search_type=assets`}>
                                {assetCount}
                            </a>
                            {burnedCount ? ' / ' : ''}
                            {burnedCount ? <div data-tip={t('asset.burned')}>{burnedCount}🔥</div> : ''}
                        </div>
                    </td>
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
                    <td>{t('asset.num_sales')}:</td>
                    <td>
                        {priceInfo && priceInfo['isLoading'] ? 'Loading...' : priceInfo['num_sales'] ? `${priceInfo['num_sales']}` : ''}
                    </td>
                </tr>
                <tr>
                    <td>{t('asset.lowest_available_price')}:</td>
                    <td>
                        <Link
                              href={`/market/?template_id=${templateId}&collection=${author}&order_by=offer_asc&limit=100&exact_search=true`}
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
                               href={`/market/?template_id=${templateId}&collection=${author}&order_by=date_desc&limit=100&exact_search=true&search_type=trades`}>
                            <div className={"NextLink"}>{formatNumber(priceInfo['last_sold'])} WAX / ${formatNumber(priceInfo['last_sold_usd'])}  <img className="SearchIcon" src="/search.svg"/></div>
                        </Link>
                       </td>
                    </tr>
                ) : '' }
            </table>
            <ReactTooltip />
        </div>
    );
};

export default TemplateDetails;
