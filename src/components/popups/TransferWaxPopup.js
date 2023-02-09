import React, {useEffect, useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from './Popup';
import {useTranslation} from "react-i18next";

function TransferWaxPopup(props) {
    const {t} = useTranslation('common');

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const wax_balance = props['wax_balance'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];
    const [sellPrice, setSellPrice] = useState();
    const [receiver, setReceiver] = useState('');
    const [memo, setMemo] = useState('');

    useEffect(() => {
    }, []);

    const transfer = async () => {
        if (!sellPrice || !receiver)
            return;
        const quantity = parseFloat(sellPrice);
        closeCallBack();
        setIsLoading(true);
        try {
            const result = await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),
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
                        memo: memo
                    }
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({transferred: true, receiver: receiver, quantity: quantity, error: error});
        } catch (e) {
            console.log(e);
            setError(e.message);
            callBack({transferred: false, receiver: null, quantity: null, error: e.message});
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({transferred: false, receiver: null, quantity: null, error: error});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const changeReceiver = (e) => {
        const val = e.target.value;
        setReceiver(val.trim().toLowerCase());
    };

    const changeMemo = (e) => {
        const val = e.target.value;
        setMemo(val);
    };

    return (
        <Popup
            title={t('asset.transfer')}
            cancel={cancel}
        >
            <div className="Info">WAX {t('navigation.balance')}: {wax_balance} WAX</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changePrice} value={sellPrice ? sellPrice : ''} placeholder={'WAX'}/>
                </div>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeReceiver} value={receiver ? receiver : ''} placeholder={t('asset.receiver')}/>
                </div>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeMemo} value={memo ? memo : ''} placeholder={t('asset.memo')}/>
                </div>
                <button className="PopupSellButton" disabled={!sellPrice || !receiver || (sellPrice > wax_balance) ? 'disabled' : ''} onClick={transfer}>{t('asset.transfer')}</button>
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
            </div>


            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default TransferWaxPopup;
