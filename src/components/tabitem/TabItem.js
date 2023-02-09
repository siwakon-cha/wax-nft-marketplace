import React from "react";
import cn from "classnames";

function TabItem(props) {
    const {title, tabKey, target} = props;

    const active = tabKey === target;

    return (
        <div className={cn(
            'flex h-12 overflow-hidden',
            {'': active}
        )}>
            <img className={cn(
                'opacity-75 h-6 w-6 m-auto',
                {'opacity-100': active}
                )} src={active ? "/radio-button-on.svg" : "/radio-button-off.svg"}
            />
            <div className={'m-auto'}>{title}</div>
        </div>
    );
}

export default TabItem;
