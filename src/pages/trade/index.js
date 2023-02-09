import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {setQueryStringWithoutPageReload} from "../../components/helpers/FormatLinks";

import {Context} from "../../components/waxplorer";

import {Tab} from "react-bootstrap";
import qs from 'qs';
import {formatCollectionAuthor, getImage, getSearchName} from "../../components/helpers/FormatLinks";
import TradeView from "../../components/trade/TradeView";
import SentTrades from "../../components/trade/SentTrades";
import ReceivedTrades from "../../components/trade/ReceivedTrades";
import LoadingIndicator from "../../components/loadingindicator";
import TabItem from "../../components/tabitem/TabItem";
import Page from "../../components/page/Page";
import ContentTabs from "../../components/contenttabs/ContentTabs";

const TradePage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const [searchAuthor, setSearchAuthor] = useState(process.browser ? (
        values['collection'] ? values['collection'] : null) : (props.collection ? props.collection : props.author));

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const limitIncrease = 40;

    const [keyLimits, setKeyLimits] = useState({
        'new-trade': limitIncrease,
        'sent-offers': limitIncrease,
        'received-offers': limitIncrease
    });

    const [tabKey, setTabKey] = useState(
        process.browser ? (values['tab'] && values['tab'] in (keyLimits) ? values['tab'] : 'new-trade') : (
            props.tab && props.tab in (keyLimits) ? props.tab : 'new-trade'));

    const [state, dispatch] = useContext(Context);

    const searchName = getSearchName(t, values, props);

    useEffect(() => {
        if (process.browser)
            getAssets(tabKey, true)
    }, [tabKey]);

    const getAssets = async(key, initial = false) => {
        if (key !== tabKey || initial) {
            setTabKey(key);

            const query = values;

            delete query['order_dir'];
            delete query['search_type'];
            delete query['order_by'];
            query['tab'] = key;
            delete query['offer_type'];

            setQueryStringWithoutPageReload(qs.stringify(query));
            dispatch({ type: 'SET_SWITCHED_TAB', payload: true });
        }
    };

    const image = getImage(searchAuthor, searchName, t);
    const title = t('links.check_out_these_items_on_waxplorer', {
        items: searchAuthor && searchAuthor !== '*' ? `${
            formatCollectionAuthor(searchAuthor)} ${searchName}` : searchName});
    const description = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    return (
        <Page
            id="TradePage"
            title={title}
            description={description}
            image={image}
        >
            <ContentTabs
                onSelect={(k) => getAssets(k)}
                tabKey={tabKey}
            >
                { /* <Tab eventKey="new-trade" title={<TabItem target={'new-trade'} tabKey={tabKey} title={t('trade.new_trade')}/>}>
                    { tabKey === 'new-trade' ? <TradeView tabKey={tabKey} ual={ual} /> : <LoadingIndicator /> }
                </Tab> */ }
                <Tab eventKey="received-offers" title={<TabItem target={'received-offers'} tabKey={tabKey} title={t('trade.received_offers')}/>}>
                    { tabKey === 'received-offers' ? <ReceivedTrades tabKey={tabKey} ual={ual} /> : <LoadingIndicator /> }
                </Tab>
                <Tab eventKey="sent-offers" title={<TabItem target={'sent-offers'} tabKey={tabKey} title={t('trade.sent_offers')}/>}>
                    { tabKey === 'sent-offers' ? <SentTrades tabKey={tabKey} ual={ual} /> : <LoadingIndicator /> }
                </Tab>
            </ContentTabs>
        </Page>
    );
};


TradePage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[1].replace('trade?', ''));

    values['search_page'] = true;
    values['searchType'] = values['search_type'] ? values['search_type'] : 'all_assets';

    return values;
};

export default TradePage;
