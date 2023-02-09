import React from 'react';

import {formatNumber} from "../helpers/FormatLinks";

function RankingInfo(props) {
    const ranking = props['ranking'];
    const index = props['index'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const { userName, score, cardsValue, rarityScore, mintScore, collectionScore, buyPrice, sellPrice, total } = ranking;

    return (
        <tr className={ual['activeUser'] && userName === ual['activeUser']['accountName'] ? "RankingInfo HighlightUser" : "RankingInfo" } >
            <td>{ index }</td>
            <td ><a href={`/user/${userName}`}>{ userName }</a></td>
            <td>{ formatNumber(score) }</td>
            <td>{ total }</td>
            <td>{ formatNumber(cardsValue) + ' WAX' }</td>
            <td>{ formatNumber(rarityScore) }</td>
            <td>{ formatNumber(mintScore) }</td>
            <td>{ formatNumber(collectionScore) }</td>
            <td>{ formatNumber(buyPrice) + ' WAX' }</td>
            <td>{ formatNumber(sellPrice) + ' WAX' }</td>
        </tr>
    );
}

export default RankingInfo;
