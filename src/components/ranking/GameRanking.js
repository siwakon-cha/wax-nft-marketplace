import LoadingIndicator from "../loadingindicator";
import GameInfo from "./GameInfo";
import React, {useEffect, useState} from "react";
import {post} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";


const GameRanking = (props) => {
    const [gameResults, setGameResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const ual = props['ual'];
    const {t} = useTranslation('common');

    const selectSortBy = (key) => {
        if (key === sortBy) {
            setSortDir(sortDir * -1)
        } else {
            setSortDir(1)
        }
        setSortBy(key)
    };

    const [sortDir, setSortDir] = useState(1);
    const [sortBy, setSortBy] = useState('number');


    const parseGameResults = (res) => {

        const gameData = [];

        if (res['data']) {
            res['data']['rows'].map(row => {
                let gems = 0;
                if (row['total_collection']) {
                    row['total_collection'].map(collection => collection['key'] === 'vancitycomic' ? gems += collection['value'] : gems += 0)
                }
                let wins = 0;
                if (row['total_wins']) {
                    row['total_wins'].map(collection => collection['key'] === 'vancitycomic' ? wins += collection['value'] : wins += 0)
                }

                gameData.push({
                    user: row['owner'],
                    emoji: row['emoji'],
                    assets: gems,
                    wins: wins,
                })
            });

            setGameResults(gameData.sort((a, b) => b.wins - a.wins));
        }

        setIsLoading(false);
    };

    const initPage = async() => {
        setIsLoading(true);
        const body = {
            'code': 'battle.gems',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1000,
            'reverse': 'false',
            'scope': 'battle.gems',
            'show_payer': 'false',
            'table': 'users',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseGameResults(res));
    };

    useEffect(() => {
        initPage();
    }, []);

    return<div>
        <div className="RankingTable">
            <h3>VanCity Outbreak Humans vs Zombies NFT Battle</h3>
            <table cellSpacing="0">
                <tr>
                    <th>{t('ranking.rank')}</th>
                    <th>{t('ranking.user')}</th>
                    <th>{t('ranking.emoji')}</th>
                    <th onClick={() => selectSortBy('assets')}>{t('search.assets')}</th>
                    <th onClick={() => selectSortBy('wins')}>{t('ranking.wins')}</th>
                </tr>
                {
                    isLoading && (!gameResults || gameResults.length === 0) ? (<LoadingIndicator/>) :
                    gameResults.sort((a, b) => (Number.isNaN(a[sortBy]) ? ('' + b[sortBy]).localeCompare(a[sortBy]) : (b[sortBy] - a[sortBy])) * sortDir).map((ranking, index) => <GameInfo
                        index={index + 1}
                        ranking={ranking}
                        ual={ual}
                    />)
                }
            </table>
        </div>
        {isLoading && gameResults && gameResults.length > 0 ? <LoadingIndicator/> : ''}
    </div>
};

export default GameRanking;
