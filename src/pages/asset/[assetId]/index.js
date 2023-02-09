import React, {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames'
import TransactionList from '../../../components/asset/TransactionList';
import PriceHistory from '../../../components/asset/PriceHistory';
import { get } from '../../../components/helpers/Api'; 

import MarketButtons from "../../../components/marketbuttons";
import {useTranslation} from "react-i18next";
import qs from "qs";

import AssetDetails from "../../../components/asset/AssetDetails";
import {Context} from "../../../components/waxplorer";
import {useQuery} from "react-query";
import LoadingIndicator from "../../../components/loadingindicator";
import Link from 'next/link';
import AssetImage from "../../../components/asset/AssetImage";
import Page from "../../../components/page/Page";
import FullImageView from "../../../components/fullimageview/FullImageView";

const AssetPage = (props) => {
    const miniAsset = props.miniAsset;

    const { isLoading, error, data } = useQuery(
        `asset-${miniAsset['assetId']}`,
        process.browser ? () => get(`asset/${miniAsset['assetId']}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const asset = data;

    const router = useRouter();
    const assetId = router ? qs.parse(router.query)['assetId'] : miniAsset['assetId'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const [ state, dispatch ] = useContext(Context);

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [newOwner, setNewOwner] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [sales, setSales] = useState(null);

    const [swapped, setSwapped] = useState(false);
    const [unstaked, setUnstaked] = useState(false);
    const [staked, setStaked] = useState(false);
    const [bidPlaced, setBidPlaced] = useState(false);
    const [bought, setBought] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [sold, setSold] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error2, setError2] = useState(null);
    const [transferred, setTransferred] = useState(false);
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

    const {standard, image, total, transactions} = asset ? asset :
        {standard: null, image: null, backimg: null, total: null, mdata: null, transactions: null};

    const [displayImage, setDisplayImage] = useState(image);

    useEffect(() => {
        setDisplayImage(image);
        dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: miniAsset.collectionImage });
    }, [assetId, image]);

    const toggleImage = () => {
        if (showImage) {
            setDisplayImage(image);
        }
        setShowImage(!showImage);
    };

    let mintInfo = '';
    if (asset && asset.mint && asset.total)
        mintInfo = `(Mint ${asset.mint}/${asset.total})`;
    else if (asset && asset.mint)
        mintInfo = `(Mint ${asset.mint})`;

    const assetName = `${miniAsset.name} by ${miniAsset.collectionName} ${mintInfo}`;

    const preview = miniAsset.preview ? miniAsset.preview : miniAsset.image ? miniAsset.image : 'https://www.nfthive.io/nfthive-logo.png';

    const title = t('links.check_out_asset_name', {asset_name: assetName});

    const description = t('links.inspect_asset_on_waxplorer');


    if (isLoading || !asset) {
        return (
            <Page
                id="AssetPage"
                title={title}
                image={preview}
                description={description}
            >
                <LoadingIndicator/>
            </Page>
        );
    }

    const page = (
        <Page
            id="AssetPage"
            title={title}
            image={preview}
            description={description}
        >
            {isLoading ? <LoadingIndicator/> :
            <div className={cn(
                'w-full h-auto flex flex-col lg:flex-row',
                'justify-center items-center'
            )}>
                <AssetImage
                    asset={asset}
                    toggleImage={toggleImage}
                    setDisplayImage={setDisplayImage}
                />
                <AssetDetails
                    asset={asset}
                    assetId={assetId}
                    
                    newOwner={newOwner}
                />
            </div> }
            {sales && <div>
                {sales.map(sale => (
                    <Link href={`/sale/${assetId}${sale['listing_id'] ? `?listing_id=${sale['listing_id'] ? sale['listing_id'] : ''}` : ''}`}>
                        <div className="cursor-pointer">{t('asset.this_asset_is_for_sale')}</div>
                    </Link>
                ))}
            </div>
            }
            <div className="w-auto h-40 relative text-center top-4">
                <div className="h-20 m-auto">
                    {
                        standard === 'atomicassets' ? <a target="_blank" className="text-yellow-600" href={
                            `https://wax.atomichub.io/explorer/asset/${asset.aAssetId}`}>{
                            t('asset.view_on', {market:'AtomicHub'})}</a>
                        : <a target="_blank" className="text-yellow-600" href={`https://wax.simplemarket.io/products/asset/${assetId}`}>{
                            t('asset.view_on', {market:'Simplemarket'})}</a>
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
            { isLoading ? '' : <PriceHistory assetId={assetId} /> }
            { isLoading || !transactions || transactions.length === 0 ? '' : <TransactionList transactions={transactions} /> }
        </Page>
    );

    if (showImage) {
        return (<div>
            {showImage ? <FullImageView
                image={image}
                toggleFunc={toggleImage}
            /> : ''}
            {page}
        </div>)
    } else {
        return page;
    }
};


AssetPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');
    const assetId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const miniAsset = await get("asset-minimal/" + assetId);

    const values = qs.parse(paths[2].replace(`${assetId}?`, ''));
    values['miniAsset'] = miniAsset;

    return values;
};

export default AssetPage;