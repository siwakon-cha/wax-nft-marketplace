import React, {useEffect, useState} from 'react';

import ErrorMessage from './ErrorMessage';
import {get, getDelphiMedian} from "../helpers/Api";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {formatNumber, getVariantName, getRarityName} from "../helpers/FormatLinks";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";


function BuyMissingPopup(props) {
    const asset = props['asset'];

    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [searchResults, setSearchResults] = useState([]);

    const assetsToBuy = [];

    searchResults.map(sale => {
        if (assetsToBuy.length === 0 || !assetsToBuy.map(asset => asset.summaryId).includes(sale.summaryId)) {
            assetsToBuy.push(sale);
        }
    });

    const sum = assetsToBuy.length > 1 ? assetsToBuy.map(a => a.offer).reduce((a, b) => a + b) : 0;
    const sum_usd = assetsToBuy.length > 1 ? assetsToBuy.map(a => a.usd_offer).reduce((a, b) => a + b) : 0;

    let {
        name, author, category, rarity, variant, color, type, border, attr7, attr8, attr9, attr10
    } = asset;

    const getSearchResult = (result) => {
        setIsLoading(false);
        setSearchResults(result);

        return result;
    };

    const searchShit = async(name, author, category, rarity, variant, color, border, type, attr7, attr8, attr9, attr10) => {
        if (!author || author === '*')
            category = '';

        setIsLoading(true);

        const searchPath = `search?term=${name ? (name.includes('#') || name.includes('&') || name.includes('?') ? escape(name) : name) : ''
        }&author=${author ? author : ''}&category=${category ? category : ''}&rarity=${rarity ? rarity : ''
        }&variant=${variant ? (variant.includes('#') || variant.includes('&') || variant.includes('?') ? escape(variant) : variant) : ''
        }&order_by=offer&color=${color ? color : ''}&type=${type ? type : ''}&border=${border ? border : ''
        }&order_dir=ASC&limit=100&search_type=cheapest_missing&exact_search=true&offer_type=market&attr7=${attr7 ? attr7 : ''
        }&attr8=${attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${attr10 ? attr10 : ''
        }&verified=true&owner=${userName}`;

        await get(searchPath).then((result) => getSearchResult(result, searchPath));
    };

    useEffect(() => {
        searchShit(name, author, category, rarity, variant, color, border, type, attr7, attr8, attr9, attr10);
    }, [searchResults.length === 0]);

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    const buy = async () => {
        setIsLoading(true);

        const usd_wax = await getDelphiMedian();

        const actions = [getBoostAction(activeUser)];

        const simpleassetsClaims = [];

        assetsToBuy.sort((a, b) => parseFloat(a.offer) - parseFloat(b.offer)).map(asset => {
            const quantity = parseFloat(asset.offer);
            const orderId = asset.orderId;
            const currency = asset.currency;

            const assetId = asset.assetId;

            const marketplace = asset.market;

            switch (marketplace) {
                case 'atomicmarket': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'atomicmarket',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: 'deposit'
                        },
                    });

                    actions.push({
                        account: 'atomicmarket',
                        name: 'purchasesale',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            buyer: userName,
                            sale_id: orderId,
                            taker_marketplace: 'nft.hive',
                            intended_delphi_median: currency === 'USD' ? Math.round(usd_wax) : 0
                        }
                    });
                }
                    break;
                case 'waxplorercom': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'waxplorercom',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: `purchase:${orderId}`
                        },
                    });
                    simpleassetsClaims.push(assetId);
                }
                    break;
                case 'simplemarket': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'simplemarket',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: '{"nftid": ' + assetId + ', "affiliate_id": 200001}'
                        }
                    });

                    simpleassetsClaims.push(assetId);
                }
                    break;
                case 'wax.stash': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'wax.stash',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: `Sale_id:${orderId} Collection:${asset.author} Referral:waxplorerref`
                        }
                    });
                }
                    break;
                case 'waxinventory': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'waxinventory',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: '{"id":"' + assetId + '","type":"market"}'
                        },
                    });
                    simpleassetsClaims.push(assetId);
                }
                    break;
                case 'market.myth': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'market.myth',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: ''
                        },
                    });

                    actions.push({
                        account: marketplace,
                        name: 'buy',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            assetid: assetId,
                            from: userName,
                            price: `${quantity.toFixed(8)} WAX`,
                            referral: 'waxplorerref'
                        },
                    });
                }
                    break;
                case 'market.place': {
                    actions.push({
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            from: userName,
                            to: 'market.place',
                            quantity: `${quantity.toFixed(8)} WAX`,
                            memo: 'Payment for NFTs | collectables.io'
                        }
                    });
                    actions.push({
                        account: 'market.place',
                        name: 'buy',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            account: userName,
                            listingid: orderId,
                            referral: 'waxplorerref'
                        }
                    });

                    actions.push({
                        account: 'market.place',
                        name: 'withdraw',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            user: userName,
                            assets: [asset.assetId].map((id) => {
                                return {
                                    'contract': asset.standard,
                                    'id': id,
                                    'quantity': asset.standard === 'simpleassets' ? '0.00000000 WAX' : `1 ${asset.name}`
                                }
                            })
                        }
                    });
                    if (asset.standard === 'simpleassets') {
                        simpleassetsClaims.push(assetId);
                    }
                }
                    break;
            }
        });

        if (simpleassetsClaims.length > 0) {
            actions.push({
                account: 'simpleassets',
                name: 'claim',
                authorization: [{
                    actor: userName,
                    permission: activeUser['requestPermission'],
                }],
                data: {
                    claimer: userName,
                    assetids: simpleassetsClaims
                }
            });
        }

        try {
            await activeUser.signTransaction({
                actions: actions
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
        } catch (e) {
            setError(e.message);

            callBack({bought: false, error: e.message});
        }
        setIsLoading(false);
        callBack({bought: true, error: null});
        closeCallBack();
    };

    const buyField = (<button className="PopupBuyButton" onClick={buy}>{t('asset.buy')}</button>);

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            <div className="PopupBody">
                <div className="PopupDetails">
                    <table>
                        <tbody>
                            <tr><td><b>{t('navigation.collection')}:</b></td><td>{author}</td></tr>
                            <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                            { variant ? (<tr><td><b>{getVariantName(t, author, t('asset.variant'))}:</b></td><td>{variant}</td></tr>):'' }
                            { rarity ? <tr><td><b>{getRarityName(t, author, t('asset.rarity'))}:</b></td><td>{rarity}</td></tr> : '' }
                        </tbody>
                    </table>
                </div>
            </div>
            { assetsToBuy.length > 0 ? <div className="Info">{t('popups.are_you_sure_you_want_to_buy_asset_for_amount', {asset: `${assetsToBuy.length} Assets`, amount: `${formatNumber(sum)} WAX/$${formatNumber(sum_usd)}`})}</div> : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }

            <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                {buyField}
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')} /></div> : '' }
        </Popup>
    );
}

export default BuyMissingPopup;
