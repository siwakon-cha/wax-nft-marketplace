import React, {useContext, useEffect, useState} from 'react';
import get from "../helpers/Api";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {formatCollectionAuthor, formatMarket, formatNumber} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Dropdown from "react-dropdown";
import {useTranslation} from "react-i18next";

function MarketChart(props) {
    const [chartRange, setChartRange] = useState(90);
    const [revenueHistory, setRevenueHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currency, setCurrency] = useState('usd');
    const searchAuthor = props['searchAuthor'];
    const {t, i18n} = useTranslation('common');

    useEffect(() => {
        GetRevenueHistory(chartRange, searchAuthor)
    }, [chartRange, searchAuthor]);

    const getChartResult = (result) => {
        return result;
    };

    const GetRevenueHistory = async(range, author) => {
        setIsLoading(true);
        if (range !== chartRange)
            setChartRange(range);

        const result = await get(`market-volume-graph/${range + 1}/${author ? author : '*'}`, 'statistics').then(getChartResult);

        setRevenueHistory(result);
        setIsLoading(false);
    };

    const currencyDropDownOptions = [
        { value: 'wax', label: 'WAX'},
        { value: 'usd', label: 'USD'},
    ];

    const selectCurrency = (e) => {
        setCurrency(e.value);
    };

    const getCurrencyOption = (search) => {
        return currencyDropDownOptions.map(item => item.value).indexOf(search);
    };

    const defaultCurrencyOption = currencyDropDownOptions[getCurrencyOption(currency)];

    const chartDropDownOptions = [
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
        GetRevenueHistory(e.value, searchAuthor)
    };

    const defaultChartOption = chartDropDownOptions[getChartOption(chartRange)];

    if (isLoading || !revenueHistory['revenueHistory'])
        return (
            <div className="MarketChart AnalyticsComponent">
                <Dropdown
                    options={chartDropDownOptions}
                    onChange={onSelectChartRange}
                    value={defaultChartOption}
                    placeholder={t('analytics.days_market_volume', {days: 120})}
                    id="DropdownField"
                    disabled={ isLoading ? 'disabled' : '' }
                />
                <LoadingIndicator />
            </div>
        );

    const dcolor = {
        'wdny.io': 'rgb(106,255,228)',
        'atomicdropsx': 'rgb(120,255,106)',
        'neftyblocksd': 'rgb(163,106,255)',
        'simplemarket': 'rgb(255, 255, 255)',
        'waxinventory': 'rgb(46, 46, 55)',
        'market.myth': 'rgb(255, 3, 128)',
        'market.place': 'rgb(0, 67, 124)',
        'nft.hive': '#F6C30D',
        'alcornftswap': 'rgb(91,82,159)',
        'wax.stash': 'rgb(211, 14, 20)',
        'atomicmarket': 'rgb(238, 137, 66)',
        'waxarena3dk1': 'rgb(19, 89, 87)',
    }

    const colors = [
        'rgba(255, 255, 255, 0.8)',
        'rgba(255, 255, 255, 0.1)',
        'rgb(55, 124, 255)',
        'rgb(123, 41, 138)',
        'rgb(78, 117, 108)',
        'rgb(228,108,45)',
        'rgb(228,30,33)',
        'rgb(228,65,210)',
        'rgb(48,211,228)',
        '#be3672',
        '#215f28',
        '#6238c7',
        '#2d39fb',
        '#c1c745',
        'rgb(56,234,34)',
        'rgb(234,211,134)',
        'rgb(208,126,151)',
        'rgb(64,134,144)',
        'rgb(144,101,41)',
        'rgb(117,144,123)',
        'rgb(213,59,67)',
        'rgb(163,76,215)',
        'rgb(127,228,153)',
        'rgb(95,83,143)',
        'rgb(143,46,39)',
        'rgb(32,143,101)'
    ];

    const series = [];

    Object.keys(revenueHistory['revenueHistory']).map((object, index) => {
        series.push({
            borderWidth: 0,
            name: formatMarket(object),
            color: Object.keys(dcolor).includes(object) ? dcolor[object] : colors[index % colors.length],
            data: revenueHistory['revenueHistory'][object].map(item => [item['date'], item[currency === 'wax' ? 'revenue' : 'usd_revenue'] ? item[currency === 'wax' ? 'revenue' : 'usd_revenue']: 0] ),
            tooltip: {
                valueSuffix: currency === 'wax' ? ' WAX' : '',
                valuePrefix: currency === 'usd' ? '$' : '',
                fontSize: 10
            },
            yAxis: 0,
            marker: {
                enabled: false
            }
        });
    });

    const chartOptions = {
        title: {
            text: ''
        },
        chart: {
            type: 'spline',
            renderTo: 'Chart',
            height: 350,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            margin: [60, 50, 100, 50],
            plotOptions: {
                spline: {
                    marker: {
                        enabled: false
                    }
                }
            },
        },
        yAxis: [{
            offset: 0,
            maxPadding: 0,
            title: {
                offset: 0,
                style: {"color": '#F6C30D', 'font-family': 'NUNITO', 'font-size': '12pt'},
                rotation: 0,
                y: -20,
                align: 'high',
                text: t('analytics.volume')
            },
            labels: {
                style: {"color": '#F6C30D', 'font-family': 'NUNITO', 'font-size': '11px'},
                formatter: function() {
                    return (currency === 'usd' ? '$' : '') + formatNumber(this.value) + (currency === 'wax' ? ' WAX' : '');
                },
            },
            showFirstLabel: false
        }],
        xAxis: {
            categories: revenueHistory['revenueHistory']['atomicmarket'].map(item => item['date']),
            labels: {
                style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '11px'},
                align: 'center',
                step: chartRange/3
            }
        },
        tooltip: {
            shared: true,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '11px'},
            formatter: function () {
                return this.points.sort(function(a, b) { if (a.point.y > b.point.y) {return -1} else return 1}).reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' + point.series.tooltipOptions.valuePrefix + formatNumber(point.y) + point.series.tooltipOptions.valueSuffix;
                }, '<b>' + this.x + '</b>');
            },
        },
        series: series,
        legend: {
            height: 100,
            itemStyle: {color: '#FEFEFE', overflowY: 'auto', maxHeight: 100},
        },
        credits: {
            enabled: false
        },
    };
    return (
        <div className="MarketChart AnalyticsComponent">
            <Dropdown
                options={currencyDropDownOptions}
                onChange={selectCurrency}
                value={defaultCurrencyOption}
                placeholder={'WAX'}
                id="DropdownField"
                disabled={ isLoading ? 'disabled' : '' }
            />
            <Dropdown
                options={chartDropDownOptions}
                onChange={onSelectChartRange}
                value={defaultChartOption}
                placeholder="For Sale"
                id="DropdownField"
                disabled={ isLoading ? 'disabled' : '' }
            />
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
}

export default MarketChart;
