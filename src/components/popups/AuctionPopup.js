import React, {useEffect, useState} from 'react';

import {formatNumber} from "../helpers/FormatLinks";

import ErrorMessage from "./ErrorMessage";
import {get} from "../helpers/Api";
import {useAsync} from "react-async";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from './Popup';
import {useTranslation} from "react-i18next";

const loadPriceInfo = async (args) => await get("price-info/" + args.assetId);

function AuctionPopup(props) {
    const asset = props['asset'];
    const {t} = useTranslation('common');

    const {assetId, aAssetId, category, number, rarity, variant, author, name, image, standard} = asset;

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];
    const offer = props['offer'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [marketplace, setMarketPlace] = useState(standard === 'atomicassets' ? 'atomicmarket' : 'waxplorercom');
    const closeCallBack = props['closeCallBack'];
    const [collectionFee, setCollectionFee] = useState(null);
    const [sellPrice, setSellPrice] = useState(offer);
    const [showInput, setShowInput] = useState(true);
    const [days, setDays] = useState(1);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const LoadPriceInfo = (assetId) => {
        const { data, error, isLoading } = useAsync( { promiseFn: loadPriceInfo, assetId: assetId } );
        if (data) {
            data.isLoading = false;
            return data;
        }
        return { priceInfo: {}, isLoading: true };
    };

    const getCollectionFee = async (author) => {
        get('collection-fee/'+author).then(result => setCollectionFee(result['fee']))
    };

    useEffect(() => {
       getCollectionFee(author);
    }, []);

    const priceInfo = LoadPriceInfo(assetId);

    const sell = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        const { assetId } = asset;
        closeCallBack();
        setIsLoading(true);
        try {
            const result = await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),{
                    account: 'atomicmarket',
                    name: 'announceauct',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        duration: (days ? parseInt(days) * 24 * 60 * 60 : 0) + (hours ? parseInt(hours) * 60 * 60 : 0) + (minutes ? parseInt(minutes) * 60 : 0),
                        starting_bid: quantity.toFixed(8)+' WAX',
                        seller: userName,
                        maker_marketplace: 'nft.hive',
                        asset_ids: [aAssetId]
                    },
                }, {
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        memo: 'auction',
                        asset_ids: [aAssetId],
                        to: 'atomicmarket'
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({sold: true, market: marketplace, offer: quantity});
        } catch (e) {
            callBack(false, e, assetId);
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    let cut = sellPrice - (0.02 * sellPrice);
    if (collectionFee)
        cut = cut - collectionFee * sellPrice;

    const cancel = () => {
        callBack({sold: false, market: null, offer: 0});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const changeHours = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setHours(val);
    };

    const changeMinutes = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setMinutes(val);
    };

    const changeDays = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setDays(val);
    };

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            <div className="PopupImage"><img src={image} alt="none" /></div>
            <div className="Info">{t('popups.are_you_sure_you_want_to_auction_asset_for_amount', {asset: name, minutes: minutes, hours: hours, days: days, amount: `${formatNumber(sellPrice)} WAX / $${!priceInfo || priceInfo['isLoading'] ? '...' : formatNumber(sellPrice * priceInfo['usd_rate'])}`})}</div>
            <div className="PopupDetails">
                <table>
                    <tbody>
                        <tr><td><b>{t('asset.category')}:</b></td><td>{category}</td></tr>
                        { number && variant?(<tr><td><b>{t('asset.card')}:</b></td><td>{number}{variant}</td></tr>):'' }
                        { rarity ? <tr><td><b>{t('asset.rarity')}:</b></td><td>{rarity}</td></tr> : '' }
                        <tr><td><b>{t('asset.author')}:</b></td><td>{author}</td></tr>
                        {<tr><td><b>{t('asset.lowest_available_price')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['lowest'] ? `${formatNumber(priceInfo['lowest'])} WAX` : '')}{priceInfo['isLoading'] ? '' :
                            <span className='usd' >({priceInfo['lowest_usd'] ? `$${formatNumber(priceInfo['lowest_usd'])}` : '-'})</span>
                        }</td></tr>}
                        {<tr><td><b>{t('asset.average_bought')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['average'] ? `${Math.round(priceInfo['average'] * 100)/100} WAX` : '')}
                        {priceInfo['isLoading'] ? '' :
                            (priceInfo['average_usd'] ? <span className='usd' >/${formatNumber(priceInfo['average_usd'])}</span> : '-')
                        }</td></tr>}
                        {<tr><td><b>{t('asset.last_sold')}:</b></td><td>{priceInfo['isLoading'] ? 'Loading...' : (priceInfo['last_sold'] ? `${Math.round(priceInfo['last_sold'] * 100)/100} WAX` : '')}
                        {priceInfo['isLoading'] ? '' :
                            (priceInfo['last_sold_usd'] ? <span className='usd' >/${formatNumber(priceInfo['last_sold_usd'])}</span> : '-')
                        }</td></tr>}
                        {<tr><td><b>{t('asset.price')}:</b></td><td>
                            {sellPrice ? `${formatNumber(sellPrice)} WAX` : ''}
                        {priceInfo['isLoading'] ? '' :
                            (priceInfo['usd_rate'] ? <span className='usd' >/${formatNumber(sellPrice * priceInfo['usd_rate'])}</span> : '-')
                        }</td></tr>}
                    </tbody>
                </table>
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <div className="LabelBox">
                    <div className="DropdownLabel">{t('search.start_bid')}</div>
                    <input className={showInput ? "SellInput Memo" : "SellInput Hidden" } type="text" onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">{t('popups.days')}</div>
                    <input className={showInput ? "SellInput Memo" : "SellInput Hidden" } placeholder={t('popups.days')} type="text" onChange={changeDays} value={days ? days : ''}/>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">{t('popups.hours')}</div>
                    <input className={showInput ? "SellInput Memo" : "SellInput Hidden" } placeholder={t('popups.hours')} type="text" onChange={changeHours} value={hours ? hours : ''}/>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">{t('popups.minutes')}</div>
                    <input className={showInput ? "SellInput Memo" : "SellInput Hidden" } placeholder={t('popups.minutes')} type="text" onChange={changeMinutes} value={minutes ? minutes : ''}/>
                </div>
                <button className="PopupCancelButton Small" onClick={cancel}>{t('asset.cancel')}</button>
                <button disabled={!sellPrice || ((!days || days === '0') && (!hours || hours === '0') && (!minutes || minutes === '0')) ? 'disabled' : ''} className="PopupSellButton Small" onClick={sell}>{t('popups.auction')}</button>
            </div>
            {collectionFee || collectionFee === 0 ?
                <div className="SellCalc Small">
                    <div>{t('popups.market_fee')}: 2%</div>
                    <div>{`${t('popups.collection_fee')}: ${collectionFee * 100}%`}</div>
                    <div>{t('popups.your_cut')}: {cut} WAX</div>
                </div> : <LoadingIndicator/>
            }

            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default AuctionPopup;
