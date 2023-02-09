import React, {useEffect, useState} from 'react';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Dropdown from "react-dropdown";
import {get} from "../helpers/Api";
import {useTranslation} from "react-i18next";
import {formatNumber} from "../helpers/FormatLinks";
import Link from 'next/link';
import ShowMoreOrLessButton from '../common/util/input/ShowMoreOrLessButton';

function TopCollections(props) {
    const [chartRange, setChartRange] = useState(1);
    const [revenueHistory, setRevenueHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {t, i18n} = useTranslation('common');
    const [sortBy, setSortBy] = useState('volume');
    const [sortDir, setSortDir] = useState(1);
    const searchAuthor = props['searchAuthor'];
    const [showNum, setShowNum] = useState(10);

    useEffect(() => {
        GetRevenueHistory(chartRange, searchAuthor)
    }, [chartRange, searchAuthor]);

    const getChartResult = (result) => {
        return result;
    };

    const GetRevenueHistory = async(range, author) => {
        setIsLoading(true);

        const result = await get(`collection-volume-table/${range}`, 'statistics').then(getChartResult);

        setRevenueHistory(result);
        setIsLoading(false);
    };

    const selectSortBy = (key) => {
        if (key === sortBy) {
            setSortDir(sortDir * -1)
        } else {
            setSortDir(1)
        }
        setSortBy(key)
    };

    const chartDropDownOptions = [
        { value: 1, label: t('analytics.24h_collection_volume') },
        { value: 2, label: t('analytics.days_collection_volume', {days: 2}) },
        { value: 3, label: t('analytics.days_collection_volume', {days: 3}) },
        { value: 7, label: t('analytics.days_collection_volume', {days: 7}) },
        { value: 15, label: t('analytics.days_collection_volume', {days: 15}) },
        { value: 30, label: t('analytics.days_collection_volume', {days: 30}) },
        { value: 60, label: t('analytics.days_collection_volume', {days: 60})},
        { value: 90, label: t('analytics.days_collection_volume', {days: 90})},
        { value: 120, label: t('analytics.days_collection_volume', {days: 120})},
        { value: 180, label: t('analytics.days_collection_volume', {days: 180})},
        { value: 270, label: t('analytics.days_collection_volume', {days: 270})},
        { value: 365, label: t('analytics.days_collection_volume', {days: 365})},
    ];

    const getChartOption = (search) => {
        return chartDropDownOptions.map(item => item.value).indexOf(search);
    };

    const onSelectChartRange = (e) => {
        if (e.value !== chartRange)
            setChartRange(e.value);
    };

    const defaultChartOption = chartDropDownOptions[getChartOption(chartRange)];

    return (
        <div className="TopCollections AnalyticsComponent">
            <Dropdown
                options={chartDropDownOptions}
                onChange={onSelectChartRange}
                value={defaultChartOption}
                placeholder={t('analytics.days_collection_volume', {days: 120})}
                id="DropdownField"
                disabled={ isLoading ? 'disabled' : '' }
            />
            <div className="TopCollectionsTable">
                <table cellSpacing="0">
                    <tr>
                        <th onClick={() => selectSortBy('volume')}>{t('ranking.rank')}</th>
                        <th onClick={() => selectSortBy('collection')}>{t('profile.collection')}</th>
                        <th />
                        <th onClick={() => selectSortBy('buyers')}>{t('analytics.buyers')}</th>
                        <th onClick={() => selectSortBy('sellers')}>{t('analytics.sellers')}</th>
                        <th onClick={() => selectSortBy('volume')}>{t('analytics.volume')}</th>
                        <th onClick={() => selectSortBy('usdVolume')}>USD {t('analytics.volume')}</th>
                    </tr>
                    { isLoading || !revenueHistory ?
                    <LoadingIndicator /> :
                        revenueHistory.sort((a, b) => (['volume', 'usdVolume', 'sellers', 'buyers'].includes(sortBy) ? (b[sortBy] - a[sortBy]) : ('' + b[sortBy]).localeCompare(a[sortBy])) * sortDir).slice(0, showNum).map((ranking, index) => {
                            return (
                                <tr className="TopCollectionsInfo">
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link href={searchAuthor === ranking['collection'] ? '/stats?collection=*' : `/stats?collection=${ranking['collection']}`}>
                                            <div className={ranking['collection'] === searchAuthor ? "Highlighted cursor-pointer" : 'cursor-pointer'}>
                                                {ranking['collectionName'] ? ranking['collectionName'] : ranking['collection']}
                                            </div>
                                        </Link>
                                    </td>
                                    <td><Link className='cursor-pointer' href={`/collection/${ranking['collection']}`}><div className={"Icon"}><img src={"/link-outline.svg"} /></div></Link></td>
                                    <td>{ranking['buyers']}</td>
                                    <td>{ranking['sellers']}</td>
                                    <td>{formatNumber(ranking['volume'])} WAX</td>
                                    <td>${formatNumber(ranking['usdVolume'])}</td>
                                </tr>
                            );
                        })
                    }
                </table>
                { !isLoading && revenueHistory && showNum < revenueHistory.length ? <ShowMoreOrLessButton showNum={showNum} setShowNum={setShowNum} /> : '' }
                { !isLoading && revenueHistory && showNum >= revenueHistory.length ? <ShowMoreOrLessButton setShowNum={setShowNum} resultsNum={10} showLess={true} /> : '' }
            </div>
        </div>
    );
}

export default TopCollections;
