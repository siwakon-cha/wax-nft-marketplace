import React, {useEffect} from 'react';
import GeneralStats from "../../components/stats/GeneralStats";
import Chart from "../../components/stats/Chart";
import MarketChart from "../../components/stats/MarketChart";
import CollectionChart from "../../components/stats/CollectionChart";
import qs from 'qs';
import TopMarkets from "../../components/stats/TopMarkets";
import TopCollections from "../../components/stats/TopCollections";
import TopSellers from "../../components/stats/TopSellers";
import TopBuyers from "../../components/stats/TopBuyers";
import {formatCollectionAuthor, getImage} from "../../components/helpers/FormatLinks";
import {useTranslation} from "react-i18next";
import DefiChart from "../../components/stats/DefiChart";
import Page from "../../components/page/Page";
import cn from "classnames";

const AnalyticsPage = (props) => {
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const getValue = (key, def) => {
        if (values[key])
            return values[key];
        return def;
    };

    const module = getValue('module', null);

    const searchAuthor = props.collection ? props.collection : process.browser ? getValue('collection', '*') : '*';

    useEffect(() => {
    }, [searchAuthor]);

    const image = getImage(searchAuthor);

    const pageTitle = t('navigation.analytics');
    const title = `${searchAuthor && searchAuthor !== '*' ? `${
        formatCollectionAuthor(searchAuthor)} ${pageTitle}` : pageTitle} on NFTHive.io`;
    const description = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    return (
        <Page
            id={"StatsPage"}
            title={title}
            image={image}
            description={description}
        >
            <div className="Stats">
                {!module || module === 'quick_stats' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.stats')}</h3>
                    <GeneralStats searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'history' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.history')}</h3>
                    <Chart searchAuthor={searchAuthor} id="RevenueChart" {...props} />
                </div> : ''}
                {!module || module === 'defi' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.defi_accumulation')}</h3>
                    <DefiChart searchAuthor={searchAuthor} id="RevenueChart" {...props} />
                </div> : ''}
                {!module || module === 'market_volume' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.market_volume')}</h3>
                    <MarketChart searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'collection_volume' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.collection_volume')}</h3>
                    <CollectionChart searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'top_collections' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.top_collections')}</h3>
                    <TopCollections searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'top_markets' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.top_markets')}</h3>
                    <TopMarkets searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'top_sellers' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.top_sellers')}</h3>
                    <TopSellers searchAuthor={searchAuthor} {...props} />
                </div> : ''}
                {!module || module === 'top_buyers' ? <div className="HistoryContainer">
                    <h3 className={cn('my-8')}>{t('analytics.top_buyers')}</h3>
                    <TopBuyers searchAuthor={searchAuthor} {...props} />
                </div> : ''}
            </div>
        </Page>
    );
};


AnalyticsPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('stats?', ''));
};

export default AnalyticsPage;
