import React, {useEffect, useState} from 'react';
import FixedSearchComponent from "../searchitems/FixedSearchComponent";
import Link from 'next/link';
import cn from "classnames";
import {useTranslation} from "react-i18next";

function SearchPopup(props) {
    const asset = props['asset'];

    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const searchType = props['searchType'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const searchId = props['searchId'];

    const {
        category, attr7, attr8, attr9, attr10, rarity, variant, author, name, color, type, border, owner, templateId
    } = asset;

    let link = '';
    let orderBy = 'offer_asc';
    let title = '';
    let search = searchType;

    switch (searchType) {
        case 'cheapest': link = `/market/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}&exact_search=true&search_type=cheapest`;
        title = t('search.cheapest');
        break;
        case 'sales': link = `/market/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}&exact_search=true&search_type=sales`;
        title = t('search.sales');
        break;
        case 'active_sales': link = `/market/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}&owner=${
            owner ? owner : ''}&exact_search=true&search_type=sales`;
        title = t('profile.active_sales');
        search = 'sales';
        break;
        case 'cheapest_missing': link = `/market/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=offer_asc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}&owner=${owner ? owner : ''}&exact_search=true&search_type=cheapest_missing`;
        title = t('search.sales');
        break;
        case 'trades':
            link = `/market/?term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=date_desc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}&exact_search=true&search_type=trades&tab=trades`;
            orderBy = 'date_desc';
            title = t('profile.recent_sells');
        break;
        case 'assets':
            link = `/explorer/?tab=assets&term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=date_desc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}${
                owner ? `&owner=${owner}` : ''}&exact_search=true&search_type=assets`;
            orderBy = 'date_desc';
            title = t('search.my_assets');
        break;
        case 'staked':
            link = `/explorer/?tab=assets&term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=date_desc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}${
                owner ? `&owner=${owner}` : ''}&exact_search=true&search_type=staked`;
            orderBy = 'date_desc';
            title = t('search.staked_assets');
        break;
        case 'choobed':
            link = `/explorer/?tab=assets&term=${name ? escape(name) : ''}&collection=${author ? author : ''}&category=${
            category ? category : ''}&order_by=date_desc&limit=100${rarity ? `&rarity=${rarity}` : ''}${variant ? `&variant=${
                variant}` : ''}${border ? `&border=${border}` : ''}${color ? `&color=${color}` : ''}${type ? `&type=${
                    type}` : ''}${attr7 ? `&attr7=${attr7}` : ''}${attr8 ? `&attr8=${attr8}` : ''}${attr9 ? `&attr9=${
                        attr9}` : ''}${attr10 ? `&attr10=${attr10}` : ''}${templateId ? `&template_id=${templateId}` : ''}${
                owner ? `&owner=${owner}` : ''}&exact_search=true&search_type=tubed`;
            orderBy = 'date_desc';
            title = t('search.tubed');
            search = 'tubed';
        break;
    }

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    useEffect(() => {
    }, [searchId]);

    return (
        <div className={cn(
            'relative z-40 w-11/12 justify-center h-auto max-h-4/5 shadow-xl',
            'backdrop-blur-xl text-sm text-neutral p-8',
            'bg-paperd rounded-2xl m-auto top-10'
        )}>
            <div className={'SearchPopupHeader'}>
                <div>{title}</div>
                <Link href={link}><div onClick={cancel} className={"NextLink OpenSearchPage"}>{t('search.open_full_search')} <img className={"SearchIcon"} src="/search.svg" alt="" /></div></Link>
                <img src="/close_btn.svg" alt="X" onClick={cancel} />
            </div>

            <FixedSearchComponent
                {...props}
                className={"PopupSearchResults"}
                id={'Fixed1'}
                searchSettings={{
                    'owner': {value: ['assets', 'active_sales', 'staked', 'choobed', 'cheapest_missing'].includes(searchType) ? owner : ''},
                    'search_type': {value: search},
                    'collection': {value: author},
                    'category': {value: category ? category : ''},
                    'variant': {value: variant},
                    'rarity': {value: rarity},
                    'color': {value: color},
                    'type': {value: type},
                    'name': {value: name},
                    'attr7': {value: attr7},
                    'attr8': {value: attr8},
                    'attr9': {value: attr9},
                    'attr10': {value: attr10},
                    'exact_search': {value: true},
                    'templateId': {value: templateId},
                    'border': {value: border},
                    'order_by': {value: orderBy},
                    'limit': {value: searchType === 'cheapest_missing' ? 100 : 12, fixed: true}
                }}
                userName={userName}
            />
        </div>
    );
}

export default SearchPopup;
