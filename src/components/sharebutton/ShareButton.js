import SharePopup from "../popups/SharePopup";
import React, {useState} from "react";
import {formatNumber} from "../helpers/FormatLinks";
import cn from "classnames";


function ShareButton(props) {
    const link = props['link'];
    const type = props['type'];

    const [showPopup, setShowPopup] = useState(false);

    const share = async (show) => {
        setShowPopup(show);
    };

    return type === 'asset' ? (
        <div>
            <div className={cn(
                'flex justify-start w-24 transition delay-200 width',
                'h-4 rounded text-white cursor-pointer outline-none',
                'text-xs font-bold my-2'
            )} onClick={() => share(true)}>
                <div className={cn('w-4 h-4 mx-2')}>
                    <img className={cn('w-4 h-4')} src="/share-outline.svg" alt="share"/>
                </div>
                <div>Share</div>
            </div>
            {showPopup ? <SharePopup link={link} callBack={share}/> : '' }
        </div>
    ) : (
        <div className={cn(
            'flex justify-start w-24 transition delay-200 width',
            'h-4 rounded text-white cursor-pointer outline-none',
            'text-xs font-bold my-2'
        )} onClick={() => share(true)}>
            <div className={cn('w-4 h-4 mx-2')}>
                <img src="/share-outline.svg" alt="share"/>
            </div>
            <div>{showPopup ? <SharePopup link={link} callBack={share}/> : '' }</div>
        </div>
    );
}

export default ShareButton;
