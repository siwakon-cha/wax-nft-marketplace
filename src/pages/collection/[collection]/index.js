import {get} from "../../../components/helpers/Api";
import qs from 'qs';
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import FixedSearchComponent from "../../../components/searchitems/FixedSearchComponent";
import Link from 'next/link';
import SetList from "../../../components/explorer/SetList";
import ReactMarkdown from "react-markdown";
import CollectionChart from "../../../components/stats/CollectionChart";
import Page from "../../../components/page/Page";
import FullImageView from "../../../components/fullimageview/FullImageView";
import AssetListHeader from "../../../components/common/util/AssetListHeader";
import cn from "classnames";
import LazyLoad from 'react-lazy-load';

const CollectionPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const collection = props.collection;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [showImage, setShowImage] = useState(false);

    const {name, collectionName, image, marketFee, telegram, url, description} = collection;

    const { isLoading, error, data } = useQuery(
        `collection-${collectionName}`,
        process.browser ? () => get(`collection-details/${collectionName}`, 'stats') : () => {
            return {isLoading: true, error: null, data: null}});

    const packCategory = data ? data['packCategory'] : null;
    const symbol = data ? data['symbol'] : null;
    const authorized = data ? data['authorized'] : null;

    const toggleImage = () => {
        setShowImage(!showImage);
    };

    const collectionStats = isLoading ? {
        'allTimeVolume': 'Loading...',
        'allTimeUsdVolume': 'Loading...',
        'growth': 'Loading...',
        'numSets': 'Loading...',
        'numCollectionItems': 'Loading...',
        'numRankedUsers': 'Loading...',
        'usdVolume': 'Loading...',
        'volume': 'Loading...'
    } : data;

    const bgBlue = cn('pt-12 bg-bluet2 h-auto');
    const bgTransparent = cn('pt-12 bg-transparent h-auto');

    return (
        <Page
            id={"CollectionPage"}
            title={t('links.check_out_asset_name', {asset_name: `${name}`})}
            description={description}
            image={image}
        >
            {showImage ? <FullImageView
                image={image}
                toggleFunc={toggleImage}
            /> : ''}
            <div className={cn('block lg:flex')}>
                <div className={cn(
                        'relative flex w-full lg:w-2/5 h-auto',
                        'my-5 mt-0 mb-auto mx-0 lg:mx-5%')}>
                    <img className={cn('max-w-full max-h-192 m-auto')} src={image} alt="none" onClick={toggleImage} />
                </div>
                <div className={cn('text-left text-white w-11/12 lg:w-5/12 my-5 lg:my-4 mx-5%')}>
                    <div className={cn('text-4xl mb-8')}>{name}</div>
                    { authorized && authorized.includes(userName) ? <Link href={`/editor/${collectionName}`}>
                        <div className={"EditCollectionButton"}>{t('collection.edit_collection')}</div></Link> : '' }
                    <div>
                        <ReactMarkdown>
                            {description}
                        </ReactMarkdown>
                    </div>
                    {url ? <div className={cn('font-bold leading-13 text-bluel')}><a target='_blank' href={url.includes('http') ? url : `http://${url}`}>{url}</a></div> : ''}
                    {telegram ? <div >Telegram:</div>: ''}
                    {telegram ? <div className={cn('font-bold leading-13 text-bluel')}><a target='_blank' href={telegram}>{telegram}</a></div> : ''}
                    {telegram ? <div >Market Fee:</div>: ''}
                    {telegram ? <div >{marketFee * 100}%</div> : ''}
                    <CollectionChart searchAuthor={collectionName} oneCollection={true} />
                </div>
            </div>
            {collectionStats['numSets'] ? <Link href={`/sets/${collectionName}`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.newest_sets')}
                    </AssetListHeader>
                </div>
            </Link> : '' }
            {collectionStats['numSets'] ? <SetList
                {...props}
                className={bgBlue}
                
                userName={userName}
                embedded={true}
                author={collectionName}
            /> : '' }
            { packCategory || symbol ? <Link href={`/market?tab=packs&collection=${collectionName}&order_by=date_desc&search_type=packs`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('overview.packs')}
                    </AssetListHeader>
                </div>
            </Link> : '' }
                { packCategory || symbol ?
                    <div className={cn(
                        'min-h-192'
                    )}>
                        <LazyLoad offsetTop={200} once>
                            <FixedSearchComponent
                                {...props}
                                className={bgTransparent}
                                searchSettings={{
                                    'search_type': {value: 'packs'},
                                    'collection': {value: collectionName},
                                    'order_by': {value: 'date_desc'},
                                    'limit': {value: 12, fixed: true}
                                }}
                                id={'Fixed0'}
                                userName={userName}
                            />
                        </LazyLoad>
                    </div>: '' }
            <Link href={`/explorer?tab=assets&collection=${collectionName}&order_by=date_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>    
                        {t('collection.newest_assets')}
                    </AssetListHeader>
                </div>
            </Link>
            <div className={cn(
                'min-h-192'
            )}>
                <LazyLoad offsetTop={200} once>
                    <FixedSearchComponent
                        {...props}
                        className={bgBlue}
                        id={'Fixed1'}
                        searchSettings={{
                            'search_type': {value: 'assets'},
                            'collection': {value: collectionName},
                            'order_by': {value: 'date_desc'},
                            'limit': {value: 12, fixed: true}
                        }}
                        userName={userName}
                    />
                </LazyLoad>
            </div>
            <Link href={`/market?tab=sales&collection=${collectionName}&order_by=date_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.latest_listings')}
                    </AssetListHeader>
                </div>
            </Link>
            <div className={cn(
                'min-h-192'
            )}>
                <LazyLoad offsetTop={200} once>
                    <FixedSearchComponent
                        {...props}
                        className={bgTransparent}
                        searchSettings={{
                            'search_type': {value: 'sales'},
                            'collection': {value: collectionName},
                            'order_by': {value: 'date_desc'},
                            'limit': {value: 12, fixed: true}
                        }}
                        id={'Fixed2'}
                        userName={userName}
                    />
                </LazyLoad>
            </div>
            <Link href={`/market?tab=trades&collection=${collectionName}&order_by=offer_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.top_sales')}
                    </AssetListHeader>
                </div>
            </Link>
            <div className={cn(
                'min-h-192'
            )}>
                <LazyLoad offsetTop={200} once>
                    <FixedSearchComponent
                        {...props}
                        className={bgBlue}
                        searchSettings={{
                            'search_type': {value: 'trades'},
                            'collection': {value: collectionName},
                            'order_by': {value: 'offer_desc'},
                            'limit': {value: 12, fixed: true}
                        }}
                        id={'Fixed3'}
                        userName={userName}
                    />
                </LazyLoad>
            </div>
            <Link href={`/explorer?tab=templates&collection=${collectionName}&order_by=template_id_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.newest_templates')}
                    </AssetListHeader>
                </div>
            </Link>
            <div className={cn(
                'min-h-192'
            )}>
                <LazyLoad offsetTop={200} once>
                    <FixedSearchComponent
                        {...props}
                        className={bgTransparent}
                        searchSettings={{
                            'search_type': {value: 'templates'},
                            'collection': {value: collectionName},
                            'order_by': {value: 'asset_id_desc'},
                            'limit': {value: 12, fixed: true}
                        }}
                        id={'Fixed3'}
                        userName={userName}
                    />
                </LazyLoad>
            </div>
        </Page>
    );
};

CollectionPage.getInitialProps = async (ctx) => {
    const c = ctx.query.collection;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));

    values['collection'] = await get("get-collection/" + c);

    return values;
};

export default CollectionPage;
