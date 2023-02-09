import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import SearchComponent from "../../components/searchitems/SearchComponent";
import {Context} from "../../components/waxplorer";

import {Tab, Tabs} from "react-bootstrap";
import qs from 'qs';
import {formatCollectionAuthor, getImage, getSearchName, setQueryStringWithoutPageReload} from "../../components/helpers/FormatLinks";
import Search from "../../components/searchitems/SearchComponent";
import TabItem from "../../components/tabitem/TabItem";
import Page from "../../components/page/Page";
import ContentTabs from "../../components/contenttabs/ContentTabs";

const InventoryPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const [searchAuthor, setSearchAuthor] = useState(process.browser ? (
        values['collection'] ? values['collection'] : null) : (props.collection ? props.collection : props.author));

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const searchUser = Object.keys(values).includes('owner') ? values['owner'] : userName;

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const limitIncrease = 40;

    const [keyLimits, setKeyLimits] = useState({
        'inventory': limitIncrease,
        'favorites': limitIncrease,
        'auctions': limitIncrease,
        'sales': limitIncrease,
        'bundles': limitIncrease,
        'burned': limitIncrease,
        'staked': limitIncrease,
        'buys': limitIncrease,
        'sells': limitIncrease
    });

    const [tabKey, setTabKey] = useState(process.browser ? (values['tab'] && values['tab'] in (keyLimits) ? values['tab'] : 'inventory') : (props.tab && props.tab in (keyLimits) ? props.tab : 'inventory'));

    const [state, dispatch] = useContext(Context);

    const searchName = getSearchName(t, values, props);

    useEffect(() => {
        if (process.browser)
            getAssets(tabKey, searchUser, true)
    }, [tabKey, userName, searchUser]);

    const getAssets = async(key, owner, initial = false) => {
        if (key !== tabKey || initial) {
            setTabKey(key);

            const query = values;

            delete query['order_dir'];
            if (key !== tabKey)
                delete query['search_type'];
            delete query['order_by'];
            query['tab'] = key;
            if (owner)
                query['owner'] = owner;
            delete query['offer_type'];

            setQueryStringWithoutPageReload(qs.stringify(query));
            dispatch({ type: 'SET_SWITCHED_TAB', payload: true });
        }
    };

    const image = getImage(searchAuthor, searchName, t);

    const title = t('links.check_out_these_items_on_waxplorer', {items: searchAuthor && searchAuthor !== '*' ? `${
        formatCollectionAuthor(searchAuthor)} ${searchName}` : searchName});
    const desciption = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    return (
        <Page
            id="InventoryPage"
            description={desciption}
            title={title}
            image={image}
        >
            <ContentTabs
                tabKey={tabKey}
                onSelect={(k) => getAssets(k)}
            >
                <Tab eventKey="inventory" title={<TabItem target={'inventory'} tabKey={tabKey} title={t('profile.inventory')}/>}>
                    {tabKey === "inventory" && searchUser ? <SearchComponent {...props} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'assets', fixed: false},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'inventory',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="favorites" title={<TabItem target={'favorites'} tabKey={tabKey} title={t('search.favorites')}/>}>
                    {tabKey === "favorites" && searchUser ? <SearchComponent {...props} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'favorites', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'favorites',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="auctions" title={<TabItem target={'auctions'} tabKey={tabKey} title={t('search.my_auctions')}/>}>
                    {tabKey === "auctions" && searchUser ? <SearchComponent {...props} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'my_auctions', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'auctions',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="sales" title={<TabItem target={'sales'} tabKey={tabKey} title={t('profile.active_sales')}/>}>
                    {tabKey === "sales" && searchUser ? <SearchComponent ual={ual} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'sales', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'sales',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="bundles" title={<TabItem target={'bundles'} tabKey={tabKey} title={t('profile.active_bundle_sales')}/>}>
                    {tabKey === "bundles" && searchUser ? <SearchComponent ual={ual} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'bundles', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'bundles',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="buys" title={
                    <TabItem target={'buys'} tabKey={tabKey} title={t('profile.recent_purchases')}/>}>
                    { tabKey === 'buys' && searchUser ? <Search ual={ual} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'buys', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'tab': 'buys',
                        'expanded': false
                    }} limit={keyLimits[tabKey]} /> : '' }
                </Tab>
                <Tab eventKey="sells" title={<TabItem target={'sells'} tabKey={tabKey} title={t('profile.recent_sells')}/>}>
                    { tabKey === 'sells' && searchUser ? <Search ual={ual} searchSettings={{
                        'owner': {value: searchUser, fixed: true},
                        'search_type': {value: 'sells', fixed: true},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'tab': 'sells',
                        'expanded': false
                    }} limit={keyLimits[tabKey]} /> : '' }
                </Tab>
            </ContentTabs>
        </Page>
    );
};


InventoryPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[1].replace('inventory?', ''));

    values['search_page'] = true;
    values['searchType'] = values['search_type'] ? values['search_type'] : 'all_assets';

    return values;
};

export default InventoryPage;
