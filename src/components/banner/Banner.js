import React from 'react';
import {useQuery} from "react-query";
import {get} from "../helpers/Api";
import LoadingIndicator from "../loadingindicator";
import cn from "classnames";

const Banner = (props) => {
    const { isLoading, error, data } = useQuery(`banners`, () => get(`banners`));
    const show = props['show'];

    return show ? (
        <div className={cn(
            'flex justify-center h-44 mx-auto pb-8'
        )}>
            {
                isLoading || !data ? <LoadingIndicator/> :
                <a href={data['url']} target="_blank" className={'opacity-95'}> {
                    Object.keys(data).includes('video') && data['video'] ? <video width="700" height="100" loop autoPlay={true} muted={true} playsInline={true}>
                            <source src={data['video']} />
                            Your browser does not support the video tag.
                        </video>
                        : <img src={data['image']} /> }
                </a>
            }
        </div>
    ) : <div></div>;
};

export default Banner;
