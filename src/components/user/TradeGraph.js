import React, {useEffect, useState} from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {formatNumber} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {get} from "../helpers/Api";
import FixedSearchComponent from "../searchitems/FixedSearchComponent";
import {useTranslation} from "react-i18next";


const TradeGraph = React.memo(props => {
    const {t} = useTranslation('common');
    const userName = props['userName'];
    const [tradeHistory, setTradeHistory] = useState({tradeHistory: [], isLoading: true});
    const isLoading = tradeHistory['isLoading'];

    const getHistory = async (name) => {
        const pHistory = await get('trade-history/' + name, 'statistics');

        setTradeHistory(pHistory);
    };

    useEffect(() => {
        if (userName && process.browser)
            getHistory(userName);
    }, [userName]);

    if (isLoading)
        return <LoadingIndicator/>;

    const chartOptions = {
        title: {
            text: ''
        },
        chart: {
            type: 'spline',
            renderTo: 'Chart',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        yAxis: [{
            title: {
                style: {"color": '#F6C30D', 'font-family': 'inherit', 'font-size': '12pt'},
                offset: -100,
                rotation: 0,
                y: -100,
                align: 'high',
                text: t('asset.average_price'),
            },
            labels: {
                formatter: function() {
                    return formatNumber(this.value) + ' WAX';
                }
            },
            showFirstLabel: false
        }],
        xAxis: {
            type: 'datetime',
            categories: tradeHistory['buyHistory'].map(item => item['date']),
            labels: {
                align: 'center',
                step: Math.round((Object.keys(tradeHistory['buyHistory']).length)/3.0) - 1,
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
                name: t('profile.buy_volume'),
                color: '#F6C30D',
                data: tradeHistory['buyHistory'].map(item => [item['date'], item['price'] ? item['price']: 0] ),
                tooltip: {
                    valueSuffix: ' WAX'
                },
                yAxis: 0,
            },
            {
                borderWidth: 0,
                name: t('profile.sell_revenue'),
                color: '#FEFEFE',
                data: tradeHistory['sellHistory'].map(item => [item['date'], item['price'] ? item['price']: 0] ),
                tooltip: {
                    valueSuffix: ' WAX'
                },
                yAxis: 0,
            }
        ],
        legend: {
            itemStyle: {color: '#FEFEFE'},
        },
    };

    return (
        <div className="HistoryContainer">
            <div className="PriceHistory PageComponent">
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div>
        </div>
    );
});

export default TradeGraph;
