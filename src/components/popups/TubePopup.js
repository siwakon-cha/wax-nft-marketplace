import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function TubePopup(props) {
    const assets = props['assets'];
    const tubeId = props['tubeId'];
    const lowestMints = props['lowestMints'];

    const receiver = 'tubes.kogs';

    const {t} = useTranslation('common');

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [tubed, setTubed] = useState(false);
    const [error, setError] = useState(null);
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
        const actions = [getBoostAction(activeUser)];

        Object.keys(assets).map(assetId => {
            const asset = assets[assetId];

            if (asset.assets.length > 1) {
                if (lowestMints) {
                    atomicAssetIds.push(asset.assets.filter(
                        asset => asset.status === 'inventory' || asset.status === 'for_sale').sort((a, b) => (
                        a.mint - b.mint))[0].aasset_id);
                } else  {
                    atomicAssetIds.push(asset.assets.filter(
                        asset => asset.status === 'inventory' || asset.status === 'for_sale').sort((a, b) => (
                        b.mint - a.mint))[0].aasset_id);
                }
            } else {
                if (asset.assets[0].status === 'inventory' || asset.assets[0].status === 'for_sale')
                    atomicAssetIds.push(asset.assets[0].aasset_id)
            }
        });
        if (atomicAssetIds.length > 0) {
            const quantity = 5;
            actions.push(
                {
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        to: receiver,
                        quantity: `${quantity.toFixed(8)} WAX`,
                        memo: 'Tube fee'
                    }
                }
            );
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
                        memo: tubeId,
                        asset_ids: atomicAssetIds,
                        to: receiver
                    },
                }
            );
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
        setTubed((!errors || Object.keys(errors).length === 0));
        callBack({transferred: (!errors || Object.keys(errors).length === 0), errors: errors, transactionIds: transactions});
    };

    let transferInfo = t('asset.transfer');

    const transferField = (<button className="PopupSellButton" onClick={transfer}>{transferInfo}</button>);

    const cancel = () => {
        callBack({transferred: tubed, errors: errors, transactionIds: transactions});
        closeCallBack();
    };

    const dismissError = () => {
        setError(null);
    };

    return (
        <Popup
            title={t('search.bulk_transfer')}
            cancel={cancel}
        >
            { tubed ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            {!tubed && Object.keys(transferred).length === 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_create_a_tube_from_assets',
                {number: Object.keys(assets).length, account: receiver})}</div> : '' }
            {
                error ? <div onClick={dismissError}><ErrorMessage error={error} /></div> : ''
            }
            { Object.keys(transferred).length === 0 ? <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { !tubed ? transferField : '' }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default TubePopup;
