import React, {useEffect, useState} from 'react';

import moment from 'moment';

import MarketButtons from '../marketbuttons'
import get from "../helpers/Api";
import SwappableImage from "../swappableimage";
import {
    formatMintInfo
} from "../helpers/FormatLinks";
import PreviewDetailsTable from "./PreviewDetailsTable";
import Link from 'next/link';
import MoreOptions from "./MoreOptions";
import {useTranslation} from "react-i18next";

function TemplatePreview(props) {
    const template = props['template'];

    const index = props['index'];
    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const [showMenu, setShowMenu] = useState(false);
    const [favored, setFavored] = useState(template['isFavorited']);

    const [frontVisible, setFrontVisible] = useState(true);

    const [priceInfo, setPriceInfo] = useState(null);

    const {
        templateId,
        author,
        category,
        idata,
        verified
    } = template;

    let {
        authorImg,
        authorThumbnail
    } = template;

    const assetData = idata ? JSON.parse(idata) : null;

    let video = '';
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    }

    let name = template['name'];

    if (!name) {
        name = assetData['name'];
    }

    let image = template['image'];

    if (!image) {
        image = `https://ipfs.hivebp.io/ipfs/${assetData['img'] ? assetData['img'] : assetData['image']}`;
    }

    const favor = () => {
        setFavored(true);
        var encodedString = window.btoa( activeUser['accountName'] );

        get(`favor-template/${templateId}?key=${encodedString}`);
    };

    const unfavor = () => {
        setFavored(false);
        var encodedString = window.btoa( activeUser['accountName'] );
        get(`unfavor-template/${templateId}?key=${encodedString}`);
    };

    if (!authorImg && verified) {
        authorImg = 'https://ipfs.hivebp.io/ipfs/QmVVE5aLtq4EtMe4Khev5CSic3AKqX2RuNTAB79thvpqQW'
    } else if (!verified && authorImg) {
        authorImg = null;
    }

    const getPriceInfo = async () => {
        if (!priceInfo) {
            //const pInfo = await get('price-template-info/' + templateId);

            //setPriceInfo(pInfo);
        }
    };

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    const loadBack = () => {
        setFrontVisible(false);
        getPriceInfo();
    };

    return (
        <div className={`AssetPreview`} id={'AssetPreview_'+index}>
            <MoreOptions
                setShowMenu={setShowMenu}
                asset={template}
                ual={props['ual']}
            />
            <div onClick={toggleShowMenu} className={`MoreButton ${showMenu ? 'Show' : 'Hide'}`}>
                <img src="/more.svg" />
            </div>
            <div onClick={favored ? unfavor : favor} className="FavorButton">
                <img src={favored ? "/bookmark.svg" : "/bookmark-outline.svg"} alt={t('search.favorites')} />
            </div>
            <Link href={'/collection/' + author}>
                <div className={'AssetPreviewAuthor NextLink'}>
                    { authorImg ? <div className="AuthorIcon">
                        <img src={authorThumbnail ? authorThumbnail : authorImg} />
                    </div> : '' }
                    <div className={`AuthorTitle ${verified ? 'Verified' : ''}`}>{author}</div>
                    {verified ?
                    <div className="VerifiedIcons">
                        <img src={"/verified.svg"} />
                    </div> : ''}
                </div>
            </Link>
            <Link href={'/template/' + templateId}>
                <div className={frontVisible ? "AssetArea NextLink Show" : "AssetArea NextLink Hidden"}>
                    <div className={"AssetPreviewImage"}>
                        <div className="AssetPreviewImage">
                        { video ?
                                <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={image && !image.includes('video:') ? image : image}>
                                    <source src={video} />
                                    Your browser does not support the video tag.
                                </video> : image ?
                                <SwappableImage
                                    author = {author}
                                    image = {image}
                                    prevImg={image}
                                    backImg = {null}
                                    category = {category}
                                /> : '' }
                        </div>
                    </div>
                    <div className={name && name.length >= 20 ? "AssetPreviewTitle Small" : "AssetPreviewTitle"}>
                        <div>{name ? name : templateId}</div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default TemplatePreview;
