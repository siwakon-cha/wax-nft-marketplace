import React from 'react';

import {formatNumber, formatNumberS} from "../helpers/FormatLinks";
import LazyLoad from 'react-lazy-load';
import {useTranslation} from "react-i18next";

function CollectionInfo(props) {
    const collectionRow = props['collectionRow'];
    const searchAuthor = props['searchAuthor'];
    const searchCategory = props['searchCategory'];

    const { image, name, variant, category, rarity, color, border, type, number, average, burned, total, rarityScore, luck, ease, delay, difficulty } = collectionRow;

    return (
        <tr className="RankingInfo" >
            <td><a target="_blank" href={`/market?collection=${searchAuthor}&category=${category}&term=${
                escape(name)}&variant=${variant}&rarity=${rarity}&color=${color}&type=${type}${
                border ? '&border='+border : ''}`}><LazyLoad><img src = { image } /></LazyLoad></a></td>
            <td><a target="_blank" href={`/market?collection=${searchAuthor}&category=${category}&term=${
                escape(name)}&variant=${variant}&rarity=${rarity}&color=${color}&type=${type}${
                border ? '&border='+border : ''}`}>{name}</a></td>
            <td>{ number }</td>
            <td>{ variant }</td>
            <td>{ rarity }</td>

            {searchAuthor && ['darkcountryh', 'alien.worlds', 'kogsofficial'].includes(searchAuthor) ? <td>{
                color }</td> : '' }
            {searchAuthor && searchAuthor === 'kogsofficial' ? <td>{border}</td> : '' }
            {['darkcountryh', 'alien.worlds', 'kogsofficial'].includes(searchAuthor) ? <td>{type}</td> : '' }

            {searchAuthor && searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <td>{
                difficulty}</td> : '' }
            {searchAuthor && searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <td>{delay}</td> : '' }
            {searchAuthor && searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <td>{ease}</td> : '' }
            {searchAuthor && searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <td>{luck}</td> : '' }
            <td>{ formatNumber(average) + ' WAX' }</td>
            <td>{ total }</td>
            <td>{ burned }</td>
            <td>{ formatNumberS(rarityScore) }</td>
        </tr>
    );
}

export default CollectionInfo;
