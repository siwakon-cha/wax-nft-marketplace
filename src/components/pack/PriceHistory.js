import React, {useEffect, useState} from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {formatNumber} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {get} from "../helpers/Api";
import {useTranslation} from "react-i18next";


const PriceHistory = React.memo(props => {
    const {t} = useTranslation('common');
    const assetId = props['assetId'];
    const [priceHistory, setPrinceHistory] = useState({priceHistory: [], isLoading: true});
    const isLoading = priceHistory['isLoading'];

    const getHistory = async () => {
        const pHistory = await get('price-history/' + assetId, 'statistics');

        setPrinceHistory(pHistory);
    };

    useEffect(() => {
        getHistory();
    }, [assetId]);

    if (isLoading)
        return <LoadingIndicator/>;

    const chartOptions = {
        title: {
            text: ''
        },
        chart: {
            type: 'column',
            renderTo: 'Chart',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        yAxis: [{
            title: {
                style: {"color": '#F6C30D', 'font-family': 'NUNITO', 'font-size': '12pt'},
                offset: 0,
                rotation: 0,
                y: -20,
                align: 'high',
                text: t('asset.average_price'),
            },
            labels: {
                formatter: function() {
                    return formatNumber(this.value) + ' WAX';
                }
            },
            showFirstLabel: false
        }, {
            gridLineWidth: 0,
            opposite: true,
            title: {
                style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '12pt'},
                offset: 0,
                rotation: 0,
                y: -20,
                align: 'high',
                text: t('asset.amount_sold')
            },
            labels: {
                formatter: function() {
                    return formatNumber(this.value);
                }
            },
            showFirstLabel: false
        }],
        xAxis: {
            type: 'datetime',
            categories: priceHistory['priceHistory'].map(item => item['date']),
            labels: {
                align: 'center',
                step: Math.round((Object.keys(priceHistory['priceHistory']).length)/3.0) - 1,
                style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '10pt'},
            }
        },
        tooltip: {
            shared: true,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            style: {"color": '#FEFEFE', 'font-family': 'NUNITO', 'font-size': '11px'},
        },
        series: [
            {
                borderWidth: 0,
                name: t('asset.average_price'),
                color: '#F6C30D',
                data: priceHistory['priceHistory'].map(item => [item['date'], item['price'] ? item['price']: 0] ),
                tooltip: {
                    valueSuffix: ' WAX'
                },
                yAxis: 0,
            },
            {
                borderWidth: 0,
                name: t('asset.amount_sold'),
                color: '#FEFEFE',
                data: priceHistory['priceHistory'].map(item => [item['date'], item['count'] ? item['count']: 0] ),
                yAxis: 1,
            }
        ],
        legend: {
            itemStyle: {color: '#FEFEFE'},
        },
        credits: {
            enabled: false
        },
    };

    return (
        <div className="HistoryContainer">
            <h3>{t('asset.price_history')}</h3>
            <div className="PriceHistory">
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div>
        </div>
    );
});

export default PriceHistory;
