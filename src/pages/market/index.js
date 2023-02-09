import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import SearchComponent from "../../components/searchitems/";
import {Context} from "../../components/waxplorer";

import {Tab, Tabs} from "react-bootstrap";
import qs from 'qs';
import {
    setQueryStringWithoutPageReload,
    formatCollectionAuthor,
    getImage,
    getSearchName
} from "../../components/helpers/FormatLinks";
import TabItem from "../../components/tabitem/TabItem";
import Page from "../../components/page/Page";
import ContentTabs from "../../components/contenttabs/ContentTabs";

const MarketPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const [ state, dispatch ] = useContext(Context);

    const searchAuthor = process.browser ? (state.searchAuthor ? state.searchAuthor : values['collection']) : props.collection;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const limitIncrease = 40;

    const keyLimits = {
        'sales': limitIncrease,
        'bundles': limitIncrease,
        'packs': limitIncrease,
        'top-traded-assets': limitIncrease,
        'assets': limitIncrease,
        'trades': limitIncrease,
        'auctions': limitIncrease
    };

    const [tabKey, setTabKey] = useState(process.browser ? (values['tab'] && values['tab'] in (keyLimits) ? values['tab'] : 'sales') : (props.tab && props.tab in (keyLimits) ? props.tab : 'sales'));

    const searchName = getSearchName(t, values, props);

    const getAssets = async(key, initial=false) => {
        if (key === 'packs') {
            const query = values;

            query['tab'] = 'packs';
            query['search_type'] = 'packs';
            query['order_by'] = 'date_desc';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'trades') {
            const query = values;

            query['search_type'] = 'trades';
            query['order_by'] = 'date_desc';
            query['tab'] = 'trades';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'top-traded-assets') {
            const query = values;

            query['search_type'] = 'trades';
            query['order_by'] = 'offer_desc';
            query['tab'] = 'top-traded-assets';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'auctions') {
            const query = values;

            query['search_type'] = 'sales';
            query['order_by'] = 'date_desc';
            query['tab'] = 'auctions';
            query['offer_type'] = 'auctions';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'sales') {
            const query = values;

            query['search_type'] = 'sales';
            query['order_by'] = 'date_desc';
            query['tab'] = 'sales';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'assets') {
            const query = values;

            query['search_type'] = 'assets';
            query['order_by'] = 'asset_id_asc';
            query['tab'] = 'assets';
            query['offer_type'] = '';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        } else if (key === 'bundles') {
            const query = values;

            query['search_type'] = 'bundles';
            query['order_by'] = 'offer_asc';
            query['tab'] = 'bundles';
            query['offer_type'] = '';

            if (tabKey !== key)
                setQueryStringWithoutPageReload(qs.stringify(query));
        }

        if (key !== tabKey || initial) {
            setTabKey(key);

            dispatch({ type: 'SET_SWITCHED_TAB', payload: true });
        }
    };

    useEffect(() => {
        if (process.browser)
            getAssets(tabKey, true);
    }, [tabKey]);

    const image = getImage(searchAuthor, null, t);

    return (
        <Page
            id={"MarketPage"}
            title={t('links.check_out_these_items_on_waxplorer', {items: searchAuthor && searchAuthor !== '*' ? `${formatCollectionAuthor(searchAuthor)} ${searchName}` : searchName})}
            description={t('links.explore_and_trade_nfts_on_the_wax_blockchain')}
            image={image}
        >
            <ContentTabs
                onSelect={k => getAssets(k)}
                tabKey={tabKey}
            >
                    <Tab eventKey="sales" title={<TabItem target={'sales'} tabKey={tabKey} title={t('search.sales')}/>}>
                        {tabKey === "sales" ? <SearchComponent {...props} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'sales', fixed: false},
                            'order_by': {value: 'date_desc', fixed: false},
                            'minimal': false,
                            'tab': 'sales',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
                    <Tab eventKey="auctions" title={<TabItem target={'auctions'} tabKey={tabKey} title={t('search.auctions')}/>}>
                        {tabKey === "auctions" ? <SearchComponent {...props} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'sales', fixed: false},
                            'order_by': {value: 'date_desc', fixed: false},
                            'minimal': false,
                            'tab': 'auctions',
                            'searchOfferType': 'auctions',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
                    <Tab eventKey="bundles" title={<TabItem target={'bundles'} tabKey={tabKey} title={t('search.bundles')}/>}>
                        {tabKey === "bundles" ? <SearchComponent ual={ual} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'bundles', fixed: true},
                            'order_by': {value: 'date_desc', fixed: false},
                            'minimal': false,
                            'tab': 'bundles',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
                    <Tab eventKey="packs" title={<TabItem target={'packs'} tabKey={tabKey} title={t('overview.packs')}/>}>
                        {tabKey === "packs" ? <SearchComponent ual={ual} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'packs', fixed: false},
                            'order_by': {value: 'date_desc', fixed: false},
                            'minimal': false,
                            'tab': 'packs',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
                    <Tab eventKey="trades" title={<TabItem target={'trades'} tabKey={tabKey} title={t('search.trades')}/>}>
                        {tabKey === "trades" ? <SearchComponent ual={ual} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'trades', fixed: true},
                            'order_by': {value: 'date_desc', fixed: false},
                            'minimal': false,
                            'tab': 'trades',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
                    <Tab eventKey="top-traded-assets" title={<TabItem target={'top-traded-assets'} tabKey={tabKey} title={t('overview.top_sales')}/>}>
                        {tabKey === "top-traded-assets" ? <SearchComponent ual={ual} searchSettings={{
                            'owner': '',
                            'search_type': {value: 'trades', fixed: true},
                            'order_by': {value: 'offer_desc', fixed: false},
                            'minimal': false,
                            'tab': 'top-traded-assets',
                            'page_component': false,
                            'limit': {value: 60, fixed: true},
                            'expanded': false
                        }} limit = {keyLimits[tabKey]} tab={tabKey} /> : ''}
                    </Tab>
            </ContentTabs>
        </Page>
    );
};


MarketPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[1].replace('market?', ''));

    values['search_page'] = false;
    values['searchType'] = values['search_type'] ? values['search_type'] : 'sales';
    values['tab'] = values['tab'] ? values['tab'] : 'sales';

    return values;
};

export default MarketPage;
