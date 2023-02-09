import React, {useContext, useEffect, useState} from 'react';

import MarketButtons from "../../../components/marketbuttons";
import {useTranslation} from "react-i18next";
import qs from "qs";
import {get} from "../../../components/helpers/Api";
import PackDetails from "../../../components/pack/PackDetails";
import {Context} from "../../../components/waxplorer";
import LoadingIndicator from "../../../components/loadingindicator";
import Link from 'next/link';
import Page from "../../../components/page/Page";
import FullImageView from "../../../components/fullimageview/FullImageView";
import cn from 'classnames'

const PackPage = (props) => {
    const miniPack = props.miniPack;

    const asset = miniPack;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const [ state, dispatch ] = useContext(Context);

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [newOwner, setNewOwner] = useState(null);
    const [count, setCount] = useState('Loading...');
    const [burned, setBurned] = useState('');
    const [showImage, setShowImage] = useState(false);
    const [imagePosition, setImagePosition] = useState(0);
    const [sales, setSales] = useState(null);
    const assetId = values['asset_id'];

    let firstIsVideo = false;

    useEffect(() => {
        dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: miniPack.collectionImage });
          Promise.all([
          ])
    }, [assetId, imagePosition]);

    const toggleImage = () => {
        setShowImage(!showImage);
    };

    const assetName = `${miniPack.symbol} by ${miniPack.collectionName}`;

    const isLoading = false;

    const title = t('links.check_out_asset_name', {asset_name: assetName});
    const description = t('links.inspect_asset_on_waxplorer');
    const preview = miniPack.image;

    if (isLoading || !asset) {
        return (
            <Page
                id="PackPage"
                title={title}
                description={description}
                image={preview}
            >
                <LoadingIndicator/>
            </Page>
        );
    }

    const {standard, image, backimg, author, category, total, offer, mdata, usd_wax, transactions} = asset;

    const assetData = mdata ? JSON.parse(mdata) : null;

    let video = '';
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
        firstIsVideo = true;
    } else if (assetData && Object.keys(assetData).includes('media')) {
        video = assetData['media'].includes('http') ? assetData['media'] : `https://ipfs.hivebp.io/ipfs/${assetData['media']}`;
        firstIsVideo = true;
    }

    const images = video ? [video, image] : [image];

    if (backimg) {
        images.push(backimg);
    }

    if (assetData) {
        if (Object.keys(assetData).includes('img2'))
            images.push(assetData['img2'].includes('http') ? assetData['img2'] : `https://ipfs.hivebp.io/ipfs/${assetData['img2']}`);

        if (Object.keys(assetData).includes('img3'))
            images.push(assetData['img3'].includes('http') ? assetData['img3'] : `https://ipfs.hivebp.io/ipfs/${assetData['img3']}`);

        if (Object.keys(assetData).includes('img4'))
            images.push(assetData['img4'].includes('http') ? assetData['img4'] : `https://ipfs.hivebp.io/ipfs/${assetData['img4']}`);

        if (Object.keys(assetData).includes('transcript_esp'))
            images.push(assetData['transcript_esp'].includes('http') ? assetData['transcript_esp'] : `https://ipfs.hivebp.io/ipfs/${assetData['transcript_esp']}`);

        if (Object.keys(assetData).includes('transcript_eng'))
            images.push(assetData['transcript_eng'].includes('http') ? assetData['transcript_eng'] : `https://ipfs.hivebp.io/ipfs/${assetData['transcript_eng']}`);
    }

    const assetCount = total ? total : count;

    const nextImage = () => {
        setImagePosition(imagePosition === images.length - 1 ? 0 : imagePosition + 1)
    };

    const prevImage = () => {
        setImagePosition(imagePosition === 0 ? images.length - 1 : imagePosition - 1)
    };

    const page = (
        <Page
            id="PackPage"
            title={title}
            description={description}
            image={preview}
        >
            {isLoading ? <LoadingIndicator/> :
            <div className={cn(
                'w-full h-auto flex flex-col lg:flex-row',
                'justify-center items-center'
            )}>
                <div className="AssetImage">
                    {imagePosition === 0 && firstIsVideo ? (
                        <video width="400" height="400" controls>
                            <source src={images[imagePosition]} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={images[imagePosition]} alt="none" onClick={imagePosition === 0 && firstIsVideo ? () => {} : toggleImage} />
                     )}
                    <div className="ImageButtons">
                        {images.length > 1 ? (<div className="AssetNextButtons" onClick={prevImage}>‹</div>) : ''}
                        {images.length > 1 ? (<div className="AssetNextButtons" onClick={nextImage}>›</div>) : ''}
                    </div>
                </div>
                Under Construction - Page coming soon!
                <PackDetails
                    asset={asset}
                    assetId={assetId}
                    
                    newOwner={newOwner}
                    assetCount={assetCount}
                    burnedCount={burned}
                />
            </div> }
            {sales && <div>
                {sales.map(sale => (
                    <Link href={`/sale/${assetId}${sale['listing_id'] ? `?listing_id=${sale['listing_id']}` : ''}`}>
                        <div>{t('asset.this_asset_is_for_sale')}</div>
                    </Link>
                ))}
            </div>
            }
            <div className="w-auto h-40 relative text-center top-4">
                <MarketButtons
                    ual={props['ual']}
                    asset={asset}
                    newOwner={newOwner}
                    setNewOwner={setNewOwner}
                    
                    view={'full'}
                />
            </div>
        </Page>
    );

    if (showImage) {
        return (<div>
            {showImage ? <FullImageView
                image={images[imagePosition]}
                toggleFunc={toggleImage}
            /> : ''}
            {page}
        </div>)
    } else {
        return page;
    }
};

PackPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');
    const symbol = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const miniPack = await get("pack-minimal/" + symbol);

    const values = qs.parse(paths[2].replace(`${symbol}?`, ''));
    values['miniPack'] = miniPack;

    return values;
};

export default PackPage;
