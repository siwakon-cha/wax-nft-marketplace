import cn from "classnames";
import React, {useEffect} from "react";

const SelectionField = ({options, onChange, value}) => {
    const numOptions = options.length;

    useEffect(() => {}, [numOptions]);

    return (
        <div className={cn('relative')}>
            <div className={cn('flex flex-wrap justify-left')}>
                {options.map(option => <div onClick={() => onChange(option)} className={cn(
                    'border px-3 py-1 border-primary m-1 text-sm rounded-2xl hover:bg-primary',
                    'hover:text-black transition transition-colors cursor-pointer text-left',
                    {'text-black bg-primary': value && value.value === option.value}
                )}>
                    {option.label}
                </div>)}
            </div>
        </div>
    );
}

export default SelectionField;