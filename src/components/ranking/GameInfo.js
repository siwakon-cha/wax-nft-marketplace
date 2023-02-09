import React from 'react';

function GameInfo(props) {
    const ranking = props['ranking'];
    const index = props['index'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const { user, emoji, assets, wins } = ranking;

    return (
        <tr className={ual['activeUser'] && user === ual['activeUser']['accountName'] ? "RankingInfo HighlightUser" : "RankingInfo" } >
            <td>{ index }</td>
            <td ><a href={`/user/${user}tab=collection&collection_name=Vancity%20Outbreak%202&collection=vancitycomic`}>{ user }</a></td>
            <td>{ emoji }</td>
            <td>{ assets }</td>
            <td>{ wins }</td>
        </tr>
    );
}

export default GameInfo;
