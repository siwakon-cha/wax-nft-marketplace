import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function BulkDistributePopup(props) {
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
    const [distributed, setDistributed] = useState( []);
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

    const distribute = async () => {
        setIsLoading(true);

        let currentAction = 0;

        while (currentAction < Object.keys(assets).length / maxActions) {
            const start = currentAction * maxActions;
            const end = start + maxActions;
            const actions = [getBoostAction(activeUser)];

            let distributeError = null;

            Object.keys(assets).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(start, end).map(assetId => {
                const asset = assets[assetId].asset;
                const receiver = assets[assetId].receiver.trim().toLowerCase();

                if (asset.standard === 'atomicassets') {
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
                                memo: 'nfthive.io bulk distribution',
                                asset_ids: [assetId],
                                to: receiver
                            },
                        }
                    );
                } else {
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
                            assetids: [assetId],
                            memo: 'nfthive.io bulk distribution'
                        },
                    });
                }
            });

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
                distributeError = e;
            } finally {
                currentAction += 1;
                if (!error && !distributeError) {
                    Object.keys(assets).sort((a, b) => parseInt(a.value) - parseInt(b.value)).slice(start, end).map(
                        assetId => distributed.push(assets[assetId])
                    );
                    setDistributed(distributed);
                }
            }
        }
        setIsLoading(false);
        callBack({distributed: distributed, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    let distributeInfo = t('search.bulk_distribute');

    const distributeField = (<button className="PopupSellButton" onClick={distribute}>{distributeInfo}</button>);

    const cancel = () => {
        callBack({distributed: distributed, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    return (
        <Popup
            title={t('search.bulk_distribute')}
            cancel={cancel}
        >
            { Object.keys(distributed).length > 0 ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { Object.keys(distributed).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_distribute_assets', {x: Object.keys(assets).length})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { Object.keys(distributed).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { distributeField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BulkDistributePopup;
