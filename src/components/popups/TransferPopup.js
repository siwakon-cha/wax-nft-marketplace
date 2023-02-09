import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {get} from "../helpers/Api";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function TransferPopup(props) {

    const asset = props['asset'];
    const {t} = useTranslation('common');

    const {assetId, aAssetId, category, number, rarity, variant, author, name, image, standard} = asset;

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];
    const [receiver, setReceiver] = useState(props['receiver'].trim().toLowerCase());
    const [memo, setMemo] = useState('');

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];

    const transfer = async () => {
        if (!receiver)
            return;
        closeCallBack();
        setIsLoading(true);

        try {
            let result;
            switch (standard) {
                case 'simpleassets':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                                memo: memo
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'atomicassets':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'atomicassets',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                memo: memo,
                                asset_ids: [aAssetId],
                                to: receiver
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'packs.ws':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'packs.ws',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                memo: memo,
                                quantity: `1 ${name}`,
                                to: receiver
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'packs.topps':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'packs.topps',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                memo: memo,
                                quantity: `1 ${name}`,
                                to: receiver
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'pack.worlds':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'pack.worlds',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                memo: memo,
                                quantity: `1 ${name}`,
                                to: receiver
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
            }
            callBack({transferred: true, receiver: receiver});
        } catch (e) {
            callBack(false, e, assetId);
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({transferred: false, receiver: null, offer: 0});
        closeCallBack();
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
            title={name}
            cancel={cancel}
        >
            <div className="PopupImage"><img src={image} alt="none" /></div>
            <div className="Info">{t('popups.are_you_sure_you_want_to_transfer_asset_to', {name: name, account: receiver})}</div>
            <div className="PopupDetails">
                <table>
                    <tbody>
                        <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                        { number && variant?(<tr><td><b>{t('asset.card')}:</b></td><td>{number}{variant}</td></tr>):'' }
                        { rarity ? <tr><td><b>{t('asset.rarity')}:</b></td><td>{rarity}</td></tr> : '' }
                        <tr><td><b>{t('asset.author')}:</b></td><td>{author}</td></tr>
                    </tbody>
                </table>
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeReceiver} value={receiver ? receiver : ''} placeholder={t('asset.receiver')}/>
                </div>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeMemo} value={memo ? memo : ''} placeholder={t('asset.memo')}/>
                </div>
                <div className="Buttons">
                    <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                    <button className="PopupSellButton" disabled={!receiver} onClick={transfer}>{t('asset.transfer')}</button>
                </div>
            </div>

            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default TransferPopup;
