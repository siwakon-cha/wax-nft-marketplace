import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import get from "../helpers/Api";
import {useAsync} from "react-async";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {formatNumber} from "../helpers/FormatLinks";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

const loadPriceInfo = async (args) => await get("price-info/" + args.assetId);

function BidPopup(props) {
    const asset = props['asset'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const offer = props['offer'];

    const {t} = useTranslation('common');

    const LoadPriceInfo = (assetId) => {
        const { data, error, isLoading } = useAsync( { promiseFn: loadPriceInfo, assetId: assetId } );
        if (data) {
            data.isLoading = false;
            return data;
        }
        return { priceInfo: {}, isLoading: true };
    };

    const {
        owner, sender, assetId, category, number, rarity, variant, author, name, image, orderId, bundle, numBids, market
    } = asset;

    const [sellPrice, setSellPrice] = useState(
        numBids === 0 ? offer : offer * (owner === 'waxarena3dk1' ? 1.2 : 1.1));

    const validBid = (price) => {
        if (!price)
            return false;
        return price >= (numBids === 0 ? offer : offer * (owner === 'waxarena3dk1' ? 1.2 : 1.1));
    };

    const marketplace = market;

    const bid = async () => {
        if (!validBid(sellPrice)) {
            setError('Invalid Bid');
            return false;
        }
        const quantity = parseFloat(sellPrice);
        const { assetId } = asset;
        setIsLoading(true);
        try {
            let result;
            switch (marketplace) {
                case 'waxarena3dk1':
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
                                to: 'waxarena3dk1',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: assetId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'waxinventory':
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
                                memo: '{"id":"'+assetId+'","type":"bid"}'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'atomicmarket':
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
                                to: 'atomicmarket',
                                memo: 'deposit',
                                quantity: `${quantity.toFixed(8)} WAX`,
                            },
                        }, {
                            account: 'atomicmarket',
                            name: 'auctionbid',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                auction_id: orderId,
                                bid: `${quantity.toFixed(8)} WAX`,
                                bidder: userName,
                                taker_marketplace: 'nft.hive'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'gpk.market':
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
                                to: 'gpk.market',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'Bid for #'+assetId
                            },
                        }, {
                            account: 'gpk.market',
                            name: 'bid',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                quantity: `${quantity.toFixed(8)} WAX`,
                                assetid: assetId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'market.place':
                    result = await activeUser.signTransaction({
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
                                to: 'market.place',
                                quantity: `${quantity.toFixed(8)} WAX`,
                                memo: 'Bid on NFTs | collectables.io'
                            }
                        },
                        {
                            account: 'market.place',
                            name: 'bid',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                account: userName,
                                listingid: orderId,
                                price: `${quantity.toFixed(8)} WAX`,
                                referral: 'waxplorerref'
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
            }
            callBack(true);
        } catch (e) {
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const bidField = (<button className="PopupBidButton" onClick={bid}>Bid</button>);

    const priceInfo = LoadPriceInfo(assetId);

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const dismissError = () => {
        setError(null);
    };

    const cancel = () => {
        callBack(false);
    }

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            <div className="PopupBody">
                <div className="PopupImage"><img src={image} alt="none" /></div>
                <div className="PopupDetails">
                    <table>
                        <tbody>
                            <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                            { number && variant?(<tr><td><b>Card:</b></td><td>{number}{variant}</td></tr>):'' }
                            { rarity ? <tr><td><b>Rarity:</b></td><td>{rarity}</td></tr> : '' }
                            <tr><td><b>Author:</b></td><td>{author}</td></tr>
                            { bundle ? '' : <tr><td><b>Lowest Available Price:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['lowest'] ? `${formatNumber(priceInfo['lowest'])} WAX` : '')}{priceInfo['isLoading'] ? '' :
                                <span className='usd' >({priceInfo['lowest_usd'] ? `$${formatNumber(priceInfo['lowest_usd'])}` : '-'})</span>
                            }</td></tr> }
                            { bundle ? '' : <tr><td><b>Average Bought:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['average'] ? `${Math.round(priceInfo['average'] * 100)/100} WAX` : '')}
                            {priceInfo['isLoading'] ? '' :
                                (priceInfo['average_usd'] ? <span className='usd' >/${formatNumber(priceInfo['average_usd'])}</span> : '-')
                            }</td></tr> }
                        </tbody>
                    </table>
                    {
                        error ? <div onClick={dismissError}><ErrorMessage error={error} /></div> : ''
                    }
                </div>
            </div>
            <div className="Info">{t('popups.are_you_sure_you_want_to_bid_offer_for_name', {offer: `${sellPrice} WAX`, name: `${name}`})}?</div>
            <div className="Buttons">
                <input className={"SellInput Memo"} type="text" placeholder={t('asset.price')} onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                <button className="PopupCancelButton" onClick={() => callBack(false)}>Cancel</button>
                { userName !== sender && ['waxinventory', 'gpk.market', 'market.place', 'atomicmarket', 'waxarena3dk1'].includes(market) ? bidField : '' }
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default BidPopup;
