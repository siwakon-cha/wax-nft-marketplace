import React, {useContext, useState} from 'react';
import Notifications from '../notifications/Notifications';

import {useTranslation} from "react-i18next";

import SearchBar from "../searchitems/SearchBar";
import SideNavigation from "./SideNavigation";
import Link from 'next/link';
import cn from "classnames";
import NavItem from "./navitem/NavItem";

const Navigation = React.memo(props => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const {t} = useTranslation('common');
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;

    const [showSideNavigation, setShowSideNavigation] = useState(false);

    const toggleSideNavigation = (show) => {
        setShowSideNavigation(!showSideNavigation);
    };

    const performLogin = async () => {
        ual.showModal();
    };

    return (
        <div className={cn(
            'relative h-36 md:h-24 mx-auto z-50 flex justify-between flex-nowrap'
        )}>
            <div className={cn(
                'w-full block md:flex justify-between flex-cols px-8'
            )}>
                <Link href={'/'}>
                    <div className={cn(
                        'relative h-24 flex cursor-pointer w-full'
                    )}>
                        <img
                            src="/nfthive-logo.svg"
                            alt="NFTHive on WAX"
                            className={cn(
                                'relative h-12 my-auto'
                            )}
                        />
                    </div>
                </Link>
                <div
                    className={cn(
                        'flex flex-cols'
                    )}
                >
                    <NavItem link={'/explorer'} text={t('navigation.explorer')} />
                    <NavItem link={'/sets'} text={t('navigation.sets')} />
                    <NavItem link={'/market?refresh=true'} text={t('search.market')} />

                    <SearchBar/>

                    {
                        userName ?
                        <Notifications ual={ual} />
                        :
                        <div className={cn('my-auto mx-5 cursor-pointer')} onClick={performLogin}>
                            <div className={cn('relative m-auto')}>
                                <img className={cn('w-6 h-6 m-auto')} src="/person-outline.svg" alt="Login" title={t('navigation.login')} />
                            </div>
                            <div className={cn('relative w-full text-m text-neutral')}>{t('navigation.login')}</div>
                        </div>
                    }

                    <div className={cn('absolute w-6 h-6 md:w-8 md:h-8 md:relative top-8 md:top-0 right-8 md:right-0 my-auto')}>
                        <div onClick={() => toggleSideNavigation(true)} id={"SideMenuButton"}>
                            <img className={cn('w-6 h-6')} src="/menu.svg" alt={t('navigation.menu')} title={t('navigation.menu')} id={"SideMenuIcon"}/>
                        </div>
                    </div>
                </div>
            </div>

            <SideNavigation {...props} showSideNavigation={showSideNavigation} toggleSideNavigation={toggleSideNavigation} />
        </div>
    );
});

export default Navigation;
