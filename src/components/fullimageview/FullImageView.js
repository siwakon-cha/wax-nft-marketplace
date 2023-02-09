import React from "react";
import cn from "classnames";

const FullImageView = ({toggleFunc, image}) => {
    if (image.includes('video')) {
        image = image.substr(6);
        const imgUrl = image.includes('http') ? image : `https://ipfs.hivebp.io/ipfs/${image}`
        return (
            <div className={cn(
                'fixed w-screen h-screen z-100 m-auto top-0 left-0 backdrop-filter backdrop-blur-xl'
            )} onClick={toggleFunc}>
                <div className={'w-full h-full m-auto'}>
                    <video 
                    loop controls autoPlay={true} muted={true} 
                    poster={image}
                    className={cn('m-auto w-auto h-auto')}>
                        <source src={imgUrl} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        );
    } else {
        return (
            <div className={cn(
                'fixed w-screen h-screen z-100 m-auto top-0 left-0 backdrop-filter backdrop-blur-xl'
            )} onClick={toggleFunc}>
                <div className={'w-full h-full m-auto'}>
                    <img  className={'max-h-full max-w-full m-auto'} src={image} />
                </div>
            </div>
        );
    }

}

export default FullImageView;