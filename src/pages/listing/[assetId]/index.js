import React, {useContext, useEffect, useState} from 'react';
import PriceHistory from '../../../components/asset/PriceHistory';
import {
    formatNumber,
    setQueryStringWithoutPageReload
} from "../../../components/helpers/FormatLinks";

import {get} from "../../../components/helpers/Api";

import MarketButtons from "../../../components/marketbuttons";
import {useTranslation} from "react-i18next";

import AssetList from "../../../components/assetlist";
import AssetDetails from "../../../components/asset/AssetDetails";
import LoadingIndicator from "../../../components/loadingindicator";

import qs from 'qs';
import {Context} from "../../../components/waxplorer";
import {useQuery} from "react-query";
import moment from 'moment';
import AssetImage from "../../../components/asset/AssetImage";
import Page from "../../../components/page/Page";
import FullImageView from "../../../components/fullimageview/FullImageView";
import cn from 'classnames'

const ListingPage = (props) => {
    const miniListing = props.miniListings[0];

    const singleId = props.assetId;

    const listing_id = props.listing_id;

    const { isLoading, error, data } = useQuery(
        `listing-${singleId}`,
        process.browser ? () => get(
            `listing/${singleId}${(listing_id ? "?listing_id=" + listing_id : '')}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const assets = data;

    if (assets && assets[0] && assets[0].bundle) {
        assets[0]['assets'] = assets.map(asset => {
            return {
                'assetId': asset.assetId,
                'name': asset.name,
                'image': asset.image,
                'category': asset.category,
                'author': asset.author
            }
        });
    }

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [newOwner, setNewOwner] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(0);
    const [initial, setInitial] = useState(true);
    const [asset, setAsset] = useState(assets ? assets[0] : null);
    const [isLoading3, setIsLoading3] = useState(true);
    const [similarListings, setSimilarListings] = useState([]);
    const [auctionInterval, setAuctionInterval] = useState(null);
    const [auctionTimeLeft, setAuctionTimeLeft] = useState('');

    const [swapped, setSwapped] = useState(false);
    const [unstaked, setUnstaked] = useState(false);
    const [staked, setStaked] = useState(false);
    const [bidPlaced, setBidPlaced] = useState(false);
    const [bought, setBought] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [sold, setSold] = useState(false);
    const [error2, setError2] = useState(null);
    const [transferred, setTransferred] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const handleBought = (bought) => {
        if (bought) {
            setNewOwner(userName);
            asset['owner'] = newOwner;
            asset['offer'] = null;
        }

        setIsLoading2(false);
        setBought(bought);
    };

    const handleSell = (sellInfo) => {
        if (sellInfo) {
            const wasSold = sellInfo['sold'];
            const market = sellInfo['market'];
            const offer = sellInfo['offer'];

            if (wasSold) {
                setNewOwner(market);
                asset['owner'] = market;
                asset['market'] = market;
                asset['offer'] = offer;
                asset['sender'] = userName;
                setCanceled(false);
            }

            setSold(wasSold);
        }
        setIsLoading2(false);
    };

    const handleCancel = (cancel) => {
        try {
            if (cancel) {
                setNewOwner(userName);
                asset['owner'] = userName;
                asset['offer'] = null;
                setSold(false);
                setCanceled(cancel);
            }

            setIsLoading2(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading2(false);
            setError2(e.message);
        }
    };

    const handleBidPlaced = (bid) => {
        setBidPlaced(bid);
    };

    const handleClaim = (claim) => {
        try {
            if (claim) {
                setNewOwner(userName);
                asset['owner'] = userName;
                asset['offer'] = null;
                setIsClaimed(true);
            }

            setIsLoading2(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading2(false);
            setError2(e.message);
        }
    };

    const handleUnstake = (unstake) => {
        try {
            if (unstake) {
                setNewOwner(userName);
                asset['owner'] = userName;
                asset['offer'] = null;
                setUnstaked(true);
                setStaked(false);
                setBought(false);
                setSold(false);
            }

            setIsLoading2(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading2(false);
            setError2(e.message);
        }
    };

    const handleStake = (stake) => {
        try {
            if (stake) {
                setNewOwner('s.rplanet');
                asset['owner'] = userName;
                asset['offer'] = null;
                setUnstaked(true);
                setStaked(true);
                setUnstaked(false);
                setBought(false);
            }

            setIsLoading2(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading2(false);
            setError2(e.message);
        }
    };

    const handleTransfer = (sellInfo) => {
        if (sellInfo) {
            const wasTransferred = sellInfo['transferred'];
            const owner = sellInfo['receiver'];

            if (wasTransferred) {
                setNewOwner(owner);
                asset['owner'] = owner;
                asset['sender'] = userName;
            }

            setTransferred(wasTransferred);
        }
        setIsLoading2(false);
    };

    const {standard, image, total, offer, assetId} = assets && assets.length > 0 ? assets[selectedAsset] : asset ? asset :
        {standard: null, image: null, backimg: null, total: null, mdata: null, transactions: null, offer: null, assetId: null};

    const [displayImage, setDisplayImage] = useState(image);

    const getAsset = async (id) => {
        await get("asset/" + id).then((result) => { setAsset(result); setIsLoading3(false); });
    };

    const getListings = async (assetId) => {
        await get("get-similar-listings/" + assetId ).then(
            (result) => { setSimilarListings(result); setIsLoading3(false); });
    };

    const getHash = (s) => {
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    };

    const ends = data && data.length > 0 && data[0]['endTime'] && data[0]['isAuction'] ? moment.utc(data[0]['endTime']).toDate() : null;

    useEffect(() => {
        setDisplayImage(image);
    }, [image]);

    useEffect(() => {
        if (process.browser) {
            dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: miniListing.collectionImage });
            if (!isLoading && assets && assets.length === 0)
                getAsset(singleId);
            else if (initial && assets) {
                const hash = getHash(formatNumber(offer) + ' WAX');

                const query = {'id': hash};
                if (listing_id)
                    query['listing_id'] = listing_id;

                if (hash) {
                    setQueryStringWithoutPageReload(qs.stringify(query));
                }
                if (!isLoading && assets.length === 1) {
                    getListings(assets[0]['assetId']);
                    setAsset(assets[0]);
                    setIsLoading3(false);
                }
            } else if (assets && assets.length === 0) {
                getAsset(assets[selectedAsset].assetId);
            }
            if (ends) {
                if (auctionInterval) {
                    clearInterval(auctionInterval);
                }

                const currentTime = moment().utc();

                const diffTime = moment(data[0]['endTime']).unix() - currentTime.unix();
                let duration = moment.duration(diffTime * 1000, 'milliseconds');
                const interval = 1000;

                setAuctionInterval(setInterval(function() {
                    duration = moment.duration(duration - interval, 'milliseconds');

                    if (auctionInterval) {
                        clearInterval(auctionInterval);
                    }

                    if (duration.asSeconds() < 0)
                        setAuctionTimeLeft(' - ');
                    else
                        setAuctionTimeLeft(`${duration.days()}d ${duration.hours()}h ${
                            duration.minutes()}m ${duration.seconds()}s`);
                }, interval));
            }
        }
    }, [selectedAsset, initial, assets]);

    const toggleImage = () => {
        if (showImage) {
            setDisplayImage(image);
        }
        setShowImage(!showImage);
    };

    let mintInfo = '';
    if (miniListing.mint && miniListing.total)
        mintInfo = ` (Mint ${miniListing.mint}/${miniListing.total})`
    else if (miniListing.mint)
        mintInfo = ` (Mint ${miniListing.mint})`;

    const rarityInfo = miniListing.rarity ? ` - ${miniListing.rarity}` : '';

    const [ state, dispatch ] = useContext(Context);

    const preview = miniListing.preview ? miniListing.preview : miniListing.image ? miniListing.image : 'https://www.nfthive.io/nfthive-logo.png';

    const title = miniListing.totalResults > 1 ? t('links.check_out_this_bundle_num_assets_for_price', {
        num_assets: miniListing.totalResults, price: `${formatNumber(miniListing.offer)} WAX`}) : t(
            'links.check_out_asset_name', {asset_name: `${miniListing.name}${rarityInfo}${mintInfo}`});
    const description = miniListing.offer ? t('links.buy_for_wax_usd', {wax_usd: `${formatNumber(miniListing.offer)} WAX / $${formatNumber(miniListing.usdOffer)}`}) : t('links.inspect_asset_on_waxplorer');

    if (isLoading2 || !asset) {
        return <Page
            id="ListingPage"
            title={title}
            description={description}
            image={preview}
        >
            <LoadingIndicator/>
        </Page>
    }

    const scrollUp = () => {
        const element = document.getElementById("ListingPage");
        element.scrollTo({left: 0, top: 0, behavior: "smooth"});
    };

    const page = (
        <Page
            id="ListingPage"
            title={title}
            description={description}
            image={preview}
        >
            {isLoading ? <LoadingIndicator/> :
            <div className={cn(
                'w-full h-auto flex flex-col lg:flex-row',
                'justify-center items-center'
            )}>
                <AssetImage
                    asset={assets && assets.length > 0 ? assets[selectedAsset] : asset}
                    toggleImage={toggleImage}
                    setDisplayImage={setDisplayImage}
                />
                <AssetDetails
                    asset={assets && assets.length > 0 ? assets[selectedAsset] : asset}
                    assetId={assets && assets.length > 0 ? assets[selectedAsset].assetId : asset.assetId}
                    
                    newOwner={newOwner}
                />
            </div> }
            <div className="w-auto h-40 relative text-center top-4">
                {auctionTimeLeft && <div className={cn(
                    'relative top-0 left-0',
                    'opacity-70 text-white text-xs',
                )}>
                    {`${t('asset.ends')}: ${auctionTimeLeft}`}
                </div>}
                <div className="h-20 m-auto">
                    {
                        standard === 'atomicassets' ? <a className="text-yellow-600" href={`https://wax.atomichub.io/explorer/asset/${asset.aAssetId}`}>{t('asset.view_on', {market:'AtomicHub'})}</a>
                        : <a className="text-yellow-600" href={`https://wax.simplemarket.io/products/asset/${assetId}`}>{t('asset.view_on', {market:'Simplemarket'})}</a>
                    }
                </div>
                <MarketButtons
                    ual={props['ual']}
                    asset={asset}
                    newOwner={newOwner}
                    setNewOwner={setNewOwner}
                    
                    view={'full'}
                    handleSell={handleSell}
                    handleBought={handleBought}
                    handleClaim={handleClaim}
                    handleStake={handleStake}
                    handleUnstake={handleUnstake}
                    handleCancel={handleCancel}
                    handleBidPlaced={handleBidPlaced}
                    swapped={swapped}
                    unstaked={unstaked}
                    staked={staked}
                    bidPlaced={bidPlaced}
                    bought={bought}
                    canceled={canceled}
                    isClaimed={isClaimed}
                    error={error2}
                    setError={setError2}
                    sold={sold}
                    setSold={setSold}
                    setIsLoading={setIsLoading2}
                    isLoading={isLoading2}
                />
            </div>
            { isLoading ? '' : <div className="MoreSales">
                {assets.length === 1 ? <h3>{t('asset.more_from_seller', {seller: assets[0]['sender']})}</h3> : '' }
                {assets.length === 1 ? <AssetList bundleView={true} ual={props['ual']} assets={similarListings} onSale={true} /> : '' }
                {assets.length > 1 ? <h3>{t('asset.assets_in_sale')}</h3> : '' }
                {assets.length > 1 ? <AssetList bundleView={true} ual={props['ual']} assets={assets} onSale={false} clickAsset={(num) => {scrollUp(); setSelectedAsset(num);} } selectedAsset={assets[selectedAsset].assetId}/> : '' }
            </div> }
            { isLoading ? '' : <PriceHistory assetId={assetId} /> }
        </Page>
    );

    if (showImage) {
        return (
            <div>
                {showImage ? <FullImageView
                    image={image}
                    toggleFunc={toggleImage}
                /> : ''}
                {page}
            </div>
        )
    } else {
        return page;
    }
};

ListingPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const assetId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const values = qs.parse(paths[2].replace(`${assetId}?`, ''));

    values['miniListings'] = await get("listing-minimal/" + assetId + (values['listing_id'] ? "?listing_id=" + values['listing_id'] : ''));

    values['assetId'] = assetId;

    return values
};

export default ListingPage;
