import React, {useEffect, useState, Suspense} from 'react';
import {Img} from 'react-image';
import LazyLoad from 'react-lazy-load';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

import cn from "classnames";

function SwappableImage(props) {
    const image = props['image'];
    const prevImg = props['prevImg'];
    const backImg = props['backImg'];

    const [displayImage, setDisplayImage] = useState(prevImg ? prevImg : image);

    useEffect(() => {
        if (!displayImage)
            setDisplayImage(prevImg ? prevImg : image);
    }, [displayImage, prevImg, image]);

    useEffect(() => {
        setDisplayImage(prevImg ? prevImg : image);
    }, [image, prevImg]);

    const PreLoader = () => {
        return (
            <div className={cn('my-auto')}>
                <LoadingIndicator />
            </div>
        )
    }

    const FrontImage = () => {
        return (
            <Img
                src={displayImage}
                loader={<PreLoader />}
                className={cn(
                    'max-w-48 max-h-48 m-auto'
                )}
            />
        )
    };

    const BackImage = () => {
        return (
            <div className={cn(
                'bg-transparent max-w-48 max-h-48 m-2 p-1000'
            )}>
                <div className={cn(
                    'relative w-full h-full text-center flip-transform hover:flip-transform-rotate'
                )}>
                    <div className={cn(
                        'absolute w-full h-full bv-hidden'
                    )}>
                        <Img
                            src={displayImage}
                            loader={<PreLoader />}
                            className={cn(
                                'max-w-44 max-h-44 m-auto'
                            )}
                        />
                    </div>
                    <div className="flip-card-back">
                        <Img
                            src={backImg}
                            className={cn(
                                'max-w-44 max-h-44 m-auto'
                            )}
                            loader={<PreLoader />}
                        />
                    </div>
                </div>
            </div>
        )
    };

    return (
        <LazyLoad>
            <FrontImage />
        </LazyLoad>
    );
}

export default SwappableImage;
