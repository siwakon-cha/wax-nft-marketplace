import React, {useEffect, useState} from 'react';

import {formatNumber} from "../helpers/FormatLinks";
import {getBoostAction} from "../helpers/WaxApi";
import {post} from "../helpers/Api";

import ErrorMessage from './ErrorMessage';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import CounterInput from "react-counter-input";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

function ClaimDropPopup(props) {
    const drop = props['drop'];
    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [maxClaims, setMaxClaims] = useState(100);
    const [maxClaimable, setMaxClaimable] = useState(0);
    const [currentClaimed, setCurrentClaimed] = useState(0);
    const [claimNum, setClaimNum] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [issuedSupply, setIssuedSupply] = useState(null);
    const [maxSupply, setMaxSupply] = useState(null);
    const [claimed, setClaimed] = useState(false);

    const {author, category, image, offer, dropId, templateId, currency, waxUsd} = drop;

    const parseDrop = (drop) => {
        const data = drop.data;

        if (data && Object.keys(data).includes('rows'))
            data['rows'].map(row => {
                if (Object.keys(row).includes('max_claimable') && row['max_claimable']) {
                    setMaxClaimable(row['max_claimable'])
                }
                if (Object.keys(row).includes('current_claimed')) {
                    setCurrentClaimed(row['current_claimed'])
                }
                if (Object.keys(row).includes('account_limit') && row['account_limit']) {
                    setMaxClaims(row['account_limit'])
                }
                if (Object.keys(row).includes('display_data') && row['display_data']) {
                    const displayData = JSON.parse(row['display_data']);
                    if (displayData && Object.keys(displayData).includes('name')) {
                        setName(displayData['name']);
                    }
                    if (displayData && Object.keys(displayData).includes('description')) {
                        setDescription(displayData['description']);
                    }
                }

            });
    };

    const parseTemplate = (template) => {
        const data = template.data;

        if (data && Object.keys(data).includes('rows'))
            data['rows'].map(row => {
                if (Object.keys(row).includes('issued_supply')) {
                    setIssuedSupply(row['issued_supply'])
                }
                if (Object.keys(row).includes('max_supply')) {
                    setMaxSupply(row['max_supply'])
                }
            });
    };

    const getDrop = async (dropId) => {
        const body = {
            'code': 'atomicdropsx',
            'json': true,
            'limit': 1,
            'lower_bound': dropId,
            'scope': 'atomicdropsx',
            'table': 'drops',
            'upper_bound': dropId
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';

        post(url, body).then(res => parseDrop(res));
    };

    const getTemplate = async (templateId, author) => {
        const body = {
            'code': 'atomicassets',
            'json': true,
            'limit': 1,
            'lower_bound': templateId,
            'scope': author,
            'table': 'templates',
            'upper_bound': templateId
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';

        post(url, body).then(res => parseTemplate(res));
    };

    useEffect(() => {
        Promise.all([
            getDrop(dropId),
            getTemplate(templateId, author),
        ])

    }, [dropId]);

    const claim = async () => {
        const quantity = claimNum * offer;
        closeCallBack();
        setIsLoading(true);
        try {
            const result = await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        to: 'atomicdropsx',
                        quantity: `${quantity.toFixed(8)} WAX`,
                        memo: 'deposit'
                    },
                }, {
                    account: 'atomicdropsx',
                    name: 'claimdrop',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        claimer: userName,
                        drop_id: dropId,
                        referrer: 'waxplorerref',
                        claim_amount: claimNum,
                        country: '',
                        intended_delphi_median: currency === 'USD' ? Math.round(waxUsd * 10000 ) : 0
                    }
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });

            setClaimed(true);
            callBack(true);

        } catch (e) {
            callBack(false, e, dropId);
            setError(e.message);
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const claimField = (<button className="PopupBuyButton" onClick={claim}>{t('asset.buy')}</button>);

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    return (
        <Popup
            title={name ? name : t('asset.claim')}
            cancel={cancel}
        >
            <div className="PopupImage"><img src={image} alt="none" /></div>
            <div className="Info">{t('popups.are_you_sure_you_want_to_buy_num_assets_for_amount', {number: claimNum,
                amount: `${claimNum * offer} WAX`, asset: name})}</div>
            {description ? <div className="Info">{description}</div> : '' }
            <div className="PopupDetails">
                <table>
                    <tbody>
                        <tr><td><b>{t('asset.price')}:</b></td><td>{formatNumber(offer)} WAX</td></tr>
                        <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                        <tr><td><b>{t('asset.author')}:</b></td><td>{author}</td></tr>
                        <tr><td><b>{t('asset.claimed')}:</b></td><td>{`${currentClaimed}/${maxClaimable > 0 ? maxClaimable : ''}`}</td></tr>
                        <tr><td><b>{t('asset.issued')}:</b></td><td>{`${issuedSupply}/${maxSupply > 0 ? maxSupply : ''}`}</td></tr>
                    </tbody>
                </table>
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <CounterInput
                    count={1}
                    min={1}
                    max={maxClaimable ? Math.min(maxClaims, maxClaimable - currentClaimed) : maxClaims}
                    onCountChange={count => setClaimNum(count)}
                />
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                {claimField}
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')} /></div> : '' }
        </Popup>
    );
}

export default ClaimDropPopup;
