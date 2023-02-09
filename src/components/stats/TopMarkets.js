import React, {useEffect, useState} from 'react';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Dropdown from "react-dropdown";
import {formatMarket, formatNumber} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import {useTranslation} from "react-i18next";

function TopMarkets(props) {
    const [chartRange, setChartRange] = useState(1);
    const [revenueHistory, setRevenueHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchAuthor = props['searchAuthor'];
    const {t, i18n} = useTranslation('common');
    const [sortBy, setSortBy] = useState('volume');
    const [sortDir, setSortDir] = useState(1);

    useEffect(() => {
        GetRevenueHistory(chartRange, searchAuthor)
    }, [chartRange, searchAuthor]);

    const getChartResult = (result) => {
        return result;
    };

    const GetRevenueHistory = async(range, author) => {
        setIsLoading(true);

        const result = await get(`market-volume-table/${range}/${(author ? author : '*')}`, 'statistics').then(getChartResult);

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
        { value: 1, label: t('analytics.24h_market_volume') },
        { value: 2, label: t('analytics.days_market_volume', {days: 2}) },
        { value: 3, label: t('analytics.days_market_volume', {days: 3}) },
        { value: 7, label: t('analytics.days_market_volume', {days: 7}) },
        { value: 15, label: t('analytics.days_market_volume', {days: 15}) },
        { value: 30, label: t('analytics.days_market_volume', {days: 30}) },
        { value: 60, label: t('analytics.days_market_volume', {days: 60})},
        { value: 90, label: t('analytics.days_market_volume', {days: 90})},
        { value: 120, label: t('analytics.days_market_volume', {days: 120})},
        { value: 180, label: t('analytics.days_market_volume', {days: 180})},
        { value: 270, label: t('analytics.days_market_volume', {days: 270})},
        { value: 365, label: t('analytics.days_market_volume', {days: 365})},
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
        <div className="TopMarkets AnalyticsComponent">
            <Dropdown
                options={chartDropDownOptions}
                onChange={onSelectChartRange}
                value={defaultChartOption}
                placeholder="For Sale"
                id="DropdownField"
                disabled={ isLoading ? 'disabled' : '' }
            />
            <div className="TopMarketsTable">
                <table cellSpacing="0">
                    <tr>
                        <th onClick={() => selectSortBy('volume')}>{t('ranking.rank')}</th>
                        <th onClick={() => selectSortBy('market')}>{t('search.market')}</th>
                        <th onClick={() => selectSortBy('buyers')}>{t('analytics.buyers')}</th>
                        <th onClick={() => selectSortBy('sellers')}>{t('analytics.sellers')}</th>
                        <th onClick={() => selectSortBy('volume')}>{t('analytics.volume')}</th>
                        <th onClick={() => selectSortBy('usdVolume')}>USD {t('analytics.volume')}</th>
                    </tr>
                    { isLoading || !revenueHistory ?
                    <LoadingIndicator /> :
                        revenueHistory.sort((a, b) => (['volume', 'usdVolume', 'sellers', 'buyers'].includes(sortBy) ? (b[sortBy] - a[sortBy]) : ('' + b[sortBy]).localeCompare(a[sortBy])) * sortDir).map((ranking, index) => {
                            return (
                                <tr className="TopMarketsInfo">
                                    <td>{index + 1}</td>
                                    <td>{formatMarket(ranking['market'])}</td>
                                    <td>{ranking['buyers']}</td>
                                    <td>{ranking['sellers']}</td>
                                    <td>{formatNumber(ranking['volume'])} WAX</td>
                                    <td>${formatNumber(ranking['usdVolume'])}</td>
                                </tr>
                            );
                        })
                    }
                </table>
            </div>
        </div>
    );
}

export default TopMarkets;
