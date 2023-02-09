import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Tab, Tabs} from "react-bootstrap";
import CollectionList from "../../components/explorer/CollectionList";
import qs from 'qs';
import {Context} from "../../components/waxplorer";
import SearchComponent from "../../components/searchitems/SearchComponent";
import Page from '../../components/page/Page';
import TabItem from "../../components/tabitem/TabItem";
import DropsList from "../../components/drops/DropsList";
import SetList from "../../components/explorer/SetList";
import {useRouter} from "next/router";
import ContentTabs from "../../components/contenttabs/ContentTabs";

const ExplorerPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const router = useRouter();

    const setQueryStringWithoutPageReloadPush = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

    const [keyLimits, setKeyLimits] = useState({
        'collections': 40,
        'sets': 40,
        'assets': 40,
        'templates': 40,
        'users': 40,
        'drops': 40
    });

    const activeUser = ual['activeUser'];

    const [ state, dispatch ] = useContext(Context);

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const [tabKey, setTabKey] = useState(process.browser ? (values['tab'] && values['tab'] in (keyLimits) ? values['tab'] : 'collections') : (props.tab && props.tab in (keyLimits) ? props.tab : 'collections'));

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const GetAssets = async(key, initial = false) => {
        if (key !== tabKey || initial) {
            if (key === 'collections') {
            } else if (key === 'assets') {
                dispatch({type: 'SET_SWITCHED_TAB', payload: true});
            }

            const query = values;

            delete query['order_dir'];
            delete query['search_type'];
            delete query['order_by'];
            query['tab'] = key;
            delete query['offer_type'];

            if (!initial)
                setQueryStringWithoutPageReloadPush(qs.stringify(query));
            setTabKey(key);
        }
    };

    useEffect(() => {
        if (process.browser)
            GetAssets(tabKey, true);
    }, [tabKey]);

    const image = 'https://www.nfthive.io/nfthive-logo.png';

    const getPageTitle = (tab) => {
        switch (tab) {
            case 'assets': return t('links.nfthive_explore_assets');
            case 'collections': return t('links.nfthive_explore_collections');
            case 'users': return t('links.nfthive_explore_users');
            case 'drops': return t('links.check_out_drops');
            case 'sets': return t('links.check_out_sets');
        }

        return t('links.nfthive_explorer_page');
    };

    const pageTitle = getPageTitle(tabKey);

    return (
        <Page
            id={"ExplorerPage"}
            title={pageTitle}
            description={t('links.inspect_asset_on_waxplorer')}
            image={image}
        >
            <ContentTabs tabKey={tabKey} onSelect={(k) => GetAssets(k)}>
                <Tab eventKey="collections" title={<TabItem target={'collections'} tabKey={tabKey} title={t('navigation.collections')}/>}>
                    { tabKey === 'collections' ? <CollectionList ual={ual} /> : <div /> }
                </Tab>
                <Tab eventKey="sets" title={<TabItem target={'sets'} tabKey={tabKey} title={t('navigation.new_sets')}/>}>
                    { tabKey === 'sets' ? <SetList ual={ual} /> : <div /> }
                </Tab>
                <Tab eventKey="assets" title={<TabItem target={'assets'} tabKey={tabKey} title={t('search.assets')}/>}>
                    { tabKey === 'assets' ?  <SearchComponent ual={ual} searchSettings={{
                        'owner': '',
                        'search_type': {value: 'assets', fixed: false},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'assets',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit={40} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="templates" title={<TabItem target={'templates'} tabKey={tabKey} title={t('search.templates')}/>}>
                    { tabKey === 'templates' ?  <SearchComponent ual={ual} searchSettings={{
                        'owner': '',
                        'search_type': {value: 'templates', fixed: false},
                        'order_by': {value: 'date_desc', fixed: false},
                        'minimal': false,
                        'tab': 'templates',
                        'page_component': false,
                        'limit': {value: 60, fixed: true},
                        'expanded': false
                    }} limit={40} tab={tabKey} /> : ''}
                </Tab>
                <Tab eventKey="users" title={<TabItem target={'users'} tabKey={tabKey} title={t('navigation.users')}/>}>
                    Coming Soon..
                </Tab>
                <Tab eventKey="drops" title={<TabItem target={'drops'} tabKey={tabKey} title={t('navigation.drops')}/>}>
                    { tabKey === 'drops' ? <DropsList {...props}/> : '' }
                </Tab>
            </ContentTabs>
        </Page>
    );
};

ExplorerPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('explorer?', ''));
};

export default ExplorerPage;
