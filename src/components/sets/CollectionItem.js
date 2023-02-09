import React, {useContext, useEffect, useState} from 'react';

import {
    formatNumberS,
    getAttributeName,
    getAuthorLink,
    getColorName,
    getTypeName,
    getVariantName,
    getRarityName,
    getBorderName,
    openSearchPopup
} from "../helpers/FormatLinks";

import LazyLoad from 'react-lazy-load'
import {Context} from "../waxplorer";
import VideoElement from "../videoelement/VideoElement";
import {useTranslation} from "react-i18next";
import cn from "classnames";

function CollectionItem(props) {
    const asset = props['asset'];
    const index = props['index'];
    const zoom = props['zoom'];
    const showStats = props['showStats'];
    const refresh = props['refresh'];

    const {owner, name, image, assets, fullImage, lowest, thumbnail} = asset;

    const [ state, dispatch ] = useContext(Context);

    const [displayImg, setDisplayImg] = useState(zoom <= 4 ? (thumbnail ? thumbnail : image) : fullImage);

    const replaceImage = () => {
        if (displayImg !== fullImage) {
            setDisplayImg(fullImage);
        }
    };

    useEffect(() => {
    }, [displayImg]);

    const openAsset = () => {
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: null });
        dispatch({ type: 'SET_ACTION', payload: 'view' });
    };

    const showInformation = () => {
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: null });
        dispatch({ type: 'SET_ACTION', payload: 'setitem' });
    }

    const assetCopy = asset;
    assetCopy['onwer'] = owner;

    return (
        <div className={cn(
            'relative left-0 top-0 flex w-auto h-auto m-auto'
        )}>
            <div
                className={cn(
                    'm-auto cursor-pointer transition transition-all px-5 pt-10 pb-10',
                    {'filter grayscale-0 brightness-100 sepia-0 hue-rotate-0 saturate-100 contrast-100': owner},
                    {'filter grayscale hover:grayscale-0 brightness-75 hover:brightness-100': lowest && !owner},
                    {'RedFilter':
                            !lowest && !owner
                    })}
            >
                {showStats ? <div
                    className={'text-neutral w-full flex justify-right mb-5'}
                    onClick={showInformation}
                >
                    <div className={'relative w-full left-3'}>{name}</div>
                    <div className={'w-6 h-6 p-1 ml-auto mr-0'}>
                        <img src={'/question-mark-circle-outline.svg'} alt={'?'}/>
                    </div>
                </div> : '' }
                <div
                    onClick={!owner ? () => openSearchPopup('sales', asset, dispatch, refresh) : () => {}}
                >
                { displayImg && (image.includes('video:')) ?
                    <VideoElement

                        video={displayImg.includes('video:') ? displayImg.replace('video:', 'https://ipfs.hivebp.io/ipfs/') : displayImg}
                        index={index}
                    /> :
                    <div className="CollectionImage" id={"CollectionImage"+index}>
                        <img onClick={owner ? openAsset : () => {}}  src={displayImg} onError={replaceImage} />
                    </div>
                }
                </div>
            </div>
        </div>
    );
}

export default CollectionItem;
