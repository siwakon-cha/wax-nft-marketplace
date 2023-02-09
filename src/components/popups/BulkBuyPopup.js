import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {get} from "../helpers/Api";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {sleep} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

function BulkBuyPopup(props) {
    const assets = props['assets'];

    const {t} = useTranslation('common');

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];
    const [errors, setErrors] = useState( {});
    const [bought, setBought] = useState( []);
    const [transactions, setTransactions] = useState( {});

    const maxActions = 100;

    const addError = (assetId, e) => {
        errors[assetId] = e;
        setErrors(errors);
    };

    const addTransaction = (assetId, tx) => {
        transactions[assetId] = tx;
        setTransactions(transactions);
    };

    const getActiveSales = async (assets) => {
        return await get(`active-sales?assets=${Object.keys(assets).toString()}&sales=${Object.keys(assets).map(assetId => assets[assetId].orderId).filter(orderId => orderId)}`);
    };

    const buy = async () => {
        setIsLoading(true);

        let currentAction = 0;

        const stillActive = await getActiveSales(assets);

        Object.keys(assets).map(assetId => {
            if (!stillActive.includes(assetId) && !stillActive.includes(parseInt(assetId))) {
                addError(assetId, 'Already sold');
            }
        });

        while (currentAction < stillActive.length / maxActions) {
            const start = currentAction * maxActions;
            const end = start + maxActions;
            const actions = [getBoostAction(activeUser)];

            const simpleassetsClaims = [];
            let sellError = null;

            stillActive.sort((a, b) => parseFloat(a.offer) - parseFloat(b.offer)).slice(start, end).map(assetId => {
                const asset = assets[assetId];

                const quantity = parseFloat(asset.offer);
                const orderId = asset.orderId;
                const currency = asset.currency;

                const marketplace = asset.market;

                const usd_wax = asset.usd_wax;

                switch (marketplace) {
                    case 'atomicmarket': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'atomicmarket',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'deposit'
                            },
                        });

                        actions.push({
                            account: 'atomicmarket',
                            name: 'purchasesale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                buyer: userName,
                                sale_id: orderId,
                                taker_marketplace: 'nft.hive',
                                intended_delphi_median: currency === 'USD' ? Math.round(usd_wax * 10000) : 0
                            }
                        });
                    }
                    break;
                    case 'waxplorercom': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'waxplorercom',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: `purchase:${orderId}`
                            },
                        });
                        simpleassetsClaims.push(assetId);
                    }
                    break;
                    case 'simplemarket': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'simplemarket',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: '{"nftid": ' + assetId + ', "affiliate_id": 200001}'
                            }
                        });

                        simpleassetsClaims.push(assetId);
                    }
                        break;
                    case 'wax.stash': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'wax.stash',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: `Sale_id:${orderId} Collection:${asset.author} Referral:waxplorerref`
                            }
                        });
                    }
                    break;
                    case 'waxinventory': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'waxinventory',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: '{"id":"' + assetId + '","type":"market"}'
                            },
                        });
                        simpleassetsClaims.push(assetId);
                    }
                    break;
                    case 'market.myth': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'market.myth',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: ''
                            },
                        });

                        actions.push({
                            account: marketplace,
                            name: 'buy',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                assetid: assetId,
                                from: userName,
                                price: `${quantity.toFixed(8)} WAX`,
                                referral: 'waxplorerref'
                            },
                        });
                    }
                    break;
                    case 'market.place': {
                        actions.push({
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'market.place',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'Payment for NFTs | collectables.io'
                            }
                        });
                        actions.push({
                            account: 'market.place',
                            name: 'buy',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                account: userName,
                                listingid: orderId,
                                referral: 'waxplorerref'
                            }
                        });

                        actions.push({
                            account: 'market.place',
                            name: 'withdraw',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                user: userName,
                                assets: [asset.assetId].map((id) => {
                                    return {
                                        'contract': asset.standard,
                                        'id': id,
                                        'quantity': asset.standard === 'simpleassets' ? '0.00000000 WAX' : `1 ${asset.name}`
                                    }
                                })
                            }
                        });
                        if (asset.standard === 'simpleassets') {
                            simpleassetsClaims.push(assetId);
                        }
                    }
                    break;
                }
            });

            if (simpleassetsClaims.length > 0) {
                actions.push({
                    account: 'simpleassets',
                    name: 'claim',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        claimer: userName,
                        assetids: simpleassetsClaims
                    }
                });
            }

            try {
                const result = await activeUser.signTransaction({
                    actions: actions
                }, {
                    expireSeconds: 300, blocksBehind: 0,
                });

                Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).slice(start, end).map(
                    assetId => addTransaction(assetId, result['transactionId'])
                );
            } catch (e) {
                Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).slice(start, end).map(
                    assetId => addError(assetId, e.message)
                );
                console.log(e);
                setError(e.message);
                sellError = e;
            } finally {
                currentAction += 1;
                if (!error && !sellError) {
                    Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).slice(start, end).map(
                        assetId => bought.push(assets[assetId])
                    );
                    setBought(bought);
                }
                if (currentAction < Object.keys(assets).length / maxActions) {
                    sleep(500);
                }
            }
        }
        setIsLoading(false);
        callBack({bought: bought, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    let sellInfo = t('asset.buy');

    const buyField = (<button className="PopupSellButton" onClick={buy}>{sellInfo}</button>);

    const cancel = () => {
        callBack({bought: bought, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('asset.buy')}
            cancel={cancel}
        >
            { Object.keys(bought).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(bought).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_buy_asset_for_amount', {asset: `${Object.keys(assets).length} Assets`, amount: `${Object.keys(assets).map(asset => assets[asset].offer).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0)} WAX`})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(bought).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { buyField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkBuyPopup;
