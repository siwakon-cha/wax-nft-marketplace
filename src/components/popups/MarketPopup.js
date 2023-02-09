import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";


function MarketPopup(props) {
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
    const offer = props['offer'];

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

        let transferError = null;

        const atomicAssetIds = [];
        const simpleAssetIds = [];
        const actions = [getBoostAction(activeUser)];

        Object.keys(assets).map(assetId => {
            const asset = assets[assetId];

            if (asset.standard === 'atomicassets')
                atomicAssetIds.push(asset.aAssetId);
            else if (asset.standard === 'simpleassets')
                simpleAssetIds.push(asset.assetId);
        });

        if (atomicAssetIds.length > 0) {
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
                        asset_ids: atomicAssetIds,
                        listing_price: parseFloat(offer).toFixed(8) + ' WAX'
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
                        sender_asset_ids: atomicAssetIds,
                        recipient_asset_ids: [],
                        memo: 'sale'
                    },
                }
            );
        }

        if (simpleAssetIds.length > 0) {
            actions.push({
                account: 'waxplorercom',
                name: 'announcesale',
                authorization: [{
                    actor: userName,
                    permission: activeUser['requestPermission'],
                }],
                data: {
                    seller: userName,
                    asset_ids: simpleAssetIds,
                    listing_price: parseFloat(offer).toFixed(8)+' WAX'
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
                    assetids: simpleAssetIds,
                    memo: 'sale'
                },
            });
        }

        try {
            const result = await activeUser.signTransaction({
                actions: actions
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).map(
                assetId => addTransaction(assetId, result['transactionId'])
            );
        } catch (e) {
            Object.keys(assets).map(
                assetId => addError(assetId, e.message)
            );
            console.log(e);
            setError(e.message);
            transferError = e;
        } finally {
            if (!error && !transferError) {
                Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).map(
                    assetId => sold.push(assets[assetId])
                );
                setSold(sold);
            }
        }
        setIsLoading(false);
        callBack({bundled: sold, errors: errors, transactionIds: transactions});
    };

    let sellInfo = t('asset.sell');

    const sellField = (<button className="PopupSellButton" onClick={sell}>{sellInfo}</button>);

    const cancel = () => {
        callBack({bundled: sold, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('search.bundle')}
            cancel={cancel}
        >
            <div className="PopupTitle">{}</div>
            { Object.keys(sold).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(sold).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_sell_asset_for_amount', {asset: `${Object.keys(assets).length} Assets in a Bundle`, amount: `${offer} WAX`})}</div> : '' }
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

export default MarketPopup;
