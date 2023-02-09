import React from 'react';
import cn from "classnames";
import {useTranslation} from "react-i18next";

const ShowMoreOrLessButton = ({ showNum, setShowNum, resultsNum = 20, showLess = false }) => {

    const {t} = useTranslation('common');

    if (!showLess) {
        return(
            <div onClick={() => setShowNum(showNum + resultsNum)} 
                className={cn('my-5 mx-auto text-primary cursor-pointer opacity-70 hover:opacity-100')}>
                {t('analytics.show_more')}
            </div>
        );
    } else {
        return(
            <div onClick={() => setShowNum(resultsNum)} 
                className={cn('mt-5 mx-auto mb-0 cursor-pointer opacity-70 hover:opacity-100')}>
                {t('analytics.show_less')}
            </div>
        );
    }

}

export default ShowMoreOrLessButton;