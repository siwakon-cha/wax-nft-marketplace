import React, {useEffect, useState} from 'react';
import moment from 'moment';

import MarketButtons from '../marketbuttons'
import get from "../helpers/Api";
import SwappableImage from "../swappableimage";
import VideoElement from "../videoelement/VideoElement"
import PreviewDetailsTable from "./PreviewDetailsTable";
import Link from 'next/link';
import MoreOptions from "./MoreOptions";
import cn from "classnames";
import {useTranslation} from "react-i18next";

function AssetPreview(props) {
    const asset = props['asset'];

    const index = props['index'];
    const selectedAsset = props['selectedAsset'];
    const prevType = props['type'];
    const {t} = useTranslation('common');
    const [priceInfo, setPriceInfo] = useState(null);
    const [currentAsset, setCurrentAsset] = useState(0);
    const [newOwner, setNewOwner] = useState(null);
    const [favored, setFavored] = useState(asset['isFavorited']);
    const [frontVisible, setFrontVisible] = useState(true);
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [auctionInterval, setAuctionInterval] = useState(null);
    const [auctionTimeLeft, setAuctionTimeLeft] = useState('');
    const onAdd = props['onAdd'];
    const [calcMint, setCalcMint] = useState(false);
    const rplanet = props['rplanet'];
    const bundleView = props['bundleView'];
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState(null);

    const [swapped, setSwapped] = useState(false);
    const [unstaked, setUnstaked] = useState(false);
    const [staked, setStaked] = useState(false);
    const [bidPlaced, setBidPlaced] = useState(false);
    const [bought, setBought] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [sold, setSold] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transferred, setTransferred] = useState(false);

    const {assets, bundle, orderName, offer, isAuction, endTime, saleId} = asset;

    let {
        assetId, aAssetId, category, author, name, image, previmg, backimg, mint,
        average, standard, link, claimer, claimed, orderId, verified,
        symbol, market, mdata, authorImg, aether_value, thumbnail, authorThumbnail,
    } = asset;

    const ends = endTime && isAuction ? moment.utc(endTime).toDate() : null;
    const endDate = ends? moment(ends).local().format('YYYY-MM-DD HH:mm:ss') : '';

    if (!authorImg && verified) {
        authorImg = 'https://ipfs.hivebp.io/ipfs/QmVVE5aLtq4EtMe4Khev5CSic3AKqX2RuNTAB79thvpqQW'
    } else if (!verified && authorImg) {
        authorImg = null;
    }

    useEffect(() => {}, [frontVisible]);

    useEffect(() => {
        if (ends) {
            if (auctionInterval) {
                clearInterval(auctionInterval);
            }

            const currentTime = moment();

            const diffTime = moment(endTime).unix() - currentTime.unix();
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
    }, []);

    if (standard && standard === 'atomicassets')
        assetId = aAssetId;

    const assetIds = [];

    const getPriceInfo = async () => {
        if (!priceInfo) {
            const pInfo = await get(symbol ? 'price-info-fts/' + symbol : 'price-info/' + assetId);

            setCalcMint(true);

            setPriceInfo(pInfo);
        }
    };

    const handleBought = (bought) => {
        if (bought) {
            setNewOwner(userName);
            asset['owner'] = newOwner;
            asset['offer'] = null;
        }

        setIsLoading(false);
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
        setIsLoading(false);
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

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
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

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
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

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
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

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
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
        setIsLoading(false);
    };

    const handleSwap = (swap) => {
        try {
            setSwapped(swap);

            setIsLoading(false);
            setCanceled(false);
        } catch (e) {
            console.log(e.message);
            setSwapped(false);
            setIsLoading(false);
            setError(e.message);
        }
    };

    if (assets && !bundleView) {
        const a = assets[currentAsset];
        assetId = a.assetId;
        category = a.category;
        average = a.average;
        author = a.author;
        name = assets.length > 1 ? orderName ? `${currentAsset + 1}/${assets.length} ${orderName.substr(0, 60)}` : `${
            assets[currentAsset].name} (Bundle ${currentAsset + 1}/${assets.length})` : a.name;
        image = a.image;
        backimg = a.backimg;
        mint = a.mint;
        mdata = a.mdata;
        aether_value = a.aether_value;
        assets.forEach(asset => assetIds.push(asset.assetId));
    } else {
        assetIds.push(assetId);
    }

    const prevAsset = async () => {
        if (currentAsset > 0)
            setCurrentAsset(currentAsset - 1);
        else
            setCurrentAsset(assets.length - 1);
    };

    const nextAsset = async () => {
        if (currentAsset === assets.length - 1)
            setCurrentAsset(0);
        else
            setCurrentAsset(currentAsset + 1);
    };

    const favor = () => {
        setFavored(true);
        var encodedString = window.btoa( activeUser['accountName'] );

        get(`favor/${assetId}?key=${encodedString}`);
    };

    const unfavor = () => {
        setFavored(false);
        var encodedString = window.btoa( activeUser['accountName'] );
        get(`unfavor/${assetId}?key=${encodedString}`);
    };

    const assetData = mdata ? JSON.parse(mdata) : null;

    let video = '';

    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    }

    if (thumbnail && video)
        video = thumbnail;

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    const loadBack = () => {
        setFrontVisible(false);
        getPriceInfo();
    };

    return (
        <div className={cn(
            'relative w-56 min-w-min rounded-md overflow-hidden flex flex-col',
            'center p-3 shadow hover:shadow-bluet bg-paper hover:bg-paperl transition transition-colors',
            'rounded-2xl mx-auto my-2 md:m-2 lg:m-2 backdrop-filter backdrop-blur-sm'
        )} id={'AssetPreview_'+index}>
            {(isAuction && endDate) &&
            <div
                className={cn(
                    'relative text-sm p-2 my-auto text-white'
                )}
            >
                {`${t('asset.ends')}: ${auctionTimeLeft}`}
            </div>}
            <MoreOptions
                setShowMenu={setShowMenu}
                newOwner={newOwner}
                ual={props['ual']}
                rplanet={rplanet}
                showMenu={showMenu}
                asset={asset}
                handleSell={handleSell}
                handleTransfer={handleTransfer}
                handleSwap={handleSwap}
                handleStake={handleStake}
                swapped={swapped}
                unstaked={unstaked}
                staked={staked}
                bidPlaced={bidPlaced}
                bought={bought}
                canceled={canceled}
                isClaimed={isClaimed}
                error={error}
                setError={setError}
                sold={sold}
                setSold={setSold}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                transferred={transferred}
            />
            <div onClick={toggleShowMenu} className={cn(
                'absolute text-sm h-11 text-white right-2 top-2 z-10'
            )}>
            <img
                className={cn(
                    'w-4 h-4',
                    {'transition transform duration-250 rotate-90': showMenu},
                    {'transition transform duration-250 rotate-0': !showMenu},
                )}
                src="/more.svg"
                alt=''
            />
            </div>
            <div onClick={favored ? unfavor : favor} className={cn(
                'absolute right-10 top-m1'
            )}>
                <img className={cn(
                    'h-5'
                )} src={favored ? "/bookmark.svg" : "/bookmark-outline.svg"} alt={t('search.favorites')} />
            </div>
            <Link href={'/collection/' + author}>
                <div className={cn(
                    'relative flex text-white text-sm w-40 h-6 m-2 cursor-pointer'
                )}>
                    { authorImg &&
                        <div className={cn(
                            'flex w-4 h-4 rounded-lg overflow-hidden my-auto'
                        )}>
                            <img
                                className={cn(
                                    'm-auto'
                                )}
                                src={authorThumbnail ? authorThumbnail : authorImg}
                                alt=''
                            />
                        </div>
                    }
                    <div
                        className={cn(
                            'text-center mx-2 my-auto bottom-2 h-6'
                        )}
                    >
                        <p className={'mb-auto h-6'}>{author}</p>
                    </div>
                    { verified &&
                        <div className={cn('h-4 my-auto')}>
                            <img src={"/verified.svg"} alt='' />
                        </div>
                    }
                </div>
            </Link>
            <PreviewDetailsTable
                visible={!frontVisible}
                asset={asset}
                newOwner={newOwner}
                priceInfo={priceInfo}
                bundleView={bundleView}
                calcMint={calcMint}
                currentAsset={currentAsset}
            />
            <div className={cn(
                'h-64 relative',
                { 'visible': frontVisible},
                { 'hidden': !frontVisible},
            )}>
                <div>
                    <div className={cn(
                        'flex w-48 h-48 m-auto'
                    )}>
                        {bundle && !bundleView && assets.length > 1 ? (<button className={cn(
                            'absolute m-auto h-full border-0 text-primary cursor-pointer bg-paper',
                            'outline-none text-2xl left-m1 opacity-80 hover:opacity-100',
                            'rounded-r-2xl'
                        )} onClick={prevAsset}>‹</button>) : ''}
                        <Link href={symbol ? ('/pack/' + symbol + (orderId ? `?listing_id=${orderId ? orderId : ''}` : '') + (
                            assetId ? `${orderId ? '&' : '?'}asset_id=${assetId}` : '') + (
                            market ? `${orderId || assetId ? '&' : '?'}market=${market}` : '')) : saleId ? `/sale/${saleId}` : (
                            offer ? '/listing/' : '/asset/') + assetId + (orderId ? `?listing_id=${orderId}` : '')}>
                            <div className={cn('m-auto cursor-pointer')}>
                                { video ?
                                    <VideoElement
                                        index={index}
                                        video={video}
                                        width={190}
                                        height={190}
                                        image={image}
                                        backimg={backimg}
                                    />
                                :
                                    <SwappableImage
                                        assetId = {assetId}
                                        author = {author}
                                        image = {image}
                                        prevImg={thumbnail ? thumbnail : previmg}
                                        backImg = {backimg}
                                        category = {category}
                                    />
                                }
                            </div>
                        </Link>
                        {(bundle && !bundleView && assets.length > 1) &&
                            <button className={cn(
                                'absolute m-auto h-full border-0 text-primary cursor-pointer bg-paper',
                                'outline-none text-2xl right-m1 opacity-80 hover:opacity-100',
                                'rounded-l-2xl'
                            )} onClick={nextAsset}>›</button>
                        }
                    </div>
                </div>
                {mint &&
                    <div className={cn(
                        'absolute bottom-10 w-full m-auto flex justify-center h-6'
                    )}>
                        <div className={
                            cn(
                            'm-auto p-mint leading-6 text-white',
                            'text-sm rounded-lg bg-dark b-1 min-w-8'
                        )}>#{mint}</div>
                    </div>
                }
                <div className={
                    cn(
                        'h-8 flex justify-evenly w-40 text-white mt-4 ml-auto mr-auto cursor-pointer',
                        {'text-xs': name && name.length >= 20},
                        {'text-sm': name && name.length < 20}
                    )}
                >
                    <div>{name ? name : assetId}</div>
                </div>
            </div>

            {(!selectedAsset && selectedAsset !== 0) &&
                <MarketButtons
                    onAdd={onAdd}
                    average={priceInfo && priceInfo['average'] ? priceInfo['average'] : average}
                    type={prevType}
                    ual={props['ual']}
                    asset={asset}
                    aetherValue={aether_value}
                    newOwner={newOwner}
                    link={link}
                    claimer={claimer}
                    claimed={claimed}
                    frontVisible={frontVisible}
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
                    error={error}
                    setError={setError}
                    sold={sold}
                    setSold={setSold}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            }

            <div className={cn(
                'flex justify-center mt-auto h-6 cursor-pointer'
            )}>
                <div onClick={() => setFrontVisible(true)}>
                    <img
                        className={cn(
                            'h-5 m-1'
                        )}
                        src={frontVisible ? '/radio-button-on.svg' : '/radio-button-off.svg'}
                        alt=""
                    />
                </div>
                <div onClick={loadBack}>
                    <img
                        className={cn(
                            'h-5 m-1'
                        )}
                        src={frontVisible ? '/radio-button-off.svg' : '/radio-button-on.svg'}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

export default AssetPreview;
