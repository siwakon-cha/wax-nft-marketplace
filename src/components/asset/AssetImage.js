import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import cn from "classnames";
import Icon from '../common/util/input/Icon'

const AssetImage = (props) => {
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [imagePosition, setImagePosition] = useState(0);
    const [modelViewer, setModelViewer] = useState(null);
    const [videoPlayer, setVideoPlayer] = useState(null);

    const asset = props['asset'];
    const toggleImage = props['toggleImage'];
    const setDisplayImage = props['setDisplayImage'];

    const {image, backimg, mdata, assetId} = asset ? asset :
        {standard: null, image: null, backimg: null, total: null, mdata: null, transactions: null};

    const assetData = mdata ? JSON.parse(mdata) : null;

    let video = '';
    let audio = '';
    let model = '';
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
        if (assetData && Object.keys(assetData).includes('3dimg')) {
            model = assetData['3dimg'].includes('http') ? assetData['3dimg'] : `https://ipfs.hivebp.io/ipfs/${assetData['3dimg']}`;
        }
    } else if (assetData && Object.keys(assetData).includes('media')) {
        video = assetData['media'].includes('http') ? assetData['media'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    } else if (assetData && Object.keys(assetData).includes('3dimg')) {
        model = assetData['3dimg'].includes('http') ? assetData['3dimg'] : `https://ipfs.hivebp.io/ipfs/${assetData['3dimg']}`;
    } else if (assetData && Object.keys(assetData).includes('3d')) {
        model = assetData['3d'].includes('http') ? assetData['3d'] : `https://ipfs.hivebp.io/ipfs/${assetData['3d']}`;
    } else if (assetData && Object.keys(assetData).includes('model')) {
        model = assetData['model'].includes('http') ? assetData['model'] : `https://ipfs.hivebp.io/ipfs/${assetData['model']}`;
    }

    if (assetData && Object.keys(assetData).includes('audio')) {
        audio = assetData['audio'].includes('http') ? assetData['audio'] : `https://ipfs.hivebp.io/ipfs/${assetData['audio']}`;
    }

    const images = [];
    const imageFormats = [];

    if (video) {
        images.push(video);
        imageFormats.push('video');
    }

    if (image && !image.includes('video:')) {
        images.push(image);

        imageFormats.push('image');
    }

    if (model) {
        images.push(image);
        imageFormats.push('model');
    }

    if (audio) {
        images.push(audio);
        imageFormats.push('video');
    }

    if (backimg) {
        images.push(backimg);
        imageFormats.push('image');
    }

    if (assetData) {
        if (Object.keys(assetData).includes('img2')) {
            images.push(assetData['img2'].includes('http') ? assetData['img2'] : `https://ipfs.hivebp.io/ipfs/${assetData['img2']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('img3')) {
            images.push(assetData['img3'].includes('http') ? assetData['img3'] : `https://ipfs.hivebp.io/ipfs/${assetData['img3']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('img4')) {
            images.push(assetData['img4'].includes('http') ? assetData['img4'] : `https://ipfs.hivebp.io/ipfs/${assetData['img4']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('Image 2')) {
            images.push(assetData['Image 2'].includes('http') ? assetData['Image 2'] : `https://ipfs.hivebp.io/ipfs/${assetData['Image 2']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('Image 3')) {
            images.push(assetData['Image 3'].includes('http') ? assetData['Image 3'] : `https://ipfs.hivebp.io/ipfs/${assetData['Image 3']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('Video')) {
            images.push(assetData['Video'].includes('http') ? assetData['Video'] : `https://ipfs.hivebp.io/ipfs/${assetData['Video']}`);
            imageFormats.push('video');
        }

        if (Object.keys(assetData).includes('Video 1')) {
            images.push(assetData['Video 1'].includes('http') ? assetData['Video 1'] : `https://ipfs.hivebp.io/ipfs/${assetData['Video 1']}`);
            imageFormats.push('video');
        }

        if (Object.keys(assetData).includes('Video2')) {
            images.push(assetData['Video2'].includes('http') ? assetData['Video2'] : `https://ipfs.hivebp.io/ipfs/${assetData['Video2']}`);
            imageFormats.push('video');
        }

        if (Object.keys(assetData).includes('hi_res_boxed')) {
            images.push(assetData['unboxed_img'].includes('http') ? assetData['unboxed_img'] : `https://ipfs.hivebp.io/ipfs/${assetData['unboxed_img']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('hi_res_boxed')) {
            images.push(assetData['hi_res_boxed'].includes('http') ? assetData['hi_res_boxed'] : `https://ipfs.hivebp.io/ipfs/${assetData['hi_res_boxed']}`);
            imageFormats.push('video');
        }

        if (Object.keys(assetData).includes('hi_res_unboxed')) {
            images.push(assetData['hi_res_unboxed'].includes('http') ? assetData['hi_res_unboxed'] : `https://ipfs.hivebp.io/ipfs/${assetData['hi_res_unboxed']}`);
            imageFormats.push('video');
        }

        if (Object.keys(assetData).includes('transcript_esp')) {
            images.push(assetData['transcript_esp'].includes('http') ? assetData['transcript_esp'] : `https://ipfs.hivebp.io/ipfs/${assetData['transcript_esp']}`);
            imageFormats.push('image');
        }

        if (Object.keys(assetData).includes('transcript_eng')) {
            images.push(assetData['transcript_eng'].includes('http') ? assetData['transcript_eng'] : `https://ipfs.hivebp.io/ipfs/${assetData['transcript_eng']}`);
            imageFormats.push('image');
        }
    }

    const getViewer = async () => {
        let viewer = '';
        const src = model;
        const poster = image;
        if (process.browser)
            viewer = await import('@google/model-viewer').then(() => {
                const element = (
                    <model-viewer
                        src={src}
                        ar={true}
                        loading="lazy"
                        camera-controls={true}
                        poster={poster}
                        autoplay={true}
                    />
                );

                setModelViewer(element);
            });

        return viewer;
    };

    useEffect(() => {
        if (imagePosition >= images.length) {
            setImagePosition(0);
        }
        if (!modelViewer && model && image) {
            getViewer();
        }
        if (imageFormats[imagePosition] === 'video') {
            setVideoPlayer(
                <video 
                    width="400" 
                    height="400" 
                    loop controls autoPlay={true} muted={true} 
                    poster={image ? image : backimg} 
                    className={cn('m-auto max-h-168')}>
                    <source src={images[imagePosition]} />
                    Your browser does not support the video tag.
                </video>
            );
        }
    }, [assetId, imagePosition, image]);

    return (
        <div className={cn(
            'relative w-full p-8'
        )}>
            {imageFormats[imagePosition] === 'video' && videoPlayer ? videoPlayer
            : imageFormats[imagePosition] === 'model' && process.browser && modelViewer ?
                modelViewer : (
                <img
                    src={images[imagePosition]} alt="none" onClick={imageFormats[imagePosition] !== 'image' ? () => {} : toggleImage}
                    className={cn(
                        'm-auto max-h-168'
                    )}
                />
            )}
            <div className={cn('relative mt-8 top-auto w-full p-8 flex justify-evenly')}>
                {
                    images.map((image, index) =>
                        images.length > 1 ? (<div className={cn(
                            'w-7 h-7 text-2xl text-white',
                            'cursor-pointer bg-transparent border-none outline-none',
                        )} 
                        onClick={
                            () => {setImagePosition(index); setDisplayImage(images[index]);}}
                        >
                            <Icon>
                                <img
                                    className={"w-5 h-5"}
                                    src={ index === imagePosition ? "/radio-button-on.svg" : "/radio-button-off.svg"}
                                />
                            </Icon>                            
                        </div>) : ''
                    )
                }
            </div>
        </div>
    );
};

export default AssetImage;
