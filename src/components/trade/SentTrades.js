import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {get} from "../helpers/Api";

import {Context} from "../waxplorer";

import qs from 'qs';
import LoadingIndicator from "../loadingindicator";

import TradeItem from "./TradeItem"

const SentTrades = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const tabKey = props['tabKey'];

    const activeUser = ual['activeUser'];

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const userName = activeUser ? activeUser['accountName'] : values['user'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [trades, setTrades] = useState(null);

    const loadReceivedTrades = async (userName) => {
        get(`get-sent-trade-offers/${userName}`).then(res => {
            setTrades(res);
        })
    };

    useEffect(() => {
        if (tabKey === 'sent-offers' && userName) {
            loadReceivedTrades(userName);
        }

    },[tabKey, userName]);

    return trades ? (
        <div className="TradeItemView">
            {trades.map(trade => <TradeItem trade={trade} ual={ual} />)}
        </div>
    ) : <LoadingIndicator/>;
};

export default SentTrades;
