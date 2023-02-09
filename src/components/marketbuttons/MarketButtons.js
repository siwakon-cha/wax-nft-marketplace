import React, {useState, useContext} from 'react';

import {Context} from '../waxplorer';
import get from "../helpers/Api";
import {formatNumber, formatPercentage, formatRateNumber} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator";
import Link from 'next/link';
import {getBoostAction} from "../helpers/WaxApi";
import cn from "classnames";
import {useTranslation} from "react-i18next";
import Button from "../common/util/input/Button";

const threshold = 20;

function MarketButtons(props) {
    const asset = props['asset'];

    const newOwner = props['newOwner'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const {t} = useTranslation('common');
    const claimed = props['claimed'];
    const claimer = props['claimer'];
    const average = props['average'];
    const onAdd = props['onAdd'];
    const view = props['view'];
    const frontVisible = props['frontVisible'];

    const [currentAction, setCurrentAction] = useState(1);

    const handleSell = props['handleSell'];
    const handleBought = props['handleBought'];
    const handleClaim = props['handleClaim'];
    const handleStake = props['handleStake'];
    const handleUnstake = props['handleUnstake'];
    const handleCancel = props['handleCancel'];
    const handleBidPlaced = props['handleBidPlaced'];
    const swapped = props['swapped'];
    const unstaked = props['unstaked'];
    const staked = props['staked'];
    const bidPlaced = props['bidPlaced'];
    const bought = props['bought'];
    const canceled = props['canceled'];
    const isClaimed = props['isClaimed'];
    const sold = props['sold'];
    const setSold = props['setSold'];
    const error = props['error'];
    const setError = props['setError'];
    const isLoading = props['isLoading'];
    const setIsLoading = props['setIsLoading'];
    const aetherValue = props['aetherValue'];


    const [state, dispatch] = useContext(Context);

    const performLogin = async () => {
        ual.showModal();
    };

    const {sender, assets, bundle, offer, usd_offer, isAuction, orderId, price, usd_price, numBids, active, bidder,
        isBurned, market, upliftium, aether_rate, buyer} = asset;
    let {
        owner, assetId, standard
    } = asset;

    const assetIds = [];

    if (bundle) {
        assets.forEach(asset => assetIds.push(asset.assetId));
    } else {
        assetIds.push(assetId);
    }

    const popError = state && state.error && (
        state.error['asset_id'] === orderId || state.error['asset_id'] === assetId) ? state.error['error'] : null;

    const getOrderId = async (assetId, market, bundle) => {
        const orderId = await get('get-order-id/' + (market ? market + '/' : '') + assetId + '?bundle=' + bundle);
        return orderId ? orderId['orderId'] : null;
    };

    const getPackOrderId = async (symbol, market, seller, offer) => {
        const orderId = await get('get-pack-order-id/' + market + '/' + seller + '/' + symbol + '?offer=' + offer);
        return orderId ? orderId['orderId'] : null;
    };

    const cancel = async () => {
        let { assetId, author, isAuction, assets, orderId, symbol, owner } = asset;

        let { market } = asset;

        if (!market) {
            market = owner;
        }

        setError(null);
        setIsLoading(true);

        let newOrderId = null;

        if (assetId || (assetIds.length > 0 && assetIds[0]))
            newOrderId = await getOrderId(
                assetId ? assetId : assetIds[0], market ? market : owner,
                assets && assets.length > 1);

        if (symbol)
            newOrderId = await getPackOrderId(
                symbol, market ? market : owner, userName, offer
            );

        if (newOrderId)
            orderId = newOrderId;

        try {
            let result;
            switch(market) {
                case 'atomicmarket':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: isAuction ? 'cancelauct' : 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: isAuction ? {
                                auction_id: orderId
                            } : {
                                sale_id: orderId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'wax.stash':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: owner,
                            name: 'cancellisting',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                collection_name: author,
                                sale_id: orderId,
                                from: userName
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'waxarena3dk1':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'waxarena3dk1',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                asset_id: assetId,
                                winner: userName
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'nft.hive':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'nft.hive',
                            name: 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sale_id: orderId,
                            },
                        }, {
                            account: 'nft.hive',
                            name: 'withdraw',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                user: userName,
                                quantity: (author === 'a.rplanet' ? 1.0.toFixed(4) : 1) + ' ' + symbol,
                            },
                        }]
                    }, {
                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'alcornftswap':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: 'cancelsell',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                maker: userName,
                                order_id: orderId,
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'waxinventory':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: 'cancel',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                owner: userName,
                                assetids: [assetId],
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
                    handleCancel(true);
                break;
                case 'simplemarket':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: 'cancel',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                owner: userName,
                                assetids: [assetId],
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'waxplorercom':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: 'cancelsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sale_id: orderId
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
                    handleCancel(true);
                break;
                case 'market.myth':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: market,
                            name: 'dropsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                assetid: assetId,
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleCancel(true);
                break;
                case 'market.place':
                    if (!orderId) {
                        throw Error('Invalid Listing Id')
                    }
                    if (assetIds.length === 1) {
                        result = await activeUser.signTransaction({
                            actions: [getBoostAction(activeUser),
                                {
                                    account: 'market.place',
                                    name: 'unlist',
                                    authorization: [{
                                        actor: userName,
                                        permission: activeUser['requestPermission'],
                                    }],
                                    data: {
                                        account: userName,
                                        listingid: orderId
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
                                        assetids: assetIds
                                    }
                                }]
                        }, {

                            expireSeconds: 300, blocksBehind: 0,
                        });
                        handleCancel(true);
                    } else {
                        if (currentAction === 1) {
                            result = await activeUser.signTransaction({
                                actions: [getBoostAction(activeUser),
                                    {
                                        account: 'market.place',
                                        name: 'unlist',
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
                            handleCancel(true);
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
                                handleCancel(true);
                            }
                        }
                    }
                    break;
            }
        } catch (e) {
            console.log(e);
            setSold(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const claim = async () => {
        let { assetId, market, orderId } = asset;

        setError(null);
        setIsLoading(true);

        try {
            switch(owner) {
                case 'atomicmarket':
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'atomicmarket',
                            name: 'auctclaimbuy',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                auction_id: orderId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleClaim(true);
                    break;
                case 'waxarena3dk1':
                    await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'waxarena3dk1',
                            name: 'claim',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                asset_id: assetId,
                                winner: userName
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                    handleClaim(true);
                    break;
            }
        } catch (e) {
            console.log(e);
            setSold(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const stake = async () => {
        let { assetId, aAssetId, standard } = asset;

        setError(null);
        setIsLoading(true);

        let result;
        try {
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
                                to: 's.rplanet',
                                assetids: [assetId],
                                memo: 'stake'
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
                                memo: 'stake',
                                asset_ids: [aAssetId],
                                to: 's.rplanet',
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
            }
            handleStake(true);
        } catch (e) {
            console.log(e);
            setSold(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const unstake = async () => {
        let { assetId, standard } = asset;

        setError(null);
        setIsLoading(true);

        try {
            await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),{
                    account: 's.rplanet',
                    name: 'unstake',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        asset_ids: [assetId],
                        contract: standard,
                        to: userName
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            handleUnstake(true);
        } catch (e) {
            console.log(e);
            setSold(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const buy = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (bought) => handleBought(bought) });
        dispatch({ type: 'SET_ACTION', payload: 'buy' });
    };

    const sell = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleSell(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'sell' });
    };

    const bid = async () => {
        dispatch({type: 'SET_ASSET', payload: asset});
        dispatch({type: 'SET_SELLPRICE', payload: offer});
        dispatch({type: 'SET_CALLBACK', payload: (bid) => handleBidPlaced(bid)});
        dispatch({type: 'SET_ACTION', payload: 'bid'});
    };

    const disMissError = () => {
        if (popError)
            dispatch({ type: 'SET_ERROR', payload: null});
        setError(null);
    };

    const priceTagClassName = cn('relative max-h-8 py-0 px-1 w-full text-sm');
    const buyContainerClassName = cn(
        'relative font-bold text-white block h-a w-full text-center'
    );
    const buttonClassName = cn(
        'w-24 h-6 text-primary rounded border border-primary outline-none text-sm align-middle font-normal',
        'mt-4 mb-0 mx-auto bg-transparent cursor-pointer hover:font-bold'
    );
    const cancelButtonClassName = cn(
        'w-24 h-6 text-white rounded border border-white outline-none text-sm align-middle font-normal',
        'mt-4 mb-0 mx-auto bg-transparent cursor-pointer hover:font-bold'
    );
    const usdClassName = cn('text-xs');
    
    const defaultPriceTag = price && !sold ? <div className={priceTagClassName}>
                {formatNumber(price)} WAX{usd_price?
        <span className={usdClassName}>{` / $${formatNumber(usd_price)}`}</span>:''}
            </div> : <div className={priceTagClassName} />;

    const sellField = (
        <div className={buyContainerClassName}>
            { defaultPriceTag }
            {['atomicassets', 'simpleassets', 'packs.topps', 'packs.ws', 'pack.worlds'].includes(standard) ?
                <Button className={buttonClassName} onClick={sell}>{t('asset.sell')}</Button> : ''}
        </div>
    );
    const getPriceDiff = (average, offer, asset) => {
        const price_diff = (average - offer) / -average;

        const {author, rarity, variant, name, color, type, border, attr7, attr8, attr9, attr10} = asset;

        return (
            <Link href={`/market?collection=${author}&type=${type}&attr7=${attr7 ? attr7 : ''}&attr8=${
                attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${attr10 ? attr10 : ''}&border=${
                border ? border : ''}&color=${color ? border : ''}&rarity=${rarity ? rarity : ''}&variant=${
                variant ? variant : ''}&term=${escape(name)}&order_by=diff_asc`}>
                <span className={`PriceDiff ${price_diff > 0 ? "Negative" : price_diff < 0 ? "Positive" : "Neutral"}`}>
                    {price_diff > 0? '+' : ''}{formatPercentage(price_diff)} /
                </span>
            </Link>
        );
    };

    const bidField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>
                {average && !bundle ? getPriceDiff(average, offer, asset) : ''}
                {isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t('search.start_bid')}: ` : ''}
                {formatNumber(offer)} WAX{usd_offer?<span className={usdClassName}>{` / $${formatNumber(usd_offer)}`}</span>:''}
            </div>
            <div className={buyContainerClassName}>
                <div className={buttonClassName} onClick={bid}>{t('asset.bid')}
                </div>
            </div>
        </div>);

    const cancelField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>
                {isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t('search.start_bid')}: ` : ''}
                {formatNumber(offer)} WAX{usd_offer?<span className={usdClassName}>{` / $${formatNumber(usd_offer)}`}</span>:''}
            </div>
            <div className={cancelButtonClassName} onClick={cancel}>{t('asset.cancel')}</div>
        </div>
    );

    const unstakeField = (
        <div className={buyContainerClassName}>
            { defaultPriceTag }
            <div className={cancelButtonClassName} onClick={unstake}>{t('asset.unstake')}</div>
        </div>
    );

    const numActions = assetIds.length > threshold ? 3 : (assetIds.length > 1 ? 2 : 1);
    const cancelCollectablesField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>{isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t(
                'search.start_bid')}: ` : ''}{formatNumber(offer)} WAX{usd_offer?<span className={
                    usdClassName}>{` / $${formatNumber(usd_offer)}`}</span>:''}
            </div>
            <div className={cancelButtonClassName} onClick={cancel} disabled={isLoading}>
                {`${currentAction === 1 ? t('asset.cancel') : t('asset.claim')}${
                    numActions > 1 ? ` ${currentAction}/${numActions}` : '' }`}
            </div>
        </div>
    );

    const buyField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>
                {average && !bundle ? getPriceDiff(average, offer, asset) : ''}
                {isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t('search.start_bid')}: ` : ''}{
                    formatNumber(offer)} WAX{usd_offer?<span className={usdClassName}>{
                        ` / $${formatNumber(usd_offer)}`}</span>:''}
                {aether_rate ? <span className="AetherCost">{`Aether Cost: ${formatNumber(aether_rate)}`}</span>:''}
            </div>
            <Button className={buttonClassName} onClick={buy}>{t('asset.buy')}</Button>
        </div>
    );

    const tradeField = (
        <div className={buyContainerClassName}>
            { defaultPriceTag }
            <a href={`/trade?user=${userName}&partner=${owner}&asset_id=${assetId}&tab=new-trade`}><div className={"BuyButton"}>{t('trade.send_offer')}</div></a>
        </div>
    );

    const priceField = (
        <div className={buyContainerClassName}>
            { defaultPriceTag }
            {buyer ? <Link href={`/user/${buyer}`}><div className="Buyer NextLink">{buyer}</div></Link> : ''}
        </div>
    );

    const loginField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>
                {average && !bundle ? getPriceDiff(average, offer, asset) : ''}
                {isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t('search.start_bid')}: ` : ''}{
                    formatNumber(offer)} WAX{usd_offer?<span className={usdClassName}>{` / $${
                        formatNumber(usd_offer)}`}</span>:''}
            </div>
            <div className={buttonClassName} onClick={performLogin}>{t('asset.buy')} ({t('navigation.login')})</div>
        </div>
    );

    const addField = (
        <div className={buyContainerClassName}>
            <div className={buttonClassName} onClick={() => onAdd(asset)}>{t('trade.add')}</div>
        </div>
    );

    const claimAuctionField = (
        <div className={buyContainerClassName}>
            <div className={priceTagClassName}>{isAuction ? `${numBids && numBids > 0 ? t('search.top_bid') : t(
                'search.start_bid')}: ` : ''}{formatNumber(price)} WAX{usd_price?<span className={
                    usdClassName}>{` / $${formatNumber(usd_price)}`}</span>:''}
            </div>
            <div className={buttonClassName} onClick={claim}>{t('asset.claim')}</div>
        </div>
    );

    const claimedField = (
        <div className={buyContainerClassName}>
            {t('asset.claimed_by', {claimer: claimer})}
        </div>
    );

    const claimableAuction = !isClaimed && isAuction && !active && (userName === bidder);
    const auctionClaimed = isClaimed && isAuction && !active;
    const buyable = offer && !isAuction && (!userName || userName !== sender) && !bought && owner && ['nft.hive', 'wax.stash', 'waxplorercom', 'simplemarket', 'waxinventory', 'market.myth', 'gpk.myth', 'ws.myth', 'alcornftswap', 'market.place', 'gpk.market', 'atomicmarket', 'waxarena3dk1'].includes(newOwner ? newOwner : market ? market : owner);
    const unstakable = !unstaked && userName && (userName === sender) && (owner === 's.rplanet' || (newOwner && newOwner === 's.rplanet'));
    const sellable = ['atomicassets', 'simpleassets', 'packs.topps', 'packs.ws', 'pack.worlds'].includes(standard) && !swapped && userName && (userName === owner || newOwner && newOwner === userName) && !offer && (!sold || bought || canceled) && !isClaimed && !staked && !unstakable;
    const checked = !['atomicassets', 'simpleassets', 'packs.topps', 'packs.ws', 'pack.worlds'].includes(standard) && !swapped && userName && (userName === owner || newOwner && newOwner === userName) && !offer && (!sold && (bought || canceled)) && !isClaimed && !staked && !unstakable;
    const biddable = offer && active && isAuction && userName && userName !== sender && !bidPlaced && ['atomicmarket', 'waxplorercom', 'wax.stash', 'simplemarket', 'waxinventory', 'market.myth', 'alcornftswap', 'market.place', 'gpk.market', 'waxarena3dk1'].includes(newOwner ? newOwner : market ? market : owner);
    const cancable = userName && (userName === sender || sold) && (offer || (isAuction && numBids === 0)) && !canceled && ['nft.hive', 'waxplorercom', 'wax.stash', 'simplemarket', 'waxinventory', 'market.myth', 'alcornftswap', 'atomicmarket', 'waxarena3dk1'].includes(newOwner ? newOwner : market ? market : owner);
    const collticancable = userName && (userName === sender || sold) && !canceled && (owner === 'market.place' || (newOwner && newOwner === 'market.place'));
    const tradable = false && owner !== userName && standard === 'atomicassets' && !claimableAuction && !buyable && !unstakable && !sellable && !checked && !biddable && !cancable && !collticancable && !bidPlaced && !staked;
    const priceShowable = !tradable && !checked && !unstakable && !buyable && !sellable && !staked;

    if (isBurned)
        return <div className={frontVisible ? "relative w-full h-20 mb-auto flex flex-wrap justify-between" : "relative w-full h-20 mb-auto flex flex-wrap justify-between hidden"} />;
    return (
        <div className={view === 'full' ? "relative w-full h-20 mb-auto flex flex-wrap justify-between leading-7 top-0" : (frontVisible ? "h-1/2 m-auto" : "h-1/2 m-auto hidden")}>
            { !isLoading && !onAdd && (swapped || checked || auctionClaimed || bidPlaced || staked) ? <div className="CheckDiv">
                <img src="/check.svg" />
            </div> : '' }
            { !isLoading && onAdd ? addField : ''}
            { isLoading ? <LoadingIndicator className={buttonClassName} /> : ''}
            { !isLoading && !onAdd && claimableAuction ? claimAuctionField : ''}
            { !isLoading && !onAdd && claimed && claimer ? claimedField : ''}
            { !isLoading && !onAdd && buyable ? (userName ? buyField : loginField) : ''}
            { !isLoading && !onAdd && unstakable ? unstakeField : ''}
            { !isLoading && !onAdd && sellable ? sellField : ''}
            { !isLoading && !onAdd && priceShowable ? priceField : ''}
            { !isLoading && !onAdd && biddable ? bidField : ''}
            { !isLoading && !onAdd && cancable ? cancelField : ''}
            { !isLoading && !onAdd && collticancable ? cancelCollectablesField : ''}
            { !isLoading && !onAdd && (error || popError) ? <div className="ErrorNote" onClick={disMissError}>{
                error ? error : popError.message}</div> : ''}
            { !isLoading && !onAdd && tradable ? tradeField : ''}
            { !isLoading && aetherValue ? <div className={cn(
                'absolute w-10 h-11 bottom-10 right-0'
            )} onClick={activeUser && activeUser['accountName'] === (newOwner ? newOwner : owner) ? stake : () => {}}>
                <img src="/asset_card/Wabe_winzig.svg" />
                <img className={cn(
                    'absolute w-6 h-6 top-1 left-2'
                )} src="/aether_icon.png" alt="Aether per hour"/>
                <div className={cn(
                    'absolute z-10 text-center w-10 top-6 text-xs'
                )}>{formatRateNumber(aetherValue / 10000.0)}</div>
            </div> : '' }
            { !isLoading && upliftium ? <div className={cn(
                'absolute w-10 h-11 bottom-10 right-0'
            )}><img src="/asset_card/Wabe_winzig.svg" alt="Upliftium per hour"/>
                <img className={cn(
                    'absolute w-6 h-6 top-1 left-2'
                )} src="/upliftium.png" alt="Upliftium per hour"/>
                <div className={cn(
                    'absolute z-10 text-center w-10 top-6 text-xs'
                )}>{formatRateNumber(upliftium)}</div>
            </div> : '' }
        </div>
    );
}

export default MarketButtons;
