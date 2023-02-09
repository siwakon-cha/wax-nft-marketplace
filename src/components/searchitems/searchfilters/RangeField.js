import Input from "../../common/util/input/Input";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import cn from "classnames";

const RangeField = ({minVal, maxVal, setMin, setMax, applyRange, disabled, useFloat, name}) => {
    const {t} = useTranslation('common');

    const handleMinChange = (e) => {
        const val = e.target.value;
        if ((useFloat && /^\d*\.?\d*$/.test(val)) || (!useFloat && /^\d*$/.test(val))) {
            setMin(val);
        }
    };

    const handleMaxChange = (e) => {
        const val = e.target.value;
        if ((useFloat && /^\d*\.?\d*$/.test(val)) || (!useFloat && /^\d*$/.test(val))) {
            setMax(val);
        }
    };

    return (
        <div className={ cn(
            'flex',
            {'disabled': disabled}
        )}>
            <Input
                type="text"
                name={`min_${name}`}
                className={cn(
                    'h-9 bg-transparent text-sm text-primary outline-none my-auto mx-3',
                    'w-4/12 transition-width border-2 border-primaryt'
                )}
                placeholder={t('search.min')}
                value={minVal ? minVal : ''}
                onChange={handleMinChange}
                disabled={ disabled }
            />
            <span className={cn('my-auto')}>-</span>
            <Input
                type="text"
                name={`max_${name}`}
                className={cn(
                    'h-9 bg-transparent text-sm text-primary outline-none my-auto mx-3',
                    'w-4/12 transition-width border-2 border-primaryt'
                )}
                placeholder={t('search.max')}
                value={maxVal ? maxVal : ''}
                onChange={handleMaxChange}
                disabled={ disabled }
            />
            <button onClick={() => applyRange(minVal, maxVal)} disabled={disabled} className={"w-6 h-7 my-auto mr-3"}>
                <img src="/search.svg" alt="Search" />
            </button>
        </div>
    )
};

export default RangeField;