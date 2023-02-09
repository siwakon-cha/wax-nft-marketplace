import React from "react";

const SetHeaderInfo = ({title, value}) => {
    return (
        <div className="block w-auto pt-2 text-sm text-neutral h-14 text-center">
            <div className={'h-1/2 text-neutral text-center'}>{title}</div>
            <div className={'h-1/2 text-primary text-center break-words'}>{value}</div>
        </div>
    )
};

export default SetHeaderInfo;