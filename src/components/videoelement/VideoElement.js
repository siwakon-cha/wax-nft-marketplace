import React, {useEffect} from 'react';
import LazyLoad from "react-lazy-load";
import cn from "classnames";

function VideoElement(props) {

    const video = props['video'].includes('video:') ? 'https://ipfs.hivebp.io/ipfs/' + props['video'].replace('video:', '') : props['video'];

    const index = props['index'];
    const image = props['image'];
    const backimg = props['backimg'];
    const width = props['width'];
    const height = props['height'];
    const timeout = props['timeout'] ? props['timeout'] : 2000;

    useEffect(() => {
        if (video) {
            setTimeout(function () {
                const element = document.getElementById('video'+index );
                if (element) {
                    element.pause();
                }
            }, timeout);
        }
    }, [video]);

    const playVideo = (id) => {
        const element = document.getElementById(id);
        element.play();
    };

    const pauseVideo = (id) => {
        const element = document.getElementById(id);
        element.pause();
    };

    return (
        <LazyLoad height={height} offsetTop={100} >
            <div className={cn('flex h-full content-center')}>
                <video
                    onMouseLeave={() => pauseVideo('video'+index)}
                    onMouseEnter={() => playVideo('video'+index)}
                    id={'video'+index}
                    className={'m-auto'}
                    loop
                    autoPlay={true}
                    muted={true}
                    playsInline={true}
                    poster={image && !image.includes('video:') ? image : backimg}
                >
                    <source src={video} />
                    Your browser does not support the video tag.
                </video>
            </div>
        </LazyLoad>
    );

}

export default VideoElement;
