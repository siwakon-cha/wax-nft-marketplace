import cn from "classnames";
import React from "react";

const Popup = ({children, cancel, title}) => {
    return (
        <div className={cn(
            'relative z-40 w-11/12 md:w-4/5 justify-center h-auto max-h-4/5 lg:w-1/2 shadow-xl',
            'backdrop-blur-xl text-xs md:text-sm text-neutral p-4 md:p-8 overflow-y-auto',
            'bg-paperd rounded-sm md:rounded-2xl m-auto top-10 lg:top-1/4 InsideScroll'
        )}>
            <img
                className={cn('absolute top-4 md:top-8 right-4 md:right-8 cursor-pointer z-50')}
                onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="PopupTitle">{title}</div>
            {children}
        </div>
    );
};

export default Popup;