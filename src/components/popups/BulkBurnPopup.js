import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {sleep} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

function BulkTransferPopup(props) {
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

    const transfer = async () => {
        setIsLoading(true);

        let transferError = null;

        let currentAction = 0;

        const maxActions = 100;

        while (currentAction < Object.keys(assets).length / maxActions) {
            const start = currentAction * maxActions;
            const end = start + maxActions;
            const actions = [getBoostAction(activeUser)];

            Object.keys(assets).sort((a, b) => parseInt(a.assetId) - parseInt(b.assetId)).slice(start, end).map(assetId => {
                actions.push({
                    account: 'atomicassets',
                    name: 'burnasset',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        asset_owner: userName,
                        asset_id: assetId
                    },
                });
            });

            try {
                const result = await activeUser.signTransaction({
                    actions: actions
                }, {

                    expireSeconds: 300, blocksBehind: 0,
                });
                Object.keys(assets).sort((a, b) => parseInt(a.assetId) - parseInt(b.assetId)).map(
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
                    Object.keys(assets).sort((a, b) => parseInt(a.assetId) - parseInt(b.assetId)).map(
                        assetId => transferred.push(assets[assetId])
                    );
                    setTransferred(true);
                }
            }
            setIsLoading(false);
            callBack({transferred: true, errors: errors, transactionIds: transactions});
            closeCallBack();

            if (currentAction < Object.keys(assets).length / maxActions) {
                sleep(500);
            }
        }
    };

    let transferInfo = t('asset.burn');

    const transferField = (<button className="PopupSellButton" onClick={transfer}>{transferInfo}</button>);

    const cancel = () => {
        callBack({transferred: true, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    const name = t('search.bulk_burn');

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            { Object.keys(transferred).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(transferred).length === 0  ? <div className="Info">{t('popups.are_you_sure_you_want_to_burn_assets', {number: Object.keys(assets).length})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(transferred).length === 0  ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { transferField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkTransferPopup;
