import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function TradePopup(props) {
    const assets = props['assets'];

    const {t} = useTranslation('common');

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];
    const [memo, setMemo] = useState('');

    const myAssets = assets[userName];

    const [transferred, setTransferred] = useState(false);

    let partner = '';

    Object.keys(assets).map(trader => {
        if (trader !== userName) {
            partner = trader;
        }
    });

    const partnerAssets = assets[partner];

    const trade = async () => {
        setIsLoading(true);

        let transferError = null;

        try {
            const result = await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),{
                    account: 'atomicassets',
                    name: 'createoffer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        sender: userName,
                        recipient: partner,
                        sender_asset_ids: myAssets ? Object.keys(myAssets) : [],
                        recipient_asset_ids: partnerAssets ? Object.keys(partnerAssets) : [],
                        memo: memo
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            setTransferred(true);
        } catch (e) {
            console.log(e);
            setError(e.message);
            transferError = e;
            callBack({transferred: false, error: transferError ? transferError.message : ''});
        }
        setIsLoading(false);
    };

    let transferInfo = t('trade.send_offer');

    const transferField = (<button className="PopupSellButton" onClick={trade}>{transferInfo}</button>);

    const cancel = () => {
        callBack({transferred: transferred, error: error});
        closeCallBack();
    };

    const changeMemo = (e) => {
        const val = e.target.value;
        setMemo(val);
    };

    return (
        <Popup
            title={t('trade.trade')}
            cancel={cancel}
        >
            { transferred ? <div className="CheckDiv"><img src="/check.svg" /></div> : '' }
            { !transferred ? <div className="Info">{t('popups.are_you_sure_you_want_to_trade_x_items_for_y_items_with_partner', {x: myAssets ? Object.keys(myAssets).length : 0, y: partnerAssets ? Object.keys(partnerAssets).length : 0, partner: partner})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { !transferred ? <div className="Buttons">
                <div className="EditContainer">
                    <input className={"SellInput Memo Large"} type="text" onChange={changeMemo} value={memo ? memo : ''} placeholder={t('asset.memo')}/>
                </div>
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { transferField }
            </div> : '' }
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default TradePopup;
