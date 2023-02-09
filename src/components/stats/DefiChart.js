import React, {useContext, useEffect, useState} from 'react';
import get from "../helpers/Api";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {formatNumber} from "../helpers/FormatLinks";
import Dropdown from "react-dropdown";
import LoadingIndicator from "../loadingindicator";
import {useTranslation} from "react-i18next";
import {Context} from "../waxplorer";

const DefiChart = (props) => {
    const {t, i18n} = useTranslation('common');

    const [isLoading, setIsLoading] = useState(true);
    const [revenueHistory, setRevenueHistory] = useState(null);
    const [chartRange, setChartRange] = useState(60);
    const searchAuthor = props['searchAuthor'];
    const [currency, setCurrency] = useState('usd');

    const GetRevenueHistory = async(range, author) => {
        setIsLoading(true);

        setChartRange(range);
        get('defi-graph/' + range + '/' + (author ? author : '*'), 'statistics').then((result) => {setRevenueHistory(result)})

        setIsLoading(false);
    };

    useEffect(() => {
        GetRevenueHistory(chartRange, searchAuthor)
    }, [chartRange, searchAuthor]);

    const chartDropDownOptions = [
        { value: 15, label: t('analytics.day_history', {days: 15})},
        { value: 30, label: t('analytics.day_history', {days: 30})},
        { value: 60, label: t('analytics.day_history', {days: 60})},
        { value: 90, label: t('analytics.day_history', {days: 90})},
        { value: 120, label: t('analytics.day_history', {days: 120})},
        { value: 180, label: t('analytics.day_history', {days: 180})},
        { value: 270, label: t('analytics.day_history', {days: 270})},
        { value: 365, label: t('analytics.day_history', {days: 365})},
    ];

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

    const getChartOption = (search) => {
        return chartDropDownOptions.map(item => item.value).indexOf(search);
    };

    const onSelectChartRange = (e) => {
        GetRevenueHistory(e.value)
    };

    const defaultChartOption = chartDropDownOptions[getChartOption(chartRange)];

    if (isLoading || !revenueHistory || !revenueHistory['revenueHistory'])
        return (
            <div className="MarketChart AnalyticsComponent">
                <Dropdown
                    options={chartDropDownOptions}
                    onChange={onSelectChartRange}
                    value={defaultChartOption}
                    placeholder={t('analytics.day_history', {days: 120})}
                    id="DropdownField"
                    disabled={ isLoading ? 'disabled' : '' }
                />
                <LoadingIndicator />
            </div>
        );

    const items = {
        'revenueHistory': revenueHistory['revenueHistory']
    };

    const chartOptions = {
        title: {
            text: ''
        },
        chart: {
            renderTo: 'Chart',
            height: 300,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            margin: [60, 50, 60, 50]
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
                    return (currency === 'wax' ? '' : '$') + formatNumber(this.value) + (currency === 'wax' ? ' WAX' : '');
                },
            },
            showFirstLabel: false
        }],
        xAxis: {
            categories: items['revenueHistory'] ? items['revenueHistory'].map(item => item['date']) : [],
            labels: {
                style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '11px'},
                align: 'center',
                step: 30
            }
        },
        tooltip: {
            shared: true,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '11px'},
            formatter: function () {
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' + point.series.tooltipOptions.valuePrefix + formatNumber(point.y) + point.series.tooltipOptions.valueSuffix;
                }, '<b>' + this.x + '</b>');
            },
        },
        series: [
            {
                type: 'column',
                borderWidth: 0,
                name: t('analytics.volume'),
                color: '#1A3952',
                data: items['revenueHistory'].map(item => [item['date'], item[currency === 'wax' ? 'revenue' : 'usd_revenue'] ? item[currency === 'wax' ? 'revenue' : 'usd_revenue'] : 0] ),
                tooltip: {
                    valueSuffix: currency === 'wax' ? ' WAX' : '',
                    valuePrefix: currency === 'usd' ? '$' : '',
                    fontSize: 10
                },
                yAxis: 0,
            }
        ],
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
                placeholder={t('analytics.day_history', {days: 120})}
                id="DropdownField"
                disabled={ isLoading ? 'disabled' : '' }
            />
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default DefiChart;
