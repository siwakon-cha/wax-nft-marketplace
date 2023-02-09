import React, {useEffect, useState} from 'react';

import {formatMarket, formatNumber} from "../helpers/FormatLinks";

import ErrorMessage from "./ErrorMessage";
import {get} from "../helpers/Api";
import {useAsync} from "react-async";
import Dropdown from "react-dropdown";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getCookie, setCookie} from "../helpers/cookies";
import {getBoostAction} from "../helpers/WaxApi";
import Popup from "./Popup";
import {useTranslation} from "react-i18next";

const loadPriceInfo = async (args) => await get("price-info/" + args.assetId);
const loadPriceInfoPacks = async (args) => await get("price-info-fts/" + args.symbol);

function SellPopup(props) {

    const asset = props['asset'];
    const {t} = useTranslation('common');

    const {assetId, aAssetId, category, number, rarity, variant, author, name, image, standard, symbol, amount} = asset;

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const getMarket = (asset) => {
        const standard = asset['standard'];
        if (standard === 'atomicassets')
            return 'atomicmarket';

        if (standard === 'simpleassets' && !symbol)
            return getCookie('market_new') ? getCookie('market_new') : 'waxplorercom';

        return 'nft.hive';
    };

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [marketplace, setMarketPlace] = useState(getMarket(asset));
    const closeCallBack = props['closeCallBack'];
    const [collectionFee, setCollectionFee] = useState(null);
    const [sellPrice, setSellPrice] = useState(0);
    const [sellAmount, setSellAmount] = useState(1);
    const [showInput, setShowInput] = useState(false);

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

    const getCollectionFee = async (author) => {
        get('collection-fee/'+author).then(result => setCollectionFee(result['fee']))
    };

    useEffect(() => {
       getCollectionFee(author);
    }, []);

    const priceInfo = symbol ? LoadPriceInfoPacks(symbol) : LoadPriceInfo(assetId);

    const sell = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        const { assetId } = asset;
        closeCallBack();
        setIsLoading(true);

        try {
            let result;
            switch (marketplace) {
                case 'simplemarket':
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
                                to: 'simplemarket',
                                assetids: [assetId],
                                memo: '{"price": "'+quantity.toFixed(8)+' WAX", "affiliate_id": 200001}'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'waxplorercom':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'waxplorercom',
                            name: 'announcesale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                seller: userName,
                                asset_ids: [assetId],
                                listing_price: quantity.toFixed(8)+' WAX'
                            },
                        }, {
                            account: 'simpleassets',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'waxplorercom',
                                assetids: [assetId],
                                memo: 'sale'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'nft.hive':
                    const actions = [getBoostAction(activeUser)];

                    for (let i = 0; i < sellAmount; ++i) {
                        actions.push({
                            account: standard,
                            name: standard === 'simpleassets' ? 'transferf' : 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: standard === 'simpleassets' ? {
                                from: userName,
                                to: 'nft.hive',
                                author: 'a.rplanet',
                                quantity: 1.0.toFixed(4) + ' ' + symbol,
                                memo: 'NFTHive List'
                            } : {
                                from: userName,
                                to: 'nft.hive',
                                symbol: symbol,
                                quantity: 1 + ' ' + symbol,
                                memo: 'NFTHive List'
                            },
                        });
                        actions.push({
                            account: 'nft.hive',
                            name: 'createsale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: standard === 'simpleassets' ? {
                                seller: userName,
                                quantity: 1.0.toFixed(4) + ' ' + symbol,
                                listing_price: quantity.toFixed(8)+' WAX'
                            } : {
                                seller: userName,
                                quantity: 1 + ' ' + symbol,
                                listing_price: quantity.toFixed(8)+' WAX'
                            },
                        });
                    }

                    result = await activeUser.signTransaction({
                        actions: actions
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'atomicmarket':
                    result = await activeUser.signTransaction({
                        actions: [getBoostAction(activeUser),{
                            account: 'atomicmarket',
                            name: 'announcesale',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                seller: userName,
                                maker_marketplace: 'nft.hive',
                                settlement_symbol: '8,WAX',
                                asset_ids: [aAssetId],
                                listing_price: quantity.toFixed(8)+' WAX'
                            },
                        }, {
                            account: 'atomicassets',
                            name: 'createoffer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                sender: userName,
                                recipient: 'atomicmarket',
                                sender_asset_ids: [aAssetId],
                                recipient_asset_ids: [],
                                memo: 'sale'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'wax.stash':
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
                                to: 'wax.stash',
                                assetids: [assetId],
                                memo: 'WAX:'+quantity.toFixed(2)
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'waxinventory':
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
                                to: 'waxinventory',
                                assetids: [assetId],
                                memo: '{"price": "'+quantity.toFixed(8)+' WAX","type":"market"}'
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'market.myth':
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
                                to: 'market.myth',
                                assetids: [assetId],
                                memo: ''
                            },
                        }, {
                            account: 'market.myth',
                            name: 'sell',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                price: quantity.toFixed(8)+' WAX',
                                assetid: assetId
                            },
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
                case 'alcornftswap':
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
                                to: 'alcornftswap',
                                assetids: [assetId],
                                memo: 'place|'+quantity.toFixed(8)+' WAX@eosio.token'
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
                            account: 'simpleassets',
                            name: 'transfer',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                from: userName,
                                to: 'market.place',
                                assetids: [assetId],
                                memo: 'List on collectables.io'
                            }
                        },
                        {
                            account: 'market.place',
                            name: 'list',
                            authorization: [{
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            }],
                            data: {
                                account: userName,
                                assets: [{
                                    contract: 'simpleassets',
                                    id: assetId,
                                    quantity: '0.00000000 WAX'
                                }],
                                price: `${quantity.toFixed(8)} WAX`,
                                description: '',
                                is_auction: false,
                                auction: null
                            }
                        }]
                    }, {

                        expireSeconds: 300, blocksBehind: 0,
                    });
                break;
            }
            callBack({sold: true, market: marketplace, offer: quantity});
        } catch (e) {
            callBack(false, e, assetId);
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };


    const gpkDropDownOptions = [
      { value: 'waxplorercom', label: formatMarket('waxplorercom') },
      { value: 'simplemarket', label: formatMarket('simplemarket') },
      { value: 'wax.stash',  label: formatMarket('wax.stash') },
      { value: 'market.myth',  label: formatMarket('market.myth') },
      { value: 'waxinventory', label: formatMarket('waxinventory') }
    ];

    const onSelectMarketplace = (e) => {
        setMarketPlace(e.value);
        setCookie('market_new', e.value);
    };

    const getGPKOption = () => {
        let option = 0;
        if (marketplace === 'waxplorercom')
            option = 0;
        if (marketplace === 'simplemarket')
            option = 1;
        if (marketplace === 'wax.stash')
            option = 2;
        if (marketplace === 'market.myth')
            option = 3;
        if (marketplace === 'waxinventory')
            option = 4;

        return { value: gpkDropDownOptions[option].value, label: gpkDropDownOptions[option].label };
    };


    const dropDownOptions = [
      { value: 'waxplorercom', label: formatMarket('waxplorercom') },
      { value: 'simplemarket', label: formatMarket('simplemarket') },
      { value: 'waxinventory', label: formatMarket('waxinventory') },
    ];

    if (['cryptotwerpz'].includes(author)) {
        dropDownOptions.push({ value: 'wax.stash', label: formatMarket('wax.stash') });
    }


    const getOption = () => {
        let option = 0;
        if (marketplace === 'waxplorercom')
            option = 0;
        if (marketplace === 'simplemarket')
            option = 1;
        if (marketplace === 'waxinventory')
            option = 2;
        if (marketplace === 'wax.stash')
            option = 3;

        if (option >= dropDownOptions.length) {
            option = 0;
        }

        return { value: dropDownOptions[option].value, label: dropDownOptions[option].label };
    };

    const marketPlaceDropdown = (
        <div className="MarketDropdown">
            <div className="SettingsElement">
                <Dropdown
                    options={['gpk.topps', 'shatner'].includes(author) ? gpkDropDownOptions : dropDownOptions}
                    onChange={onSelectMarketplace}
                    value={['gpk.topps', 'shatner'].includes(author) ? getGPKOption() : getOption()}
                    id="DropdownField short"
                    disabled={ !dropDownOptions || isLoading ? 'disabled' : '' }
                />
            </div>
        </div>
    );

    const cancel = () => {
        callBack({sold: false, market: null, offer: 0});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const changeAmount = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setSellAmount(Math.min(val, amount));
    };

    const increaseAmount = () => {
        if (sellAmount < amount)
            setSellAmount(sellAmount + 1);
    };

    const decreaseAmount = (e) => {
        if (sellAmount > 1)
            setSellAmount(sellAmount - 1);
    };

    const edit = () => {
        setShowInput(!showInput);
    };

    let cut = sellPrice - (0.04 * sellPrice);
    if (collectionFee)
        cut = cut - collectionFee * sellPrice;

    const video = image && image.includes('video:') ? image.replace('video:', 'https://ipfs.hivebp.io/ipfs/') : null;

    return (
        <Popup
            title={name}
            cancel={cancel}
        >
            <div className="PopupBody">
                <div className="PopupImage">
                    {video ?
                        <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={image && !image.includes('video:') ? image : image}>
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
            </div>
            { symbol ? <div className="Info">
                    {t('popups.are_you_sure_you_want_to_sell_x_assets_for_amount', {x: sellAmount, asset: name, amount: `${formatNumber(sellAmount * sellPrice)} WAX / $${!priceInfo || priceInfo['isLoading'] ? '...' : formatNumber(sellAmount * sellPrice * priceInfo['usd_rate'])}`})}
            </div> : <div className="Info">{t('popups.are_you_sure_you_want_to_sell_asset_for_amount', {asset: name, amount: `${formatNumber(sellPrice)} WAX / $${!priceInfo || priceInfo['isLoading'] ? '...' : formatNumber(sellPrice * priceInfo['usd_rate'])}`})}</div> }
            { standard === 'simpleassets' && !symbol ? marketPlaceDropdown : '' }
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <input className={"SellInput Memo"} type="text" placeholder={symbol ? t('asset.price_for_one') : t('asset.price')} onChange={changePrice} value={sellPrice ? sellPrice : ''}/>

                { symbol ?
                    <div className={`SettingsElement Small`}>
                        <div className="DropdownLabel">{t('asset.amount')}</div>
                        <input className={"SellInput Memo"} type="text" placeholder={t('asset.amount')} onChange={changeAmount} value={sellAmount ? sellAmount : ''}/>
                        <div className="SortButtons">
                            <button className={"AscButton outer"} onClick={increaseAmount}><div className={"AscButton inner"} /></button>
                            <button className={"DescButton outer"} onClick={decreaseAmount}><div className={"DescButton inner"} /></button>
                        </div>
                    </div> : '' }

                <button className="PopupCancelButton" onClick={cancel}>{t('asset.cancel')}</button>
                <button className="PopupSellButton" onClick={sell}>{t('asset.sell')}</button>
            </div>
            {collectionFee || collectionFee === 0 ?
                <div className="SellCalc">
                    <div>{t('popups.market_fee')}: 2%</div>
                    <div>{t('popups.defi_fee')}: 2%</div>
                    <div>{`${t('popups.collection_fee')}: ${collectionFee * 100}%`}</div>
                    <div>{t('popups.your_cut')}: {cut} WAX</div>
                </div> : <LoadingIndicator/>
            }


            {isLoading ? <div className="Overlay"><LoadingIndicator text={t('popups.loading_transaction')}/></div> : '' }
        </Popup>
    );
}

export default SellPopup;
