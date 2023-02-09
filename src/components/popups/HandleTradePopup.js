import React, {useState} from 'react';

import ErrorMessage from './ErrorMessage';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function HandleTradePopup(props) {
    const offerId = props['offerId'];
    const tradeOption = props['tradeOption'];

    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [confirmed, setConfirmed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const confirm = async () => {
        closeCallBack();
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),{
                    account: 'atomicassets',
                    name: `${tradeOption}offer`,
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        offer_id: offerId
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            setConfirmed(true);
            callBack({confirmed: true, error: null});
        } catch (e) {
            callBack({confirmed: false, error: e.message});
            setError(e.message);
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const tradeField = (<button className="PopupBuyButton" onClick={confirm}>{t('trade.confirm')}</button>);

    const cancel = () => {
        callBack({confirmed: false, error: null});
        closeCallBack();
    };

    let message = '';

    switch (tradeOption) {
        case 'decline': message = t('popups.are_you_sure_you_want_to_decline_trade');
            break;
        case 'accept': message = t('popups.are_you_sure_you_want_to_accept_trade');
            break;
        case 'cancel': message = t('popups.are_you_sure_you_want_to_cancel_trade');
            break;
    }

    return (
        <Popup
            title={t('trade.trade')}
            cancel={cancel}
        >
            <div className="PopupTitle">{}</div>
            <div className="Info">{message}</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { !confirmed ? tradeField : '' }
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')} /></div> : '' }
        </Popup>
    );
}

export default HandleTradePopup;
