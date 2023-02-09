import React, {useState} from 'react';


import {formatNumber} from "../helpers/FormatLinks";
import {useAsync} from "react-async";
import get from "../helpers/Api";
import {useTranslation} from "react-i18next";

const loadCollectionStats = async (args) => {
    return await get(`collection-stats?owner=${args.owner}&author=${args.author}&category=${args.category}`, 'statistics');
};

const loadRank = async (args) =>
  await get(`rank?owner=${args.owner}&author=${args.author}&category=${args.category}&target=${args.target}`, 'set-api');

function CollectionStats(props) {
    const owner = props['owner'];
    const {t} = useTranslation('common');
    const collection = props['collection'];
    const category = props['category'];
    const author = props['author'];
    const [expanded, setExpanded] = useState(false);

    const myItems = (item) =>
        item['owner'] === owner;

    const totalNumberOfCards = collection.filter(item => myItems(item)).map(item => item['numOwned']).reduce((prev, curr) => prev + curr, 0);
    const cardsOwned = collection.filter(item => myItems(item)).length;
    const availableCards = collection.length;

    const GetBaseValues = () => {
        const { data, error, isLoading }  = useAsync({ promiseFn: loadCollectionStats, owner: owner, author: author, category: category });
        if (error)
            return { estimatedValue: 'Error', score: 'Error', rarityScore: 'Error', mintScore: 'Error', collectionScore: 'Error' };
        if (isLoading)
            return { estimatedValue: 'Loading...', score: 'Loading...', rarityScore: 'Loading...', mintScore: 'Loading...', collectionScore: 'Loading...'};
        if (!error && !isLoading) {
            const { estimatedValue, score, rarityScore, mintScore, collectionScore } = data;
            return {
                estimatedValue: `~ ${formatNumber(Math.round(estimatedValue))} WAX`,
                score: formatNumber(score),
                rarityScore: formatNumber(rarityScore),
                mintScore: formatNumber(mintScore),
                collectionScore: formatNumber(collectionScore)
            };
        }
    };

    const GetRank = (target) => {
        const { data, error, isLoading }  = useAsync({ promiseFn: loadRank, owner: owner, author: author,
            category: category, target: target });
        if (error)
            return 'Error';
        if (isLoading)
            return 'Loading...';
        if (!error && !isLoading) {
            const { rank } = data;
            return rank;
        }
    };

    const { estimatedValue, score, rarityScore, mintScore, collectionScore } = GetBaseValues();

    const valueRank = GetRank('value');
    const scoreRank = GetRank('score');
    const collectionRank = GetRank('collection');
    const mintRank = GetRank('mint');
    const rarityRank = GetRank('rarity');

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={expanded ? "CollectionStats PageComponent expanded" : "CollectionStats PageComponent"} onClick={toggleExpanded} >
            {expanded ? <div><img className="CollapseIcon Closed" src="/collapse.svg" alt='close' />
                <table>
                    <tbody>
                        <tr><td><b>{t('profile.cards')}:</b></td><td>{cardsOwned}/{availableCards}</td><td>{t('profile.total')}:</td><td>{totalNumberOfCards}</td></tr>
                        <tr><td><b>{t('profile.estimated_value')}:</b></td><td>{estimatedValue}</td><td>{t('profile.rank')}:</td><td>{valueRank}</td></tr>
                        <tr><td><b>{t('profile.score')}:</b></td><td>{score}</td><td>{t('profile.rank')}:</td><td>{scoreRank}</td></tr>
                        <tr><td><b>{t('profile.collection_score')}:</b></td><td>{collectionScore}</td><td>{t('profile.rank')}:</td><td>{collectionRank}</td></tr>
                        <tr><td><b>{t('profile.rarity_score')}:</b></td><td>{rarityScore}</td><td>{t('profile.rank')}:</td><td>{rarityRank}</td></tr>
                        <tr><td><b>{t('profile.mint_score')}:</b></td><td>{mintScore}</td><td>{t('profile.rank')}:</td><td>{mintRank}</td></tr>
                    </tbody>
                </table>
            </div>: <div><div className="ToggleStats" >{t('profile.show_collection_stats')}</div><img className="CollapseIcon Open" src="/collapse.svg" alt='open' /></div> }
        </div>
    );
}

export default CollectionStats;
