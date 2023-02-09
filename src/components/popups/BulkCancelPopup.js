import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {sleep} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

function BulkCancelPopup(props) {
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
    const [transferred, setTransferred] = useState( []);
    const [transactions, setTransactions] = useState( {});

    const addError = (assetId, e) => {
        errors[assetId] = e;
        setErrors(errors);
    };

    const addTransaction = (assetId, tx) => {
        transactions[assetId] = tx;
        setTransactions(transactions);
    };

    const maxActions = 100;

    const cancelSales = async () => {
        setIsLoading(true);

        let currentAction = 0;

        while (currentAction < Object.keys(assets).length / maxActions) {
            const start = currentAction * maxActions;
            const end = start + maxActions;
            const actions = [getBoostAction(activeUser)];
            const ownerPlaceIds = [];
            const simpleAssetsIds = [];

            let sellError = null;

            Object.keys(assets).sort((a, b) => parseFloat(a.offer) - parseFloat(b.offer)).slice(start, end).map(assetId => {
                const asset = assets[assetId];

                const {market, isAuction, orderId, author} = asset;

                switch(market) {
                    case 'atomicmarket':
                        actions.push({
                            account: market,
                            name: isAuction ? 'cancelauct' : 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: isAuction ? {
                                auction_id: orderId
                            } : {
                                sale_id: orderId
                            },
                        });
                    break;
                    case 'wax.stash':
                        actions.push({
                            account: market,
                            name: 'cancellisting',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                collection_name: author,
                                sale_id: orderId,
                                from: userName
                            },
                        });
                    break;
                    case 'waxarena3dk1':
                        actions.push({
                            account: 'waxarena3dk1',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                asset_id: assetId,
                                winner: userName
                            },
                        });
                    break;
                    case 'alcornftswap':
                        actions.push({
                            account: market,
                            name: 'cancelsell',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                maker: userName,
                                order_id: orderId,
                            },
                        });
                    break;
                    case 'waxinventory':
                        actions.push({
                            account: market,
                            name: 'cancel',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                owner: userName,
                                assetids: [assetId],
                            },
                        });
                        simpleAssetsIds.push(assetId);
                    break;
                    case 'simpleowner':
                        actions.push({
                            account: market,
                            name: 'cancel',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                owner: userName,
                                assetids: [assetId],
                            },
                        });
                    break;
                    case 'waxplorercom':
                        actions.push({
                            account: market,
                            name: 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sale_id: orderId
                            },
                        });
                        simpleAssetsIds.push(assetId);
                    break;
                    case 'market.myth':
                        actions.push({
                            account: market,
                            name: 'dropsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                assetid: assetId,
                            },
                        });
                    break;
                    case 'market.place':
                        actions.push({
                            account: 'market.place',
                            name: 'unlist',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                account: userName,
                                listingid: orderId
                            }
                        });
                        simpleAssetsIds.push(assetId);
                        ownerPlaceIds.push(assetId);
                    break;
                }
            });

            if (ownerPlaceIds.length > 0) {
                actions.push({
                    account: 'market.place',
                    name: 'withdraw',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        user: userName,
                        assets: ownerPlaceIds.map((id) => {
                            return {
                                'contract': 'simpleassets',
                                'id': id,
                                'quantity': '0.00000000 WAX'
                            }
                        })
                    }
                });
            }

            if (simpleAssetsIds.length > 0) {
                actions.push({
                    account: 'simpleassets',
                    name: 'claim',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        claimer: userName,
                        assetids: simpleAssetsIds
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
                        assetId => transferred.push(assets[assetId])
                    );
                    setTransferred(transferred);
                }

                if (currentAction < Object.keys(assets).length / maxActions) {
                    sleep(500);
                }
            }
        }

        setIsLoading(false);
        callBack({transferred: transferred, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    let transferInfo = t('popups.yes');

    const transferField = (<button className="PopupSellButton" onClick={cancelSales}>{transferInfo}</button>);

    const cancel = () => {
        callBack({transferred: true, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('asset.cancel')}
            cancel={cancel}
        >
            { Object.keys(transferred).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(transferred).length === 0 ? <div className="Info">{
                t('popups.are_you_sure_you_want_to_cancel_sales', {number: Object.keys(assets).length})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(transferred).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('popups.no')}</button>
                { transferField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkCancelPopup;
