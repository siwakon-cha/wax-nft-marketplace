import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {get} from "../helpers/Api";


import qs from 'qs';
import LoadingIndicator from "../loadingindicator";

import TradeItem from "./TradeItem"

const ReceivedTrades = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const tabKey = props['tabKey'];

    const [verified, setVerified] = useState(true);

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
        get(`get-received-trade-offers/${userName}?verified=${verified}`).then(res => {
            setTrades(res);
        })
    };

    useEffect(() => {
        if (tabKey === 'received-offers' && userName) {
            loadReceivedTrades(userName);
        }

    },[tabKey, userName]);

    return trades ? (
        <div className="TradeItemView">
            {trades.map(trade => <TradeItem trade={trade} ual={ual} />)}
        </div>
    ) : <LoadingIndicator/>;
};

export default ReceivedTrades;
