import cn from "classnames";
import React, {useEffect, useState} from "react";

const FilterElement = ({title, children, cleared=false, active=false}) => {
    const [show, setShow] = useState(active);

    useEffect(() => {
        if (cleared) {
            setShow(false);
        }
    }, [cleared])

    const toggleShow = () => {
        setShow(!show);
    };

    return (
        <div className={cn('')}>
            <div className={cn(
                'flex w-full text-neutral rounded-xl',
                'justify-evenly my-2 p-2 hover:bg-bluet',
                'cursor-pointer transition transition-colors duration-500'
            )} onClick={toggleShow}>
                <div className={cn(
                'text-left w-5/6'
                )}>
                    {title}
                </div>
                <div className={cn(
                    'w-1/6 w-4 h-4 my-auto ml-auto text-right'
                )}>
                    <img className={'ml-auto text-right'} src={show ? '/minus2.svg' : '/plus2.svg'} />
                </div>
            </div>
            {show ? children : ''}
        </div>
    )
};

export default FilterElement;