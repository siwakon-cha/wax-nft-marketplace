import React from "react";
import cn from "classnames";

const AssetListHeader = ({ children, className, imgSrc, onClick }) => {
    return (
        <div className={cn('mt-24 ml-24 mb-5 text-4xl text-left text-white flex', className)} onClick={onClick}>
            {children}
            { imgSrc ? 
            <img className={cn('h-7 mt-2 ml-2.5')} src={imgSrc} /> 
            : ''
            }
        </div>
    );
}

export default AssetListHeader;