import React, {useContext, useEffect} from 'react';
import {Context} from "../waxplorer";
import { useRouter } from 'next/router'
import cn from "classnames";

const BackgroundImage = () => {
    const [ state, dispatch ] = useContext(Context);
    const router = useRouter();

    const image = state.background_image;
    const location = router.route;

    useEffect(() => {
    }, [image, location]);

    if (image && (location === '/asset/[assetId]' || location === '/listing/[assetId]' || location === '/sale/[assetId]' || location === '/template/[templateId]'))
        return (
            <div className="BackgroundImage" style={{'background-image': `url(${image})`}}>
            </div>
        );
    else {
        return '';
    }
};

export default BackgroundImage;
