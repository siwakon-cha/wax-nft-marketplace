import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {get} from "../helpers/Api";

import SearchComponent from "../searchitems/SearchComponent";
import {Context} from "../waxplorer";

import qs from 'qs';
import LoadingIndicator from "../loadingindicator";
import MiniAssetPreview from "../assetpreview/MiniAssetPreview";
import cn from "classnames";

const TradeView = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const tabKey = props['tabKey'];

    const activeUser = ual['activeUser'];

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const userName = activeUser ? activeUser['accountName'] : values['user'];

    const [partner, setPartner] = useState(values['partner'] ? values['partner'] : '');

    const initAssetId = values['asset_id'];

    const [tempPartner, setTempPartner] = useState(partner);

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const [error, setError] = useState(null);
    const [transferred, setTransferred] = useState(false);
    const [searchPartnerTimer, setSearchPartnerTimer] = useState(null);

    const [initial, setInitial] = useState(true);

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [selectedAssets, setSelectdAssets] = useState({});
    const [addedAssets, setAddedAssets] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [state, dispatch] = useContext(Context);

    const initSelectedAssets = async (assetId) => {
        get('get-min-asset/'+assetId).then(res => {
            selectedAssets[partner] = {};
            selectedAssets[partner][res['assetId']] = {
                assetId: res['assetId'],
                author: res['author'],
                image: res['image'],
                name: res['name'],
                mint: res['mint'],
                standard: res['standard'],
                verified: res['verified'],
            };
        })
    };

    useEffect(() => {
        if (partner && initAssetId && initial) {
            setInitial(false);
            initSelectedAssets(initAssetId);
        }

        if (transferred) {
            setSelectdAssets({});
            setAddedAssets(0);
            setIsLoading(false);
            setTransferred(false);
        }

    }, [tabKey, addedAssets, transferred, userName]);

    const handleTrade = (tradeInfo) => {
        if (tradeInfo) {
            if (tradeInfo['error']) {
                setError(tradeInfo['error']);
                setIsLoading(false);
            }
            if (tradeInfo['transferred'])
                setTransferred(true);
            else
                setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const trade = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSETS', payload: selectedAssets });
        dispatch({ type: 'SET_CALLBACK', payload: (tradeInfo) => handleTrade(tradeInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'trade' });
    };

    const addAsset = (user, asset) => {
        if (!selectedAssets[user])
            selectedAssets[user] = {};

        selectedAssets[user][asset.assetId] = asset;

        setSelectdAssets(selectedAssets);

        setAddedAssets(addedAssets + 1);
    };

    const dismissError = () => {
        setError(null);
    };

    const removeAsset = (name, assetId) => {
        delete selectedAssets[name][assetId];

        setSelectdAssets(selectedAssets);
        setAddedAssets(addedAssets - 1);
    };

    const addedUserAssets = selectedAssets[userName] && Object.keys(selectedAssets[userName]).length > 0  ?
        Object.keys(selectedAssets[userName]).map(assetId =>
            <div className={cn(
                'relative h-48 my-auto mx-4'
            )}>
                <div className={cn(
                    'absolute top-0 left-32 w-6 h-6 z-20 cursor-pointer'
                )}><img src="/mini_asset_card/minus.svg" alt="X" onClick={() => removeAsset(userName, assetId)} /></div>
                <MiniAssetPreview asset={selectedAssets[userName][assetId]} />
            </div>
        ) : '';

    const addedPartnerAssets = selectedAssets[partner] && Object.keys(selectedAssets[partner]).length > 0  ?
        Object.keys(selectedAssets[partner]).map(assetId =>
            <div className={cn(
                'relative h-48 my-auto mx-4'
            )}>
                <div className={cn(
                    'absolute top-0 left-32 w-6 h-6 z-20 cursor-pointer'
                )}><img src="/mini_asset_card/minus.svg" alt="X" onClick={() => removeAsset(partner, assetId)} /></div>
                <MiniAssetPreview asset={selectedAssets[partner][assetId]} />
            </div>
        ) : '';

    const handlePartnerChange = (e) => {
        if (searchPartnerTimer) {
            clearInterval(searchPartnerTimer);
        }
        const val = e.target.value;

        setTempPartner(val);

        setSearchPartnerTimer(setTimeout(function() {
            selectedAssets[val] = {};
            setSelectdAssets(selectedAssets);
            setAddedAssets((selectedAssets[userName] ? Object.keys(selectedAssets[userName]).length : 0) + Object.keys(selectedAssets[val]).length);
            setPartner(val);
        }, 1000));
    };

    return (
        <div className={cn(
            'grid grid-cols-2'
        )}>
            <div className={cn('w-full')}>{userName}</div>
            <div className={cn('w-full')}>
                <div className="SettingsElement"><input
                    type="text"
                    name='partner'
                    placeholder={t('trade.trade_partner')}
                    onChange={(e) => handlePartnerChange(e)}
                    disabled={ (isLoading) ? 'disabled' : '' }
                /></div>
            </div>
            <div className={cn(
                'flex w-full h-80 p-4 border border-primary overflow-x-auto'
            )}>
                {addedUserAssets}
            </div>
            {isLoading ? <div className="TradeLoads"><LoadingIndicator/></div> : <div className="OfferButton">
                {error ? <div className="ErrorNote" onClick={dismissError}>
                    <img src="/Warning_icn.svg" alt="!" /> {error}
                </div> : <button disabled={
                    isLoading ? 'disabled' : ''
                } className="BuyButton Relative" onClick={trade}>{t('trade.send_offer')}</button> }
            </div> }
            <div className={cn(
                'flex w-full h-80 p-4 border border-primary overflow-x-auto'
            )}>
                {addedPartnerAssets}
            </div>
            {tabKey === "new-trade" && userName ? <SearchComponent static={true} trade={true} {...props} searchSettings={{
                'owner': {value: userName, fixed: true},
                'search_type': {value: 'tradable', fixed: true},
                'order_by': {value: 'date', fixed: false},
                'order_dir': {value: 'DESC', fixed: false},
                'minimal': false,
                'tab': 'new-trade',
                'page_component': false,
                'limit': {value: 30, fixed: true},
                'expanded': false
            }} limit = {30} tab={tabKey} onAdd={(asset) => addAsset(userName, asset)} selectedAssets={selectedAssets[userName] ? Object.keys(selectedAssets[userName]) : []} /> : ''}
            {tabKey === "new-trade" && partner && tempPartner === partner && userName !== partner ? <SearchComponent static={true} {...props} trade={true} searchSettings={{
                'owner': {value: partner, fixed: true},
                'search_type': {value: 'tradable', fixed: true},
                'order_by': {value: 'date', fixed: false},
                'order_dir': {value: 'DESC', fixed: false},
                'minimal': false,
                'tab': 'new-trade',
                'page_component': false,
                'limit': {value: 30, fixed: true},
                'expanded': false
            }} limit = {30} tab={tabKey} onAdd={(asset) => addAsset(partner, asset)} selectedAssets={selectedAssets[partner] ? Object.keys(selectedAssets[partner]) : []} /> :
                (partner || tempPartner) && tempPartner !== partner ? <div className="RightLoader"><LoadingIndicator/></div> : ''}
        </div>
    );
};

export default TradeView;
