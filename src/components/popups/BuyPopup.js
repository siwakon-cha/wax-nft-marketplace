import React, {useState} from 'react';

import {formatMarket, formatNumber} from "../helpers/FormatLinks";

import ErrorMessage from './ErrorMessage';
import get from "../helpers/Api";
import {useAsync} from "react-async";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import cn from "classnames";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

const loadPriceInfo = async (args) => await get("price-info/" + args.assetId);
const loadPriceInfoPacks = async (args) => await get("price-info-fts/" + args.symbol);

const threshold = 20;

function BuyPopup(props) {
    const asset = props['asset'];

    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [bought, setBought] = useState(false);
    const [currentAction, setCurrentAction] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const { offer, assets, bundle, sender, usd_wax, currency } = asset;
    let {
        owner, market, assetId, category, number, rarity, variant, author, name, image, orderId, standard, symbol
    } = asset;

    const assetIds = [];

    const marketplace = market;
    if (bundle) {
        const a = assets[0];
        assetId = a.assetId;
        owner = a.owner;
        assets.forEach(asset => assetIds.push(asset.assetId));
        category = a.category;
        variant = a.variant;
        rarity = a.rarity;
        author = a.author;
        number = a.number;
        standard = a.standard;
        name = `${a.name} ${assets.length > 1 ? `(Bundle of ${assets.length})` : '(In a Bundle)' }`;
        image = a.image;
    } else {
        if (assetId)
            assetIds.push(assetId);
    }

    const LoadPriceInfo = (assetId) => {
        const { data, error, isLoading } = useAsync( { promiseFn: loadPriceInfo, assetId: assetId } );
        if (data) {
            data.isLoading = false;
            return data;
        }
        return { priceInfo: {}, isLoading: true };
    };

    const LoadPriceInfoPacks = (symbol) => {
        const { data, error, isLoading } = useAsync( { promiseFn: loadPriceInfoPacks, symbol: symbol } );
        if (data) {
            data.isLoading = false;
            return data;
        }
        return { priceInfo: {}, isLoading: true };
    };

    const buy = async () => {
        const quantity = parseFloat(offer);
        closeCallBack();
        setIsLoading(true);

        try {
            let result;
            switch (marketplace) {
                case 'atomicmarket': {
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                        }, {
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
                                intended_delphi_median: currency === 'USD' ? Math.round(usd_wax * 10000 ) : 0
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'waxplorercom':
                {
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                        }, {
                            account: 'simpleassets',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                claimer: userName,
                                assetids: assetIds
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'simplemarket': {
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                                memo: '{"nftid": '+assetId+', "affiliate_id": 200001}'
                            },
                        }, {
                            account: 'simpleassets',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                claimer: userName,
                                assetids: [assetId]
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'nft.hive': {
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'nft.hive',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'purchase:'+orderId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'wax.stash': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                                memo: `Sale_id:${orderId} Collection:${author} Referral:waxplorerref`
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    setBought(true);
                    callBack(true);
                }
                break;
                case 'waxinventory': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                        }, {
                            account: 'simpleassets',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                claimer: userName,
                                assetids: [assetId]
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'market.myth': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
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
                        }, {
                            account: owner,
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
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'gpk.myth': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: owner,
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: ''
                            },
                        }, {
                            account: owner,
                            name: 'buy',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                quantity: `1 ${name}`,
                                from: userName,
                                price: `${quantity.toFixed(8)} WAX`,
                                referral: 'waxplorerref',
                                instant: true
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'ws.myth': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: owner,
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: ''
                            },
                        }, {
                            account: owner,
                            name: 'buy',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                quantity: `1 ${name}`,
                                from: userName,
                                price: `${quantity.toFixed(8)} WAX`,
                                referral: 'waxplorerref',
                                instant: true
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'alcornftswap': {
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'alcornftswap',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'fill|'+orderId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });

                    setBought(true);
                    callBack(true);
                }
                break;
                case 'market.place': {
                    if (!orderId) {
                        throw Error('Invalid Listing Id')
                    }
                    if (assetIds.length === 1) {
                        const actions = [getBoostAction(activeUser),{
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
                        },
                            {
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
                            }, {
                                account: 'market.place',
                                name: 'withdraw',
                                authorization: [{
                                    actor: userName,
                                    permission: activeUser['requestPermission'],
                                }],
                                data: {
                                    user: userName,
                                    assets: assetIds.map((id) => {
                                        return {
                                            'contract': standard,
                                            'id': id,
                                            'quantity': standard === 'simpleassets' ? '0.00000000 WAX' : `1 ${name}`
                                        }
                                    })
                                }
                            }];
                        if (standard === 'simpleassets') {
                            actions.push({
                                account: 'simpleassets',
                                name: 'claim',
                                authorization: [{
                                    actor: userName,
                                    permission: activeUser['requestPermission'],
                                }],
                                data: {
                                    claimer: userName,
                                    assetids: assetIds
                                }
                            })
                        }
                        result = await activeUser.signTransaction({
                            actions: actions
                        }, {

                            expireSeconds: 300, blocksBehind: 0,
                        });

                        setBought(true);
                        callBack(true);
                    } else {
                        if (currentAction === 1) {
                            result = await activeUser.signTransaction({
                                actions: [getBoostAction(activeUser),{
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
                                },
                                    {
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
                                    }]
                            }, {

                                expireSeconds: 300, blocksBehind: 0,
                            });
                            setCurrentAction(2);
                        }

                        if (assetIds.length > threshold && currentAction === 3) {
                            const transferIds = [...assetIds];
                            transferIds.splice(threshold);
                            result = await activeUser.signTransaction({
                                actions: [getBoostAction(activeUser),
                                    {
                                        account: 'market.place',
                                        name: 'withdraw',
                                        authorization: [{
                                            actor: userName,
                                            permission: activeUser['requestPermission'],
                                        }],
                                        data: {
                                            user: userName,
                                            assets: transferIds.map((id) => {
                                                return {
                                                    'contract': 'simpleassets',
                                                    'id': id,
                                                    'quantity': '0.00000000 WAX'
                                                }
                                            })
                                        }
                                    }, {
                                        account: 'simpleassets',
                                        name: 'claim',
                                        authorization: [{
                                            actor: userName,
                                            permission: activeUser['requestPermission'],
                                        }],
                                        data: {
                                            claimer: userName,
                                            assetids: transferIds
                                        }
                                    }]
                            }, {

                                expireSeconds: 300, blocksBehind: 0,
                            });

                            setBought(true);
                            callBack(true);
                        }

                        if (currentAction === 2) {
                            const transferIds = [...assetIds];
                            transferIds.splice(0, threshold);
                            result = await activeUser.signTransaction({
                                actions: [getBoostAction(activeUser),
                                    {
                                        account: 'market.place',
                                        name: 'withdraw',
                                        authorization: [{
                                            actor: userName,
                                            permission: activeUser['requestPermission'],
                                        }],
                                        data: {
                                            user: userName,
                                            assets: transferIds.map((id) => {
                                                return {
                                                    'contract': 'simpleassets',
                                                    'id': id,
                                                    'quantity': '0.00000000 WAX'
                                                }
                                            })
                                        }
                                    }, {
                                        account: 'simpleassets',
                                        name: 'claim',
                                        authorization: [{
                                            actor: userName,
                                            permission: activeUser['requestPermission'],
                                        }],
                                        data: {
                                            claimer: userName,
                                            assetids: transferIds
                                        }
                                    }]
                            }, {

                                expireSeconds: 300, blocksBehind: 0,
                            });
                            if (assetIds.length > threshold) {
                                setCurrentAction(3);
                            } else {
                                setBought(true);
                                callBack(true);
                            }
                        }
                    }
                }
                break;
            }
        } catch (e) {
            callBack(false, e, assetId ? assetId : orderId);
            setError(e.message);
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const priceInfo = symbol ? LoadPriceInfoPacks(symbol) : LoadPriceInfo(assetId);

    const buyField = (<button className="PopupBuyButton" onClick={buy}>{ market === 'atomicmarket' ? `${t('asset.buy')}` : `${t('asset.buy')} (${formatMarket(market ? market : owner)})`}</button>);

    const numActions = assetIds.length > threshold ? 3 : (assetIds.length > 1 ? 2 : 1);

    const buyCollectablesField = (<button className="PopupBuyButton" onClick={buy} style={{'font-size': '11px'}}>{`${currentAction === 1 ? t('asset.buy') : t('asset.claim')} (${formatMarket(market ? market : owner)}${numActions > 1 ? ` ${currentAction}/${numActions}` : '' })`}</button>);

    const marketText = `${formatMarket(market ? market : owner)}`;
    let link = marketText;

    if (owner === 'simplemarket') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={"https://wax.simplemarket.io/products/asset/" + assetId}>{ marketText }</a>)
    } else if (owner === 'waxplorercom') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={"https://nfthive.io/asset/" + assetId}>{ marketText }</a>)
    } else if (owner === 'waxinventory') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={"https://waxinventory.com/app/nft/" + assetId}>{ marketText }</a>)
    } else if (owner === 'market.myth') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={`https://gpk.market/asset/${assetId}`}>{ marketText }</a>)
    } else if (owner === 'alcornftswap') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={`https://wax.alcor.exchange/nft-market/order/${orderId}`}>{ marketText }</a>)
    } else if (owner === 'market.place') {
        link = (<a className="PopupLink" target="_blank" rel="noopener noreferrer" href={`https://collectables.io/listing/${orderId}?ref=waxplorerref`}>{ marketText }</a>)
    }

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    const video = image && image.includes('video:') ? image.replace('video:', 'https://ipfs.hivebp.io/ipfs/') : null;

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            <div className="PopupBody">
                <div className="PopupImage">
                    {video ?
                        <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={
                            image && !image.includes('video:') ? image : image}>
                            <source src={video} />
                            Your browser does not support the video tag.
                        </video> :
                        <img src={image} alt="none" />
                    }
                </div>
                <div className="PopupDetails">
                    <table>
                        <tbody>
                            <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                            { number && variant?(<tr><td><b>{t('asset.card')}:</b></td><td>{number}{variant}</td></tr>):'' }
                            { rarity ? <tr><td><b>{t('asset.rarity')}:</b></td><td>{rarity}</td></tr> : '' }
                            <tr><td><b>{t('asset.author')}:</b></td><td>{author}</td></tr>
                            { bundle ? '' : <tr><td><b>{t('asset.lowest_available_price')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['lowest'] ? `${formatNumber(priceInfo['lowest'])} WAX` : '')}{priceInfo['isLoading'] ? '' :
                                <span className='usd' >({priceInfo['lowest_usd'] ? `$${formatNumber(priceInfo['lowest_usd'])}` : '-'})</span>
                            }</td></tr> }
                            { bundle ? '' : <tr><td><b>{t('asset.average_bought')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['average'] ? `${Math.round(priceInfo['average'] * 100)/100} WAX` : '')}
                            {priceInfo['isLoading'] ? '' :
                                (priceInfo['average_usd'] ? <span className='usd' >/${formatNumber(priceInfo['average_usd'])}</span> : '-')
                            }</td></tr> }
                            {<tr><td><b>{t('asset.lowest_available_price')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['lowest'] ? `${formatNumber(priceInfo['lowest'])} WAX` : '')}{priceInfo['isLoading'] ? '' :
                                <span className='usd' >({priceInfo['lowest_usd'] ? `$${formatNumber(priceInfo['lowest_usd'])}` : '-'})</span>
                            }</td></tr>}
                            {<tr><td><b>{t('asset.last_sold')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['last_sold'] ? `${Math.round(priceInfo['last_sold'] * 100)/100} WAX` : '')}
                            {priceInfo['isLoading'] ? '' :
                                (priceInfo['last_sold_usd'] ? <span className='usd' >/${formatNumber(priceInfo['last_sold_usd'])}</span> : '-')
                            }</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="Info">{t('popups.are_you_sure_you_want_to_buy_asset_for_amount', {amount: `${offer} WAX`, asset: name})}</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            { standard === 'simpleassets' ? <div className="Warning"><div><img src="/Warning_icn.svg" alt="!" /></div><div>{t('popups.buying_from')} {link}</div></div> : '' }
            <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                { userName !== sender && !bought && ['waxplorercom', 'simplemarket', 'waxinventory', 'gpk.myth', 'market.myth', 'alcornftswap', 'wax.stash', 'nft.hive', 'atomicmarket'].includes(market) ? buyField : '' }
                { userName !== sender && !bought && owner === 'market.place' ? buyCollectablesField : '' }
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')} /></div> : '' }
        </Popup>
    );
}

export default BuyPopup;
