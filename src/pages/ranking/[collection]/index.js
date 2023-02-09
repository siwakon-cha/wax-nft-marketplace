import React, {useState} from 'react';

import qs from "qs";

import {
    setQueryStringWithoutPageReload,
    formatCollectionAuthor, getImage
} from '../../../components/helpers/FormatLinks';

import {Tab, Tabs} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import TabItem from "../../../components/tabitem/TabItem";
import UserRanking from "../../../components/ranking/UserRanking";
import StreetFighterRanking from "../../../components/ranking/StreetFighterRanking";
import CollectionStats from "../../../components/ranking/CollectionStats";
import GameRanking from "../../../components/ranking/GameRanking";
import Page from "../../../components/page/Page";
import {get} from "../../../components/helpers/Api";

const RankingPage = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const searchAuthor = props.collection['collectionName'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const [searchSfLimit, setSearchSfLimit] = useState(100);
    const [searchLimit, setSearchLimit] = useState(100);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSf, setIsLoadingSf] = useState(true);
    const [tab, setTab] = useState(values['tab'] ? values['tab'] : props.tab ? props.tab : 'user-ranking');
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const updateQueryStr = (tab, initial) => {
        const query = values;
        if (tab)
            query['tab'] = tab;

        if (!initial)
            setQueryStringWithoutPageReload(qs.stringify(query));
    };

    const handleScroll = e => {
        let element = e.target;
        setShowScrollUpIcon(element.scrollTop > element.clientHeight);

        if (tab === 'user-ranking') {
            if (element.className === 'Ranking' && element.scrollHeight - element.scrollTop === element.clientHeight) {
                if (!isLoading && searchLimit < 1000) {
                    setSearchLimit(searchLimit + 100);
                }
            }
        } else if (tab === 'power-score-ranking') {
            if (element.className === 'Ranking' && element.scrollHeight - element.scrollTop === element.clientHeight) {
                if (!isLoadingSf && searchSfLimit < 1000) {
                    setSearchSfLimit(searchSfLimit + 100);
                }
            }
        }
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementsByClassName("Ranking")[0];
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };


    const switchTab = (key) => {
        setTab(key);

        updateQueryStr(key, false);
    };

    const image = getImage(searchAuthor, null);

    const pageTitle = tab === 'collection-stats' ? 'Collection Stats' : 'user-ranking' ? 'User Ranking' : 'power-score-ranking' ? 'Power Score Ranking' : 'Game Ranking';
    let title = `${searchAuthor && searchAuthor !== '*' ? `${formatCollectionAuthor(searchAuthor)} ${pageTitle}` : pageTitle} on NFTHive.io`;
    const description = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    if (process.browser)
        return <Page
            id={"RankingPage"}
            image={image}
            title={title}
            description={description}
        >
            <div className="Ranking" onScroll={handleScroll}>
                <Tabs className="AssetTabs" activeKey={tab} defaultActiveKey={'user-ranking'} id="user-ranking-collection-stats-tabs" onSelect={k => switchTab(k)}>
                    <Tab eventKey="user-ranking" title={<TabItem target={'user-ranking'} tabKey={tab} title={t('ranking.user_ranking')}/>}>
                        { tab === 'user-ranking' ? <UserRanking searchLimit={searchLimit} setSearchLimit={setSearchLimit} isLoading={isLoading} setIsLoading={setIsLoading} ual={ual} searchAuthor={searchAuthor} /> : '' }
                    </Tab>
                    { searchAuthor === 'vancitycomic' ? <Tab eventKey="game-ranking" title={<TabItem target={'game-ranking'} tabKey={tab} title={t('ranking.game_ranking')}/>}>
                         { tab === 'game-ranking' ? <GameRanking ual={ual} /> : '' }
                    </Tab> : '' }
                    { searchAuthor === 'stf.capcom' ? <Tab eventKey="power-score-ranking" title={<TabItem target={'power-score-ranking'} tabKey={tab} title={'Power Score Ranking'}/>}>
                        { tab === 'power-score-ranking' ? <StreetFighterRanking searchLimit={searchSfLimit} setSearchLimit={setSearchSfLimit} isLoading={isLoadingSf} setIsLoading={setIsLoadingSf} ual={ual} /> : ''}
                    </Tab> : '' }
                    <Tab eventKey="collection-stats" title={<TabItem target={'collection-stats'} tabKey={tab} title={t('ranking.collection_stats')}/>}>
                        { tab === 'collection-stats' ? <CollectionStats ual={ual} searchAuthor={searchAuthor} /> : '' }
                    </Tab>
                </Tabs>
            </div>
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}><img src = "/up-arrow.svg" /></div> : '' }
        </Page>;
    else
        return <Page
            id={"RankingPage"}
            image={image}
            title={title}
            description={description}
        />
};

RankingPage.getInitialProps = async (ctx) => {
    const c = ctx.query.collection;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));

    values['collection'] = await get("get-collection/" + c);

    return values;
};

export default RankingPage;
