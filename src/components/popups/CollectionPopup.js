import React from 'react';
import cn from "classnames";

function CollectionPopup(props) {
    const asset = props['asset'];
    const closeCallBack = props['closeCallBack'];

    return (
        <div className={cn(
            'left-0 w-full h-screen backdrop-blur-xl z-70'
        )} onClick={closeCallBack}>
            <img className={cn(
                'max-h-full max-w-full m-auto'
            )} src={asset.fullImage} alt="none" />
        </div>
    );
}

export default CollectionPopup;
