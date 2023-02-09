import React, {useEffect, useRef, useState} from 'react';

import Link from 'next/link';

import {useTranslation} from "react-i18next";

import { useRouter } from 'next/router'
import {getCookie, setCookie} from "../helpers/cookies";

import LanguagePicker from "./LanguagePicker";
import cn from "classnames";

const SideNavigation = React.memo(props => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const {t, i18n} = useTranslation('common');
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;
    const router = useRouter();

    const showSideNavigation = props['showSideNavigation'];
    const toggleSideNavigation = props['toggleSideNavigation'];

    const location = router.route;
    const isHome = location === '/';
    const isMarket = location === '/market';
    const isExplorer = location === '/explorer';
    const isTrade = location === '/trade';
    const isAccount = location === '/profile' || location === '/wallet' || location === '/inventory';
    const isAnalytics = location === '/stats';
    const isBulk = location === '/bulk';

    const [targetSubNav, setTargetSubNav] = useState('');

    const [showLanguages, setShowLanguages] = useState(false);

    const [showSubNav, setShowSubNav] = useState({
        'market': false,
        'explorer': false,
        'trade': false,
        'bulk': false,
        'account': false
    });

    const performLogin = async () => {
        ual.showModal();
    };

    const performLogout = async () => {
        ual.logout();
    };

    const toggleLanguages = async (show) => {
       setShowLanguages(show)
    };

    useEffect(() => {
    }, [targetSubNav]);

    const toggleSubNav = (target) => {
        Object.keys(showSubNav).map(subNav => {
            if (subNav !== target) {
                showSubNav[subNav] = false;
            } else {
                showSubNav[subNav] = !showSubNav[subNav];
            }
        });
        if (showSubNav[target]) {
            setTargetSubNav(target);
        } else {
            setTargetSubNav('');
        }
        setShowSubNav(showSubNav);
    };

    const getPosition = (target) => {
        let elementNum = 0;
        switch (target) {
            case 'home':
                elementNum = 0;
                break;
            case 'account':
                elementNum = 1;
                break;
            case 'market':
                elementNum = 2;
                break;
            case 'explorer':
                elementNum = 3;
                break;
            case 'bulk':
                elementNum = 4;
                break;
            case 'trade':
                elementNum = 5;
                break;
            default:
                if (isHome) {
                    elementNum = 0;
                } else if (isAccount) {
                    elementNum = 1;
                } else if (isMarket) {
                    elementNum = 2;
                } else if (isExplorer) {
                    elementNum = 3;
                } else if (isBulk) {
                    elementNum = 4;
                } else if (isTrade) {
                    elementNum = 5;
                } else if (isAnalytics) {
                    elementNum = 6;
                }
                break;
        }

        return `${64 + (elementNum - 1) + (48 * elementNum)}px`;
    };

    function useOutsideAlerter(ref, showSideNavigation, callBack) {
      useEffect(() => {
        function handleClickOutside(event) {
          if (showSideNavigation && ref.current && !ref.current.contains(event.target) && (!event.target['id'] || !['SideMenuButton', 'SideMenuIcon'].includes(event.target['id']))) {
              event.preventDefault();
              event.stopPropagation();
              callBack();
          }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [ref, showSideNavigation]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, showSideNavigation, () => toggleSideNavigation(false));

    const indicatorPos = process.browser ? getPosition(targetSubNav) : '64px';

    let defaultOption = 'en';

    const cookie = getCookie('language');
    if (cookie) {
        defaultOption = cookie;
    }

    const onSelect = (lang) => {
        const language = lang;
        i18n.changeLanguage(language);
        setCookie('language', language);
        setShowLanguages(false);
    };

    return (
        <div ref={wrapperRef} className={cn(
            'absolute w-72 left-full h-screen overflow-hidden pb-2 z-70',
            'bg-gradient-to-b from-blueg via-blueg to-browng',
            'transform transition',
            {
                '-translate-x-72': showSideNavigation,
            }
        )}>
            <div className={cn(
                'h-full w-full flex justify-between flex-col',
            )}>
                <div className={cn(
                    'relative h-full w-full pt-16',
                    'overflow-auto cursor-pointer',
                    'text-left overflow-x-hidden',
                )}>
                    <div className={cn(
                        'absolute right-9 top-9',
                    )}>
                        <div onClick={() => toggleSideNavigation(false)} >
                            <img src="/close_btn_y.svg"
                                className={cn(
                                    'h-4 w-4',
                                )} alt="X"
                            />
                        </div>
                    </div>

                    <div className={cn(
                        'absolute h-12 w-1 bg-primary border border-primary rounded-md',
                    )} style={{top: indicatorPos}} />

                    <Link href={`/`}
                        className={cn(
                            'relative',
                            'border-b border-neutral border-opacity-20',
                        )}
                    >
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                        >
                            <div 
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isAccount
                                    }
                                )}
                            >
                                <img src="/home.svg" alt={t('navigation.home')} title={t('navigation.home')} className="block" />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('navigation.home')}</div>
                        </div>
                    </Link>

                    <div className={cn(
                        'relative',
                        'border-b border-neutral border-opacity-20',
                        'bg-opacity-5 hover:bg-blued transition-colors'
                    )} id={"AccountItem"}>
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                            onClick={() => toggleSubNav('account')}
                        >
                            <div 
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isAccount
                                    }
                                )}
                            >
                                <img src="/person-outline.svg" alt="Profile" title={t('navigation.account')} className="block" />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('navigation.account')}</div>
                            <div className="h-5 w-5 ml-auto">
                                <img src={ showSubNav['account'] ? "/minus2.svg" : "/plus2.svg"} className="block text-primary" />
                            </div>
                        </div>

                        { userName ?
                            <div
                                className={cn(
                                    'relative w-full pl-12 ml-1 overflow-hidden mr-auto',
                                    'text-sm text-neutral cursor:pointer transition transition-height duration-500',
                                    {
                                        'h-0': !showSubNav['account'],
                                        'h-84': showSubNav['account']
                                    }
                                )}
                            >
                                <div onClick={() => toggleSideNavigation(false)}><Link href={`/account`} as={`/account`} ><div className="hover:underline mb-2">{t('navigation.account')}</div></Link></div>
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=inventory&owner=${userName}`}><div className="hover:underline mb-2">{t('profile.inventory')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=inventory&search_type=my_packs&owner=${userName}`}><div className="hover:underline mb-2">{t('search.my_packs')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/fts`}><div className="hover:underline mb-2">{t('search.my_fts')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=inventory&search_type=staked&owner=${userName}`}><div className="hover:underline mb-2">{t('search.staked_assets')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=favorites&search_type=favorites&owner=${userName}`}><div className="hover:underline mb-2">{t('search.favorites')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/sets?account=${userName}`}><div className="hover:underline mb-2">{t('profile.my_sets')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=auctions&owner=${userName}&search_type=my_auctions`}><div className="hover:underline mb-2">{t('search.my_auctions')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=sales&owner=${userName}`}><div className="hover:underline mb-2">{t('profile.active_sales')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=bundles&owner=${userName}`}><div className="hover:underline mb-2">{t('profile.active_bundle_sales')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=buys&owner=${userName}`}><div className="hover:underline mb-2">{t('profile.recent_purchases')}</div></Link></div> : ''}
                                {userName ? <div onClick={() => toggleSideNavigation(false)}><Link href={`/inventory?tab=sells&owner=${userName}`}><div className="hover:underline mb-2">{t('profile.recent_sells')}</div></Link></div> : ''}
                            </div>
                        :
                            <div 
                                className={cn(
                                    'relative w-full pl-12 ml-1 overflow-hidden mr-auto',
                                    'text-sm text-neutral transition transition-height duration-500',
                                    {
                                        'h-0': !showSubNav['account'],
                                        'h-12': showSubNav['account']
                                    }
                                )}>
                                    <div className={cn(
                                        'mt-2 mb-4 cursor:pointer'
                                    )} onClick={() => performLogin()}>{t('navigation.login')}</div>
                            </div>
                        }
                    </div>

                    <div className={cn(
                        'relative',
                        'border-b border-neutral border-opacity-20',
                        'bg-opacity-10 hover:bg-blued transition-colors'
                    )} id={"MarketItem"}>
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                            onClick={() => toggleSubNav('market')}
                        >
                            <div 
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isMarket
                                    }
                                )}
                            >
                                <img src="/shopping-cart-outline.svg" alt="Overview" title={t('search.market')} className="block"  />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('search.market')}</div>
                            <div className="h-5 w-5 ml-auto">
                                <img src={ showSubNav['market'] ? "/minus2.svg" : "/plus2.svg"} className="text-primary" className="block"  />
                            </div>
                        </div>

                        <div 
                            className={cn(
                                'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                'text-sm text-neutral cursor:pointer transition transition-height duration-500',
                                {
                                    'h-0': !showSubNav['market'],
                                    'h-48': showSubNav['market']
                                }
                            )}
                        >
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=sales&order_by=date_desc&search_type=sales&force_refresh=true'} ><div className="hover:underline mb-2">{`${t('search.sales')}`}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=auctions'} ><div className="hover:underline mb-2">{t('search.auctions')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=bundles'}><div className="hover:underline mb-2">{t('search.bundles')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=packs'}><div className="hover:underline mb-2">{t('overview.packs')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/drops'}><div className="hover:underline mb-2">{t('navigation.drops')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=trades&order_by=date_desc'}><div className="hover:underline mb-2">{t('asset.sold')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/market?tab=top-traded-assets&order_by=offer_desc'}><div className="hover:underline mb-2">{t('overview.top_sales')}</div></Link></div>
                        </div>
                    </div>

                    <div className={cn(
                        'relative',
                        'border-b border-neutral border-opacity-20',
                        'bg-opacity-10 hover:bg-blued transition-colors'
                    )} id={"ExplorerItem"}>
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                            onClick={() => toggleSubNav('explorer')}
                        >
                            <div
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isExplorer
                                    }
                                )}
                            >
                                <img src="/details.svg" alt="Explorer" title={t('navigation.explorer')} className="block"  />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('navigation.explorer')}</div>
                            <div className="h-5 w-5 ml-auto">
                                <img src={ showSubNav['explorer'] ? "/minus2.svg" : "/plus2.svg"} className="text-primary" className="block"  />
                            </div>
                        </div>

                        <div 
                            className={cn(
                                'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                'text-sm text-neutral cursor:pointer transition transition-height duration-500',
                                {
                                    'h-0': !showSubNav['explorer'],
                                    'h-40': showSubNav['explorer']
                                }
                            )}
                        >
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/explorer?tab=collections'} replace={true} ><div className="hover:underline mb-2">{t('navigation.collections')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/explorer?tab=sets'} replace={true} ><div className="hover:underline mb-2">{t('navigation.new_sets')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/explorer?tab=assets'} replace={true} ><div className="hover:underline mb-2">{t('search.assets')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/explorer?tab=users'} replace={true} ><div className="hover:underline mb-2">{t('navigation.users')}</div></Link></div>
                            <div onClick={() => toggleSideNavigation(false)}><Link href={'/explorer?tab=drops'} replace={true} ><div className="hover:underline mb-2">{t('navigation.drops')}</div></Link></div>
                        </div>
                    </div>

                    <div className={cn(
                        'relative',
                        'border-b border-neutral border-opacity-20',
                        'bg-opacity-10 hover:bg-blued transition-colors'
                    )} id={"BulkItem"}>
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                            onClick={() => toggleSubNav('bulk')}
                        >
                            <div
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isBulk
                                    }
                                )}
                            >
                                <img src="/bulk.svg" alt="Bulk" title={t('navigation.bulk')} className="block" />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('navigation.bulk')}</div>
                            <div className="h-5 w-5 ml-auto"><img src={ showSubNav['bulk'] ? "/minus2.svg" : "/plus2.svg"} className="block"  /></div>
                        </div>

                        {userName ?
                            <div 
                                className={cn(
                                    'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                    'text-sm text-neutral cursor:pointer transition transition-height duration-500',
                                    {
                                        'h-0': !showSubNav['bulk'],
                                        'h-88': showSubNav['bulk']
                                    }
                                )}
                            >
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_sell&owner=${userName}`}>
                                        <div className="hover:underline mb-2 ">{t('search.bulk_sell')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_edit&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('search.bulk_edit')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_sell_dupes&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('search.bulk_sell_dupes')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_cancel&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('asset.cancel')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_buy&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('asset.buy')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_transfer&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('asset.transfer')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_transfer_duplicates&owner=${userName}`}>
                                        <div className="hover:underline mb-2">
                                            {t('search.bulk_transfer_duplicates')}
                                        </div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_transfer_lowest_mints&owner=${userName}`}>
                                        <div className="hover:underline mb-2">
                                            {t('search.bulk_transfer_lowest_mints')}
                                        </div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_distribute&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('search.bulk_distribute')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_stake&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('asset.stake')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_unstake&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('asset.unstake')}</div>
                                    </Link>
                                </div>
                                <div onClick={() => toggleSideNavigation(false)}>
                                    <Link href={`/bulk?search_type=bulk_bundle&owner=${userName}`}>
                                        <div className="hover:underline mb-2">{t('search.bundle')}</div>
                                    </Link>
                                </div>
                            </div>
                        :
                            <div  
                                className={cn(
                                    'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                    'text-sm text-neutral transition-height duration-500',
                                    {
                                        'h-0': !showSubNav['bulk'],
                                        'h-12': showSubNav['bulk']
                                    }
                                )}
                            >
                                <div
                                    className={cn(
                                        'mt-2 mb-4 cursor:pointer'
                                    )}
                                    onClick={() => performLogin()}
                                >
                                    {t('navigation.login')}
                                </div>
                            </div>
                        }
                    </div>

                    <div className={cn(
                        'relative',
                        'border-b border-neutral border-opacity-20',
                        'bg-opacity-10 hover:bg-blued transition-colors'
                    )} id={"TradeItem"}>
                        <div
                            className={cn(
                                'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                            )}
                            onClick={() => toggleSubNav('trade')}
                        >
                            <div
                                className={cn(
                                    'mr-3 h-6 w-6',
                                    {
                                        'text-secondary': isTrade
                                    }
                                )}
                            >
                                <img src="/trade.svg" alt="Trade" title={t('trade.trade')} className="block"  />
                            </div>
                            <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('trade.trade')}</div>
                            <div className="h-5 w-5 ml-auto"><img src={ showSubNav['account'] ? "/minus2.svg" : "/plus2.svg"} className="block"  /></div>
                        </div>
                        
                        {userName ?
                            <div 
                            className={cn(
                                'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                'text-sm text-neutral cursor:pointer transition-height duration-500',
                                {
                                    'h-0': !showSubNav['trade'],
                                    'h-24': showSubNav['trade']
                                }
                            )}>
                                { /* <div onClick={() => toggleSideNavigation(false)}><Link href={'/trade?tab=new-trade'} replace={true} ><div className="hover:underline mb-2">{t('trade.new_trade')}</div></Link></div> */ }
                                <div onClick={() => toggleSideNavigation(false)}><Link href={'/trade?tab=received-offers'} replace={true} ><div className="hover:underline mb-2">{t('trade.received_offers')}</div></Link></div>
                                <div onClick={() => toggleSideNavigation(false)}><Link href={'/trade?tab=sent-offers'} replace={true} ><div className="hover:underline mb-2">{t('trade.sent_offers')}</div></Link></div>
                            </div>
                        :
                            <div 
                                className={cn(
                                    'relative w-full h-0 pl-12 ml-1 overflow-hidden mr-auto',
                                    'text-sm text-neutral',
                                    {
                                        'h-0': !showSubNav['trade'],
                                        'h-auto': showSubNav['trade']
                                    }
                                )}    
                            >
                                <div
                                    className={cn(
                                        'mt-2 mb-4 cursor:pointer'
                                    )}
                                    onClick={() => performLogin()}
                                >
                                    {t('navigation.login')}
                                </div>
                            </div>
                        }
                    </div>

                    <div onClick={() => toggleSideNavigation(false)}>
                        <Link href={`/stats`}>
                            <div
                                className={cn('flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3')}
                                id={"AnalyticsItem"}
                            >
                                <div
                                    className={cn(
                                        'mr-3 h-6 w-6',
                                        {
                                            'text-secondary': isTrade
                                        }
                                    )}
                                >
                                    <img src="/analytics.svg" alt="Trade" alt="Analytics" title={t('navigation.analytics')} className="block" />
                                </div>
                                <div className={cn('relative text-left text-base text-neutral mr-auto')}>{t('navigation.analytics')}</div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="w-full mt-auto h-auto">
                    <div
                        className={cn(
                            'flex align-center w-full pl-3 pr-3 leading-relaxed pt-3 pb-3'
                        )}
                        onClick={() => toggleLanguages(true)}
                    >
                        <div className="LanguageElement">
                            <LanguagePicker
                                onSelect={onSelect}
                                showLanguages={showLanguages}
                                value={defaultOption}
                                toggleLanguages={toggleLanguages}
                                id="DropdownField"
                            />
                        </div>
                        <div className={cn('relative text-left text-base text-neutral mr-auto')}>Language</div>
                    </div>

                    {userName ?
                        <div className="SideNavigationItem" onClick={performLogout}>
                            <div className={"Icon"}>
                                <img src="/log-out-outline.svg" alt="" />
                            </div>
                            <div className={cn('relative text-left my-auto w-full text-base text-neutral')}>Logout</div>
                        </div> : ''}
                </div>
            </div>
        </div>
    );
});

export default SideNavigation;
