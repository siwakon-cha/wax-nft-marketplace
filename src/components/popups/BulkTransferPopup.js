import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function BulkTransferPopup(props) {
    const assets = props['assets'];
    const receiver = props['receiver'].trim().toLowerCase();

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

    const transfer = async () => {
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
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        memo: 'nfthive.io bulk transfer',
                        asset_ids: atomicAssetIds,
                        to: receiver
                    },
                }
            );
        }

        if (simpleAssetIds.length > 0) {
            actions.push({
                account: 'simpleassets',
                name: 'transfer',
                authorization: [{
                    actor: userName,
                    permission: activeUser['requestPermission'],
                }],
                data: {
                    from: userName,
                    to: receiver,
                    assetids: simpleAssetIds,
                    memo: 'nfthive.io bulk transfer'
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
                asset => addError(asset, e.message)
            );
            console.log(e);
            setError(e.message);
            transferError = e;
        } finally {
            if (!error && !transferError) {
                Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).map(
                    assetId => transferred.push(assets[assetId])
                );
                setTransferred(true);
            }
        }
        setIsLoading(false);
        callBack({transferred: true, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    let transferInfo = t('asset.transfer');

    const transferField = (<button className="PopupSellButton" onClick={transfer}>{transferInfo}</button>);

    const cancel = () => {
        callBack({transferred: true, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('search.bulk_transfer')}
            cancel={cancel}
        >
            { Object.keys(transferred).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(transferred).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_transfer_assets_to', {number: Object.keys(assets).length, account: receiver})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(transferred).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { transferField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkTransferPopup;
