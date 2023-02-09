import React, {useEffect, useState} from "react";
import {get} from "../helpers/Api";

import qs from "qs";
import LoadingIndicator from "../loadingindicator";
import {useTranslation} from "react-i18next";

const StreetFighterRanking = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const [sfResults, setSfResults] = useState([]);
    const {isLoading, setIsLoading} = props;
    const [searchOrderBy, setSearchOrderBy] = useState(values['order_by'] ? values['order_by'] : 'power-score');
    const {searchLimit, setSearchLimit} = props;

    const {t} = useTranslation('common');
    const ual = props['ual'];

    const getStreetFighterRanking = async(order_by='power_score', limit=100) => {
        setIsLoading(true);
        setSearchLimit(limit);
        setSearchOrderBy(order_by);
        const searchPath = `street-fighter-ranking?order_by=${order_by}&limit=${limit}`;

        if (limit === 100)
            setSfResults([]);

        const result = await get(searchPath, 'set-api').then(getSfResult);

        setSfResults(result);

        setIsLoading(false);
    };

    const onSelectSellValue = () => {
        getStreetFighterRanking('num_assets', 100);
    };

    const onSelectPowerScore = () => {
        getStreetFighterRanking('power_score', 100);
    };

    useEffect(() => {
        getStreetFighterRanking(searchOrderBy, searchLimit);
    }, [searchOrderBy, searchLimit]);

    const getSfResult = (result) => {
        setIsLoading(false);
        return result;
    };

    const handleScroll = e => {
        let element = e.target;

        if (element.className === 'RankingTable' && element.scrollHeight - element.scrollTop === element.clientHeight) {
            if (!isLoading && searchLimit < 1000) {
                getStreetFighterRanking(searchOrderBy, parseInt(searchLimit) + 100);
            }
        }
    };

    return <div className="RankingTable" onScroll={handleScroll}>
        <h3>Street Fighter Power Score</h3>
        <table cellSpacing="0">
            <tr>
                <th>{t('ranking.rank')}</th>
                <th>{t('ranking.user')}</th>
                <th onClick={() => onSelectSellValue()}>{t('asset.number_of_assets')}</th>
                <th onClick={() => onSelectPowerScore()}>Power Score</th>
            </tr>
            {
                isLoading && (!sfResults || sfResults.length === 0) ? (<LoadingIndicator />) :
                    sfResults.map((ranking, index) => {
                        const userName = ranking['userName'];
                        const numAssets = ranking['numAssets'];
                        const powerScore = ranking['powerScore'];

                        return (
                            <tr className={ual['activeUser'] && userName === ual['activeUser']['accountName'] ? "RankingInfo HighlightUser" : "RankingInfo"}>
                                <td>{index + 1}</td>
                                <td ><a href={`/user/${userName}`}>{ userName }</a></td>
                                <td>{numAssets}</td>
                                <td>{powerScore}</td>
                            </tr>
                        );
                    })
            }
        </table>
    </div>;
};

export default StreetFighterRanking;
