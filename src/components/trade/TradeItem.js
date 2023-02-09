import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {Context} from "../waxplorer";

import qs from 'qs';

import MiniAssetPreview from "../assetpreview/MiniAssetPreview";
import LoadingIndicator from "../loadingindicator";

const TradeItem = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const trade = props['trade'];

    const { recipient, sender, recipient_assets, sender_assets, offerId, memo } = trade;

    const activeUser = ual['activeUser'];

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const userName = activeUser ? activeUser['accountName'] : values['user'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [error, setError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [declined, setDeclined] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [canceled, setCanceled] = useState(false);

    const [state, dispatch] = useContext(Context);

    useEffect(() => {

    }, []);

    const handleDecline = (tradeInfo) => {
        if (tradeInfo) {
            if (tradeInfo['error']) {
                setError(tradeInfo['error']);
                setIsLoading(false);
            }
            if (tradeInfo['confirmed'])
                setDeclined(true);
            else
                setIsLoading(false);
        }
        setIsLoading(false);
    };

    const handleAccept = (tradeInfo) => {
        if (tradeInfo) {
            if (tradeInfo['error']) {
                setError(tradeInfo['error']);
                setIsLoading(false);
            }
            if (tradeInfo['confirmed'])
                setAccepted(true);
            else
                setIsLoading(false);
        }
        setIsLoading(false);
    };

    const handleCancel = (tradeInfo) => {
        if (tradeInfo) {
            if (tradeInfo['error']) {
                setError(tradeInfo['error']);
                setIsLoading(false);
            }
            if (tradeInfo['confirmed'])
                setCanceled(true);
            else
                setIsLoading(false);
        }
        setIsLoading(false);
    };

    const decline = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_OFFER_ID', payload: offerId });
        dispatch({ type: 'SET_TRADE_OPTION', payload: 'decline' });
        dispatch({ type: 'SET_CALLBACK', payload: (tradeInfo) => handleDecline(tradeInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'handle_trade' });
    };

    const accept = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_OFFER_ID', payload: offerId });
        dispatch({ type: 'SET_TRADE_OPTION', payload: 'accept' });
        dispatch({ type: 'SET_CALLBACK', payload: (tradeInfo) => handleAccept(tradeInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'handle_trade' });
    };

    const cancel = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_OFFER_ID', payload: offerId });
        dispatch({ type: 'SET_TRADE_OPTION', payload: 'cancel' });
        dispatch({ type: 'SET_CALLBACK', payload: (tradeInfo) => handleCancel(tradeInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'handle_trade' });
    };

    const dismissError = () => {
        setError(null);
    };

    return declined || canceled ? '' : (
        <div className="TradeItem">
            <div className={"UserContainer"}><div className="UserName">{sender}</div></div>
            <div className={"UserContainer"}><div className="UserName">{recipient}</div></div>
            <div className="TradeContainer">
                {sender_assets.map(asset => <div className="AddedAsset"><MiniAssetPreview asset={asset} /></div>)}
            </div>
            <div className="SwapIcon"><img src="/swap.svg" /></div>
            <div className="TradeContainer">
                {recipient_assets.map(asset => <div className="AddedAsset"><MiniAssetPreview asset={asset} /></div>)}
            </div>
            { error ? <div className="TradeButtons"><div className="ErrorNote" onClick={dismissError}><img src="/Warning_icn.svg" alt="!" /> {error}</div></div>
                : isLoading ? <div className="TradeButtons"><LoadingIndicator /></div> : userName === recipient ? <div className="TradeButtons">
                <div className="TradeMemo">{`${t('trade.memo')}: ${memo}`}</div>
                    { accepted ? '' : <button className="TradeButton Decline" onClick={decline}>{t('trade.decline')}</button> }
                { accepted ? <div className="CheckDiv"><img src="/check.svg" /></div> : <button className="TradeButton Accept" onClick={accept}>{t('trade.accept')}</button> }
            </div> : userName === sender ? <div className="TradeButtons">
                <div className="TradeMemo">{`${t('trade.memo')}: ${memo ? memo : '-'}`}</div>
                <button className="TradeButton" onClick={cancel}>{t('asset.cancel')}</button>
            </div> : '' }
        </div>
    );
};

export default TradeItem;
