import React, {useEffect, useState} from 'react';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {formatTransaction, formatMarket, formatDate, formatNumber, formatPercentage} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import {useTranslation} from "react-i18next";
import ShowMoreOrLessButton from '../common/util/input/ShowMoreOrLessButton';
import { CSVLink, CSVDownload } from "react-csv";
import {useQuery} from "react-query";

function TradeHistory(props) {
    const user = props['user'];
    const {t, i18n} = useTranslation('common');
    const [showNum, setShowNum] = useState(10);

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    useEffect(() => {
    }, [user, userName]);

    const { isLoading, error, data } = useQuery(
        `trading-history-${user}`,
        process.browser ? () => get(`trading-history/${user}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const parseAssets = (assets) => {
        return assets.map(asset => asset['asset_id']).join(', ')
    };

    let csvLink = '';

    if (user === userName && data) {
        const csvData = [
            [t('asset.date'), t('search.assets'), t('search.type'), t('search.seller'), t('search.buyer'), t('analytics.maker'), t('analytics.taker'), t('analytics.price'), t('analytics.revenue'), t('analytics.fees'),t('asset.transaction')],
        ];

        data.map((row, index) => {
            csvData.push(
                [
                    formatDate(row['date']),
                    parseAssets(row['assets']),
                    row['transactionType'],
                    row['seller'],
                    row['buyer'],
                    formatMarket(row['maker']),
                    formatMarket(row['taker']),
                    formatNumber(row['usdPrice']),
                    formatNumber(row['usdRevenue']),
                    formatPercentage(row['fees']),
                    row['transactionId']
                ]
            );
        });

        csvLink = <CSVLink data={csvData}>{t('general.download')}</CSVLink>;
    }


    return (
        <div className="HistoryContainer TradingHistory PageComponent">
            <div className="TradingHistoryTable">
                <table cellSpacing="0">
                    <tr>
                        <th>{t('asset.date')}</th>
                        <th>{t('search.assets')}</th>
                        <th>{t('search.type')}</th>
                        <th>{t('search.seller')}</th>
                        <th>{t('search.buyer')}</th>
                        <th>{t('analytics.maker')}</th>
                        <th>{t('analytics.taker')}</th>
                        <th>{t('analytics.price')}</th>
                        <th>{t('analytics.revenue')}</th>
                        <th>{t('analytics.fees')}</th>
                        <th className="TransactionListTransaction">{t('asset.transaction')}</th>
                    </tr>
                    { isLoading || !data ?
                    <LoadingIndicator /> :
                        data.slice(0, showNum).map((row, index) => {
                            return (
                                <tr className={ "TopMarketsInfo" } >
                                    <td>{formatDate(row['date'])}</td>
                                    <td>{parseAssets(row['assets'])}</td>
                                    <td>{row['transactionType']}</td>
                                    <td>{row['seller']}</td>
                                    <td>{row['buyer']}</td>
                                    <td>{formatMarket(row['maker'])}</td>
                                    <td>{formatMarket(row['taker'])}</td>
                                    <td>${formatNumber(row['usdPrice'])}</td>
                                    <td>${formatNumber(row['usdRevenue'])}</td>
                                    <td>{formatPercentage(row['fees'])}</td>
                                    <td>{formatTransaction(row['transactionId'])}</td>
                                </tr>
                            );
                        })
                    }
                </table>
                { !isLoading && data && showNum < data.length ? <ShowMoreOrLessButton showNum={showNum} setShowNum={setShowNum} resultsNum={100} /> : '' }
                { !isLoading && data && showNum >= data.length ? <ShowMoreOrLessButton setShowNum={setShowNum} resultsNum={10} showLess={true} /> : '' }
                { csvLink }
            </div>
        </div>
    );
}

export default TradeHistory;
