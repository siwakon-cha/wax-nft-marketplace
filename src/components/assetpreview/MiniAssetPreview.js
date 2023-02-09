import React, {useEffect} from 'react';

import SwappableImage from "../swappableimage";
import {
    formatMintInfo
} from "../helpers/FormatLinks";

import Link from "next/link";
import {useTranslation} from "react-i18next";
import cn from "classnames";

function MiniAssetPreview(props) {
    const asset = props['asset'] && props['asset']['asset'] ? props['asset']['asset'] : props['asset'];

    const {t} = useTranslation('common');

    const {
        aAssetId, category, author, name, image, previmg, backimg, mint, total,
        standard, burned, authorThumbnail, verified, mdata
    } = asset;

    let { assetId, authorImg } = asset;

    useEffect(() => {

    }, []);

    if (!authorImg) {
        authorImg = 'https://ipfs.hivebp.io/ipfs/QmVVE5aLtq4EtMe4Khev5CSic3AKqX2RuNTAB79thvpqQW';
    }

    if (standard && standard === 'atomicassets')
        assetId = aAssetId;

    let mintInfo = formatMintInfo(mint, total, burned, t);

    const assetData = mdata ? JSON.parse(mdata) : null;

    let video = '';
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    }

    if (image && image.includes('video:')) {
        video = `https://ipfs.hivebp.io/ipfs/${image.replace('video:', '')}`;
    }

    return (
        <div className={"MiniAssetPreview"}>
            <div className={'MiniAssetPreviewAuthor NextLink'}>
                <div className="AuthorIcon">
                    <img src={authorThumbnail ? authorThumbnail : authorImg} />
                </div>
                <div className={`AuthorTitle ${verified ? 'Verified' : ''}`}>{author}</div>
                {verified ?
                <div className="VerifiedIcons">
                    <img src={"/verified.svg"} />
                </div> : ''}
            </div>
            <div className={cn(
                'w-full flex flex-wrap justify-center'
            )}>
                <div className={cn(
                    'w-24 h-24 m-2'
                )}>
                    { video ?
                        <video width="80" height="80" loop autoPlay={true} muted={true} playsInline={true} poster={image && !image.includes('video:') ? image : backimg}>
                            <source src={video} />
                            Your browser does not support the video tag.
                        </video> :
                        <img className={cn('m-auto')} src={image} /> }
                </div>
                {mintInfo}
                <div className={name && name.length >= 20 ? "MiniAssetPreviewTitle Small" : "MiniAssetPreviewTitle"}>
                    <Link href={'/asset/' + assetId}>
                        <div className='NextLink'>{name ? name : assetId}</div>
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default MiniAssetPreview;
