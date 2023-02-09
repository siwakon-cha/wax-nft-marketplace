import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {sleep} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

function BulkSellPopup(props) {
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
    const [sold, setSold] = useState( []);
    const [transactions, setTransactions] = useState( {});

    const maxActions = 40;

    const addError = (assetId, e) => {
        errors[assetId] = e;
        setErrors(errors);
    };

    const addTransaction = (assetId, tx) => {
        transactions[assetId] = tx;
        setTransactions(transactions);
    };

    const sell = async () => {
        setIsLoading(true);

        let currentAction = 0;

        while (currentAction < Object.keys(assets).length / maxActions) {
            const start = currentAction * maxActions;
            const end = start + maxActions;
            const actions = [getBoostAction(activeUser)];

            let sellError = null;

            Object.keys(assets).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(start, end).map(assetId => {
                const asset = assets[assetId].asset;
                const price = parseFloat(assets[assetId].price);
                const orderId = assets[assetId].asset.orderId;

                if (asset.standard === 'atomicassets') {
                    actions.push(
                        {
                            account: 'atomicmarket',
                            name: 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sale_id: orderId
                            },
                        }
                    );
                    actions.push(
                        {
                            account: 'atomicmarket',
                            name: 'announcesale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                seller: userName,
                                maker_marketplace: 'nft.hive',
                                settlement_symbol: '8,WAX',
                                asset_ids: [assetId],
                                listing_price: price.toFixed(8) + ' WAX'
                            },
                        }
                    );
                    actions.push(
                        {
                            account: 'atomicassets',
                            name: 'createoffer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sender: userName,
                                recipient: 'atomicmarket',
                                sender_asset_ids: [assetId],
                                recipient_asset_ids: [],
                                memo: 'sale'
                            },
                        }
                    );
                } else {
                    actions.push({
                        account: 'waxplorercom',
                        name: 'cancelsale',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            sale_id: orderId
                        },
                    });
                    actions.push({
                        account: 'simpleassets',
                        name: 'claim',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            claimer: userName,
                            assetids: [assetId]
                        }
                    });
                    actions.push({
                        account: 'waxplorercom',
                        name: 'announcesale',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            seller: userName,
                            asset_ids: [assetId],
                            listing_price: price.toFixed(8)+' WAX'
                        },
                    });
                    actions.push({
                        account: 'simpleassets',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'waxplorercom',
                            assetids: [assetId],
                            memo: 'sale'
                        },
                    });
                }
            });

            try {
                const result = await activeUser.signTransaction({
                    actions: actions
                }, {
                    expireSeconds: 300, blocksBehind: 3
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
                        assetId => sold.push(assets[assetId])
                    );
                    setSold(sold);
                }
                if (currentAction < Object.keys(assets).length / maxActions) {
                    sleep(500);
                }
            }
        }
        setIsLoading(false);
        callBack({sold: sold, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    let sellInfo = t('asset.sell');

    const sellField = (<button className="PopupSellButton" onClick={sell}>{sellInfo}</button>);

    const cancel = () => {
        callBack({sold: sold, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('search.bulk_sell')}
            cancel={cancel}
        >
            { Object.keys(sold).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(sold).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_sell_asset_for_amount', {asset: `${Object.keys(assets).length} Assets`, amount: `${Object.keys(assets).map(asset => assets[asset].price).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0)} WAX`})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(sold).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { sellField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkSellPopup;
