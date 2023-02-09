import React, {useEffect, useState} from 'react';

import Link from 'next/link';
import VideoElement from "../videoelement/VideoElement";
import cn from "classnames";
import {useTranslation} from "react-i18next";

function SetPreview(props) {
    const setItem = props['set'];

    const {
        setId,
        author,
        authorName,
        authorImage,
        category,
        variant,
        rarity,
        image1,
        image2,
        image3,
        image4,
        thumbnail1,
        thumbnail2,
        thumbnail3,
        thumbnail4,
    } = setItem;

    const img1 = thumbnail1 ? thumbnail1 : image1;
    const img2 = thumbnail2 ? thumbnail2 : image2;
    const img3 = thumbnail3 ? thumbnail3 : image3;
    const img4 = thumbnail4 ? thumbnail4 : image4;

    const video1 = img1 && image1.includes('video:') ? img1 : null;
    const video2 = img2 && image2.includes('video:') ? img2 : null;
    const video3 = img3 && image3.includes('video:') ? img3 : null;
    const video4 = img4 && image4.includes('video:') ? img4 : null;

    const {t} = useTranslation('common');

    useEffect(() => {

    }, []);

    return (
            <div className={cn(
                'text-center block text-sm break-words',
                'm-4 p-1 w-80 rounded-md bg-paper',
                'rounded-2xl backdrop-filter backdrop-blur-sm'
            )}>
                <Link href={`/sets/${author}`}>
                    <div className={'AssetPreviewAuthor NextLink'}>
                        { authorImage ? <div className="AuthorNameIcon">
                            <img src={authorImage} />
                        </div> : '' }
                        <div className={`AuthorTitle Verified`}>{authorName}</div>
                    </div>
                </Link>
                <div className={cn(
                    'w-72 flex flex-wrap m-auto'
                )}>
                    <div className={cn(
                        'w-72 grid grid-cols-2 gap-4'
                    )}>
                        <div className={cn(
                            'h-48'
                        )}>
                            { video1 ? <VideoElement
                                width="125"
                                height="250"
                                video={video1}
                                backimg={authorImage}
                                index={video1}
                                timeout={500}
                            /> : <img className={cn(
                                'max-w-36 max-h-40 m-auto'
                            )} src={thumbnail1 ? thumbnail1 : image1} /> }
                        </div>
                        <div className={cn(
                            'h-48'
                        )}>
                            { video2 ? <VideoElement
                                width="125"
                                height="250"
                                video={video2}
                                index={video2}
                                backimg={authorImage}
                                timeout={500}
                            /> : <img className={cn(
                                'max-w-36 max-h-40 m-auto'
                            )} src={thumbnail2 ? thumbnail2 : image2} /> }
                        </div>
                        <div className={cn(
                            'h-48'
                        )}>
                            { video3 ? <VideoElement
                                width="125"
                                height="250"
                                video={video3}
                                index={video3}
                                backimg={authorImage}
                                timeout={500}
                            /> : <img className={cn(
                                'max-w-36 max-h-40 m-auto'
                            )} src={thumbnail3 ? thumbnail3 : image3} /> }
                        </div>
                        <div className={cn(
                            'h-48'
                        )}>
                            { video4 ? <VideoElement
                                width="125"
                                height="250"
                                video={video4}
                                index={video4}
                                backimg={authorImage}
                                timeout={500}
                            /> : <img className={cn(
                                'max-w-36 max-h-40 m-auto'
                            )} src={thumbnail4 ? thumbnail4 : image4} /> }
                        </div>
                    </div>
                </div>
                <Link href={`/sets/${author}?category=${category ? category : ''}&variant=${variant ? variant : ''}&rarity=${rarity ? rarity : ''}`}>
                    <div className={"SetLink"}>
                        {t('collection.check_out_set')}
                    </div>
                </Link>
            </div>
    );
}

export default SetPreview;
