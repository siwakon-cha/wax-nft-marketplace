import LoadingIndicator from "../loadingindicator";
import RankingInfo from "./RankingInfo";
import React, {useEffect, useState} from "react";
import {setQueryStringWithoutPageReload} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";

import qs from "qs";
import moment from 'moment';
import {useTranslation} from "react-i18next";


const UserRanking = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const [searchResults, setSearchResults] = useState([]);
    const [searchOrderBy, setSearchOrderBy] = useState(values['order_by'] ? values['order_by'] : 'score');
    const {searchLimit, setSearchLimit} = props;
    const [lastUpdated, setLastUpdated] = useState('Loading...');
    const {isLoading, setIsLoading} = props;

    const searchAuthor = props['searchAuthor'];
    const {t} = useTranslation('common');
    const ual = props['ual'];

    const initPage = async() => {
        get(`ranking-updated/${searchAuthor}`, 'set-api').then(res => {
            const utc = moment.utc(res['lastUpdated']).toDate();
            const date = moment(utc).local().format('YYYY-MM-DD HH:mm:ss');
            setLastUpdated(date);
        });

        searchShit(searchAuthor, searchOrderBy, searchLimit, true);
    };

    const updateQueryStr = (order_by, limit, tab, initial) => {
        const query = values;
        if (order_by && order_by !== 'score')
            query['order_by'] = order_by;

        if (!initial)
            setQueryStringWithoutPageReload(qs.stringify(query));
    };

    const getSearchResult = (result) => {
        setIsLoading(false);
        return result;
    };

    const searchShit = async(author, order_by='score', limit=100, initial=false) => {
        const searchPath = `rankings?order_by=${order_by}&limit=${limit}&author=${author}`;

        setIsLoading(true);

        setSearchOrderBy(order_by);
        setSearchLimit(limit);

        updateQueryStr(order_by, limit, initial);

        if (limit === 100)
            setSearchResults([]);

        const result = await get(searchPath, 'set-api').then(getSearchResult);

        setSearchResults(result);

        setIsLoading(false);
    };

    useEffect(() => {
        initPage();
    }, [searchAuthor]);

    const onSelectScore = () => {
        searchShit(searchAuthor, 'score', 100);
    };

    const onSelectTotal = () => {
        searchShit(searchAuthor, 'total', 100);
    };

    const onSelectCardsValue = () => {
        searchShit(searchAuthor, 'cards_value', 100);
    };

    const onSelectRarityScore = () => {
        searchShit(searchAuthor, 'rarity_score', 100);
    };

    const onSelectMintScore = () => {
        searchShit(searchAuthor, 'mint_score', 100);
    };

    const onSelectCollectionScore = () => {
        searchShit(searchAuthor, 'collection_score', 100);
    };

    const onSelectBuyValue = () => {
        searchShit(searchAuthor, 'buy_price', 100);
    };

    const onSelectSellValue = () => {
        searchShit(searchAuthor, 'sell_price', 100);
    };

    return <div>
        <div className="RankingLastUpdated">{t('ranking.last_updated')}: {lastUpdated}</div>
        <div className="RankingTable">
            <table cellSpacing="0">
                <tr>
                    <th>{t('ranking.rank')}</th>
                    <th>{t('ranking.user')}</th>
                    <th onClick={onSelectScore}>{t('ranking.score')}</th>
                    <th onClick={onSelectTotal}>{t('ranking.cards_num')}</th>
                    <th onClick={onSelectCardsValue}>{t('ranking.cards_value')}</th>
                    <th onClick={onSelectRarityScore}>{t('ranking.rarity_score')}</th>
                    <th onClick={onSelectMintScore}>{t('ranking.mint_score')}</th>
                    <th onClick={onSelectCollectionScore}>{t('ranking.collection_score')}</th>
                    <th onClick={onSelectBuyValue}>{t('ranking.buy_value')}</th>
                    <th onClick={onSelectSellValue}>{t('ranking.sell_value')}</th>
                </tr>
                {
                    isLoading && (!searchResults || searchResults.length === 0) ? (<LoadingIndicator/>) :
                    searchResults.map((ranking, index) => <RankingInfo
                        index={index + 1}
                        ranking={ranking}
                        ual={ual}
                    />)
                }
            </table>
        </div>
        {isLoading && searchResults && searchResults.length > 0 ? <LoadingIndicator/> : ''}
    </div>
};

export default UserRanking;
