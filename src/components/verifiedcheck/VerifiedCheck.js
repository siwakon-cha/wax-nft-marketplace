import cn from "classnames";
import React from "react";
import {useTranslation} from "react-i18next";

const VerifiedCheck = ({onCheckVerified, searchVerified}) => {
    const {t} = useTranslation('common');

    return (
        <div className={cn(
                'w-full h-6 flex justify-start my-2'
            )}>
            <div className={cn(
                'mt-auto justify-center flex cursor-pointer text-neutral opacity-80 hover:opacity-100'
            )}
                 onClick={onCheckVerified}
            >
                <div className={'w-6 h-6'}>
                {
                    searchVerified ?
                        <img className={cn(
                            'm-0.5'
                        )} src="/checkmark-square-2-outline.svg" alt="fav"/> :
                        <img className={cn(
                            'm-0.5'
                        )} src="/square-outline.svg" alt="fav"/>
                }
                </div>
                <div>{t('search.verified_only')}</div>
            </div>
        </div>
    )
}

export default VerifiedCheck;