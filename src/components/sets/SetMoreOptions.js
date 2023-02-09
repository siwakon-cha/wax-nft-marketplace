import cn from "classnames";
import Link from "next/link";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const SetMoreOptions = ({item, zoomOut, zoomIn, showStats, assets, toggleShowStats, createTube, tubed, refresh}) => {
    const {t} = useTranslation('common');
    const [showMenu, setShowMenu] = useState(false);

    const [blocked, setBlocked] = useState(false);

    const {
        author, category, rarity, variant, name, color, border, type, attr7, attr8, attr9, attr10, tubeId, total
    } = item;

    const tubable = () => {
        if (!assets || assets.length === 0 || !tubeId) {
            return false;
        }
        if (tubeId) {
            return assets.filter(asset => asset.owner && asset.assets.filter(
                a1 => a1.status === 'inventory' || a1.status === 'for_sale').length > 0).length === total;
        }
    };

    const toggleShowMenu = () => {
        if (!blocked) {
            setShowMenu(!showMenu);
        }
    }

    const doShowMenu = () => {
        setShowMenu(true);
        setBlocked(true);

        setTimeout(async () => {
            setBlocked(false);
        }, 500);
    }

    const itmClass = cn(
        'flex text-sm px-2 text-neutral mx-auto mt-auto mb-0 text-left opacity-80',
        'hover:opacity-100 cursor-pointer w-full'
    );

    return (
        <div className={cn(
            'absolute right-1 md:right-5 text-neutral'
        )}>
            <div
                onClick={toggleShowMenu}
                onMouseEnter={doShowMenu}
                className={cn(
                    'absolute right-1 md:right-5 w-5 h-5 opacity-80',
                    'hover:opacity-100 z-50 cursor-pointer',
                    'transform transition transition-transform duration-500',
                    {'rotate-90': showMenu}
            )}>
                <img className={cn('m-auto')} src="/more.svg" />
            </div>
            <div
                onMouseLeave={() => setShowMenu(false)}
                className={cn(
                    'absolute h-0 overflow-y-hidden w-44 m-2 flex flex-wrap',
                    'bg-paper shadow z-40 -top-3 -right-1 md:right-1 backdrop-filter backdrop-blur-2xl',
                    'transition transition-height duration-500 rounded-xl',
                    {'h-100': showMenu}
            )}>
                <div className={cn(
                    'w-full text-sm text-primary font-bold m-2'
                )}>{t('asset.set_actions')}</div>
                <div className={itmClass}>
                    <div>Zoom:</div>
                    <div className={'h-5 w-5'}><img className={'m-auto'} src="/minus.svg" onClick={zoomOut} /></div>
                    <div className={'h-5 w-5'}><img className={'m-auto'} src="/plus.svg" onClick={zoomIn} /></div>
                </div>
                <div className={itmClass} onClick={() => toggleShowStats()}>
                    {showStats ? t('profile.hide_stats') : t('profile.show_stats')}
                </div>
                { showStats && tubeId && !tubed && tubable() ? <div className={itmClass} onClick={
                    () => createTube(assets, tubeId, true)}>{t('profile.create_tube')} (Low Mints)</div> : ''}
                { showStats && tubeId && !tubed && tubable() ? <div className={itmClass} onClick={
                    () => createTube(assets, tubeId, false)}>{t('profile.create_tube')} (High Mints)</div> : ''}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_bundle`
                }>
                    <div className={itmClass}>{t('search.bundle')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_bundle_lowest_mints`
                }>
                    <div className={itmClass}>{t('search.bundle_lowest_mints')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_bundle_highest_mints`
                }>
                    <div className={itmClass}>{t('search.bundle_highest_mints')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_bundle_highest_duplicates`
                }>
                    <div className={itmClass}>{t('search.bundle_highest_duplicates')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_sell`
                }>
                    <div className={itmClass}>{t('search.bulk_sell')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_sell_duplicates`
                }>
                    <div className={itmClass}>{t('search.sell_duplicates')}</div>
                </Link>}
                { <Link href={`/bulk/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
                    category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                    variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                    attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}&exact_search=true&search_type=bulk_transfer`
                }>
                    <div className={itmClass}>{t('search.bulk_transfer')}</div>
                </Link>}
                <div className={itmClass} onClick={() => refresh()}>{t('general.refresh')}</div>
            </div>
        </div>
    );
}

export default SetMoreOptions;
