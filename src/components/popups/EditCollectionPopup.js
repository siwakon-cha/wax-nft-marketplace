import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from './Popup';
import {useTranslation} from "react-i18next";

function EditCollectionPopup(props) {
    const {t} = useTranslation('common');

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const closeCallBack = props['closeCallBack'];

    const editDescription = props['editDescription'];
    const editName = props['editName'];
    const editDisplayName = props['editDisplayName'];
    const editUrl = props['editUrl'];
    const editMarketFee = props['editMarketFee'];
    const editImage = props['editImage'];
    const image = props['image'];
    const collection = props['collectionName'];
    const newCollection = props['newCollection'];

    const [error, setError] = useState(null);

    const edit = async () => {
        setIsLoading(true);

        const actions = [getBoostAction(activeUser)];

        const data = [];

        if (editDescription) {
            data.push({
                'key': 'description',
                'value': ['string', editDescription.replace('edit:Empty', '')]
            });
        }

        if (editName) {
            data.push({
                'key': 'name',
                'value': ['string', editDisplayName.replace('edit:Empty', '')]
            });
        }

        if (editImage) {
            data.push({
                'key': 'img',
                'value': ['string', editImage.replace('edit:Empty', '')]
            });
        }

        if (editUrl) {
            data.push({
                'key': 'url',
                'value': ['string', editUrl.replace('edit:Empty', '')]
            });
        }

        if (newCollection) {
            if (data.length > 0)
                actions.push(
                    {
                        account: 'atomicassets',
                        name: 'createcol',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            author: userName,
                            collection_name: editName,
                            allow_notify: true,
                            authorized_accounts: [userName],
                            notify_accounts: '',
                            market_fee: (parseFloat(editMarketFee) / 100.0).toFixed(2),
                            data: data
                        }
                    }
                );
        } else {
            if (data.length > 0)
                actions.push(
                    {
                        account: 'atomicassets',
                        name: 'setcoldata',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            collection_name: collection,
                            data: data
                        }
                    }
                );

            if (editMarketFee)
                actions.push(
                    {
                        account: 'atomicassets',
                        name: 'setmarketfee',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            collection_name: collection,
                            market_fee: (parseFloat(editMarketFee) / 100.0).toFixed(2),
                        }
                    }
                );
        }

        let transferError = null;
        let transactionId = null;

        try {
            const result = await activeUser.signTransaction({
                actions: actions
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });

            transactionId = result.transactionId;
        } catch (e) {
            transferError = e.message;
            setError(e.message);
        }

        if (!transferError) {
            closeCallBack();
        }

        setIsLoading(false);
        callBack({transferred: !transferError, errors: transferError ? [transferError] : null, transactionId: transactionId});
    };

    const cancel = () => {
        callBack({transferred: false, errors: null, transactionIds: null});
        closeCallBack();
    };

    const dismissError = () => {
        setError(null);
    };

    return (
        <Popup
            title={t('collection.edit_collection')}
            cancel={cancel}
        >
            <div className="Info">{t('popups.do_you_want_to_save_these_changes')}</div>
            <div className="PopupBody">
                <div className="PopupImage"><img src={
                    editImage && editImage !== 'edit:Empty' ? `https://ipfs.hivebp.io/ipfs/${editImage}` : (editImage === 'edit:Empty' ? '/image-outline.svg' : image)
                } alt="none" /></div>
                <div className="PopupDetails">
                    <table>
                        <tbody>
                        {editName ? <tr><td><b>{t('collection.name')}:</b></td><td>{editName.replace('edit:Empty', '')}</td></tr> : '' }
                        {editDescription ? <tr><td><b>{t('collection.description')}:</b></td><td>{editDescription.replace('edit:Empty', '')}</td></tr> : '' }
                        {editUrl ? <tr><td><b>{t('collection.url')}:</b></td><td>{editUrl.replace('edit:Empty', '')}</td></tr> : '' }
                        {editMarketFee ? <tr><td><b>{t('collection.market_fee')}:</b></td><td>{editMarketFee.replace('edit:Empty', '')}</td></tr> : '' }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                error ? <div onClick={dismissError}><ErrorMessage layer={5} error={error} /></div> : ''
            }
            <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                <button className="PopupEditButton" onClick={edit}>{t('collection.save_collection')}</button>
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default EditCollectionPopup;
