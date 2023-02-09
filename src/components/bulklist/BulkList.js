import React, {useState, useContext, useEffect} from 'react';

import {Context} from '../waxplorer';
import {formatNumber} from "../helpers/FormatLinks";
import {formatNumberS} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator";
import MiniAssetPreview from "../assetpreview/MiniAssetPreview";
import cn from "classnames";
import {useTranslation} from "react-i18next";
import BulkItem from "./BulkItem";
import BulkFooter from "./BulkFooter";
import BulkFooterItem from "./BulkFooterItem";

function BulkList(props) {
    const [enteringDecimal, setEnteringDecimal] = useState(false);

    const assets = props['searchResults'];

    const mappedAssets = {};

    assets.map(asset => {
        asset.standard === 'atomicassets' ?
            mappedAssets[''+asset['aAssetId']] = asset
        : mappedAssets[''+asset['assetId']] = asset
    });

    const initSellPrices = (assets) => {
        const sellPrices = {};

        assets.filter(asset => asset.standard === 'atomicassets' ? asset['aAssetId'] : asset['assetId']).map((asset, index) => {
            const {aAssetId, standard, assetId, offer} = asset;

            const localId = standard === 'atomicassets' ? aAssetId : assetId;

            if (offer) {
                sellPrices[localId] = {price: offer, asset: mappedAssets[localId]};
            }
        });

        return sellPrices;
    };

    const initBuyPrices = (assets) => {
        const buyPrices = {};

        assets.filter(asset => asset.standard === 'atomicassets' ? asset['aAssetId'] : asset['assetId']).map((asset, index) => {
            const {aAssetId, standard, assetId, offer} = asset;

            const localId = standard === 'atomicassets' ? aAssetId : assetId;

            if (offer) {
                buyPrices[localId] = {price: offer, asset: mappedAssets[localId]};
            }
        });

        return buyPrices;
    };

    const {t} = useTranslation('common');
    const [sellPrices, setSellPrices] = useState({});
    const [buyPrices, setBuyPrices] = useState({});
    const [sellPricesLength, setSellPricesLength] = useState(Object.keys(sellPrices).length);
    const [buyPricesLength, setBuyPricesLength] = useState(Object.keys(buyPrices).length);
    const [sellPricesValue, setSellPricesValue] = useState(Object.keys(sellPrices).map(
        asset => parseFloat(sellPrices[asset].price)).reduce(
            (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
    const [buyPricesValue, setBuyPricesValue] = useState(Object.keys(buyPrices).map(
        asset => parseFloat(buyPrices[asset].price)).reduce(
            (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
    const [soldItems, setSoldItems] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
    const [errorAssets, setErrorAssets] = useState({});
    const [numErrors, setNumErrors] = useState(0);
    const [transferredItems, setTransferredItems] = useState([]);
    const [receiver, setReceiver] = useState('');
    const searchSearch = props['searchSearch'];
    const [transactions, setTransactions] = useState([]);
    const searchDate = props['searchDate'];
    const [lastSearch, setLastSearch] = useState('');
    const [savedDate, setSavedDate] = useState(null);
    const [bundlePrice, setBundlePrice] = useState(0);
    const isLoading = props['isLoading'];
    const [distributeItems, setDistributeItems] = useState({});
    const [distributeItemsLength, setDistributeItemsLength] = useState(Object.keys(distributeItems).length);

    const [state, dispatch] = useContext(Context);
    const transferItems = state.assets ? state.assets : {};

    const transferItemsLength = Object.keys(transferItems).length;

    const showAddedAssets = (
        sellPricesLength > 0 || buyPricesLength > 0 || distributeItemsLength > 0 || transferItemsLength > 0
    );

    const sellActions = ['bulk_edit', 'bulk_sell', 'bulk_sell_dupes', 'bulk_sell_highest_duplicates'];
    const bundleActions = ['bulk_bundle', 'bulk_bundle_lowest_mints', 'bulk_bundle_highest_mints',
        'bulk_bundle_highest_duplicates'];

    const dismissError = (assedId) => {
        delete errorAssets['' + assedId];
        setNumErrors(Object.keys(errorAssets).length);
        setErrorAssets(errorAssets);
    };

    const handleSold = (sold) => {
        const soldAssets = sold['sold'];
        const errors = sold['errors'];
        const transactionIds =  sold['transactionIds'];
        if (soldAssets) {
            soldAssets.map(asset => {
                const id = asset.asset.standard === 'atomicassets' ? asset.asset.aAssetId : asset.asset.assetId;
                soldItems.push(id);
                delete sellPrices[id];
            });
            setSoldItems(soldItems);
            setSellPrices(sellPrices);
            const sellValue = Object.keys(sellPrices).map(asset => parseFloat(sellPrices[asset].price)).reduce(
                (prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
            setSellPricesLength(Object.keys(sellPrices).length);
            setSellPricesValue(sellValue ? sellValue : 0);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length)
    };

    const handleTransferred = (transferred) => {
        const errors = transferred['errors'];
        const transactionIds =  transferred['transactionIds'];
        if (transferred['transferred']) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    const handleDistributed = (transferred) => {
        const errors = transferred['errors'];
        const transactionIds =  transferred['transactionIds'];
        if (transferred['distributed']) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                        delete distributeItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
        setDistributeItems(distributeItems);
    };

    const handleCanceled = (transferred) => {
        const errors = transferred['errors'];
        const transactionIds =  transferred['transactionIds'];
        if (transferred['transferred']) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    const handleBought = (sold) => {
        const boughtAssets = sold['bought'];
        const errors = sold['errors'];
        const transactionIds =  sold['transactionIds'];
        if (boughtAssets) {
            boughtAssets.map(asset => {
                const id = asset.standard === 'atomicassets' ? asset.aAssetId : asset.assetId;
                boughtItems.push(id);
                delete buyPrices[id];
                transferredItems.push(id);
                delete transferItems[id];
            });
            setBoughtItems(boughtItems);
            setBuyPrices(buyPrices);
            const buyValue = Object.keys(buyPrices).map(asset => parseFloat(buyPrices[asset].price)).reduce(
                (prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
            setBuyPricesLength(Object.keys(buyPrices).length);
            setBuyPricesValue(buyValue ? buyValue : 0);
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    const handleBurned = (transferred) => {
        const errors = transferred['errors'];
        const transactionIds =  transferred['transactionIds'];
        if (transferred['transferred']) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    const handleStaked = (transferred) => {
        const errors = transferred['errors'];
        const transactionIds =  transferred['transactionIds'];
        if (transferred['transferred']) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    const handleBundled = (bundled) => {
        const errors = bundled['errors'];
        const transactionIds =  bundled['transactionIds'];
        if (bundled['bundled'] && bundled['bundled'].length > 0) {
            Object.keys(transferItems).map(item =>
                {
                    if (!errors || !Object.keys(errors).includes(item)) {
                        transferredItems.push(item);
                        delete transferItems[item];
                    }
                }
            );
            setTransferredItems(transferredItems);
            setBundlePrice(0);
        }

        if (transactionIds)
            Object.keys(transactionIds).map(id => transactions[id] = transactionIds[id]);
        setTransactions(transactions);
        setErrorAssets(errors);
        setNumErrors(Object.keys(errors).length);
    };

    useEffect(() => {

    }, [numErrors]);

    useEffect(() => {
        if (lastSearch !== searchSearch) {
            setTransactions([]);
            setErrorAssets({});
            setNumErrors(0);
            setTransferredItems([]);
            dispatch({ type: 'SET_ASSETS', payload: {} });
        }

        if (savedDate !== searchDate) {
            setSavedDate(searchDate);
            setLastSearch(searchSearch);
            setReceiver('');
            setSellPrices(initSellPrices(assets));
            setBuyPrices(initBuyPrices(assets));
            setSellPricesValue(Object.keys(sellPrices).map(
                asset => parseFloat(sellPrices[asset].price)).reduce(
                    (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setBuyPricesValue(Object.keys(buyPrices).map(
                asset => parseFloat(buyPrices[asset].price)).reduce(
                    (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setSellPricesLength(Object.keys(sellPrices).length);
            setBuyPricesLength(Object.keys(buyPricesLength).length);
        }
    }, [
        sellPricesLength, distributeItemsLength, buyPricesLength, buyPricesValue, sellPricesValue,
        Object.keys(transferItems).length, receiver, searchDate, numErrors, enteringDecimal
    ]);

    const sell = () => {
        if (Object.keys(sellPrices).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: sellPrices });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_sell' });
            dispatch({ type: 'SET_CALLBACK', payload: (sold) => handleSold(sold) });
        }
    };

    const edit = () => {
        if (Object.keys(sellPrices).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: sellPrices });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_edit' });
            dispatch({ type: 'SET_CALLBACK', payload: (sold) => handleSold(sold) });
        }
    };

    const transfer = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_RECEIVER', payload: receiver });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_transfer' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleTransferred(transferred) });
        }
    };

    const distribute = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: distributeItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_distribute' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleDistributed(transferred) });
        }
    };

    const cancel = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_cancel' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleCanceled(transferred) });
        }
    };

    const buy = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_buy' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleBought(transferred) });
        }
    };

    const burn = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_burn' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleBurned(transferred) });
        }
    };

    const stake = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_stake' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleStaked(transferred) });
        }
    };

    const unstake = () => {
        if (Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bulk_unstake' });
            dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleStaked(transferred) });
        }
    };

    const sellBundle = () => {
        if (bundlePrice && Object.keys(transferItems).length > 0) {
            dispatch({ type: 'SET_SELLPRICE', payload: bundlePrice});
            dispatch({ type: 'SET_ASSETS', payload: transferItems });
            dispatch({ type: 'SET_ACTION', payload: 'bundle' });
            dispatch({ type: 'SET_CALLBACK', payload: (bundled) => handleBundled(bundled) });
        }
    };

    const changePrice = (e) => {
        const id = e.target.id.replace('sell-', '');
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            if (!val) {
                delete transferItems[id];
                delete sellPrices[id];
            } else {
                transferItems[id] = mappedAssets[id];
                sellPrices[id] = {price: val, asset: mappedAssets[id]};
            }

            setEnteringDecimal(e.target.value.endsWith('.'));
            setSellPricesValue(Object.keys(sellPrices).map(assetId => parseFloat(
                sellPrices[assetId].price)).reduce((prev, curr) => prev + curr, 0));
            setSellPricesLength(Object.keys(sellPrices).length);
            setSellPrices(sellPrices);

            dispatch({ type: 'SET_ASSETS', payload: transferItems });
        }
    };

    const changeReceivers = (e) => {
        const id = e.target.id.replace('sell-', '');
        const val = e.target.value;
        if (!val) {
            delete transferItems[id];
            delete distributeItems[id];
        } else {
            transferItems[id] = mappedAssets[id];
            distributeItems[id] = {receiver: val, asset: mappedAssets[id]};
        }

        setDistributeItemsLength(Object.keys(distributeItems).length);
        setDistributeItems(distributeItems);

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const changeBundlePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            if (val)
                setBundlePrice(val);
            else
                setBundlePrice(0);
        }
    };

    const checkItemAll = () => {
        Object.keys(mappedAssets).map(assetId => {
                if (!transactions || !Object.keys(transactions).includes(assetId))
                    transferItems[assetId] = mappedAssets[assetId]
            }
        );
        if (searchSearch === 'bulk_buy') {
            const prices = {};
            Object.keys(transferItems).map(id => {
                prices[id] = {price: mappedAssets[id].offer, asset: mappedAssets[id]}
            });

            setBuyPricesValue(Object.keys(prices).map(
                asset => parseFloat(prices[asset].price)).reduce(
                    (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setBuyPricesLength(Object.keys(prices).length);
            setBuyPrices(prices);
        }

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const checkItem = (id) => {
        transferItems[id] = mappedAssets[id];

        if (searchSearch === 'bulk_buy') {
            const prices = {};
            Object.keys(transferItems).map(id => {
                prices[id] = {price: mappedAssets[id].offer, asset: mappedAssets[id]}
            });
            setBuyPricesValue(Object.keys(prices).map(
                asset => parseFloat(prices[asset].price)).reduce(
                    (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setBuyPricesLength(Object.keys(prices).length);
            setBuyPrices(prices);
        }

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const checkBundleItem = (id) => {
        const standard = mappedAssets[id].standard;
        const author = mappedAssets[id].author;

        let error = false;
        let authorError = false;

        Object.keys(transferItems).map(
            assetId => { if (mappedAssets[assetId].standard !== standard) error = true }
        );

        Object.keys(transferItems).map(
            assetId => { if (mappedAssets[assetId].author !== author) authorError = true }
        );

        if (!error && !authorError)
            transferItems[id] = mappedAssets[id];
        else if (error) {
            errorAssets[id] = 'Cannot mix Atomicassets and Simpleassets in one Bundle';
            setErrorAssets(errorAssets);
            setNumErrors(Object.keys(errorAssets).length)
        } else {
            errorAssets[id] = 'Cannot mix different Collections in one Bundle';
            setErrorAssets(errorAssets);
            setNumErrors(Object.keys(errorAssets).length)
        }

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const changeReceiver = (e) => {
        const val = e.target.value;
        setReceiver(val.trim().toLowerCase());
    };

    const removeAsset = (transferItems, assetId) => {
        delete transferItems[assetId];
        if (searchSearch === 'bulk_buy') {
            delete buyPrices[assetId];
            setBuyPricesValue(Object.keys(buyPrices).map(asset => parseFloat(buyPrices[asset].price)).reduce(
            (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setBuyPricesLength(Object.keys(buyPrices).length);
            setBuyPrices(buyPrices);
        }
        if (sellActions.includes(searchSearch)) {
            delete sellPrices[assetId];
            setSellPricesValue(Object.keys(sellPrices).map(asset => parseFloat(sellPrices[asset].price)).reduce(
            (prev, curr) => parseFloat(prev) + parseFloat(curr), 0));
            setSellPricesLength(Object.keys(sellPrices).length);
            setSellPrices(sellPrices);
        }

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const removeAll = () => {
        if (searchSearch === 'bulk_buy') {
            setBuyPricesValue(0);
            setBuyPricesLength(0);
            setBuyPrices({});
        }
        if (sellActions.includes(searchSearch)) {
            setSellPricesValue(0);
            setSellPricesLength(0);
            setSellPrices({});
        }
        dispatch({ type: 'SET_ASSETS', payload: {} });
    };

    const getSellingElement = (str) => {
        const parts = str.split('|');
        return (
            <div>
                {parts[0]}
                <b>{parts[1]}</b>
                {parts[2]}
                <b>{parts[3]}</b>
            </div>
        );
    };

    const addedAssets = showAddedAssets && transferItems && Object.keys(transferItems).length > 0  ?
        <div className={cn(
            'relative flex overflow-x-auto w-full h-64 bg-blue border border-primary'
        )}>
            <div className={cn(
                'absolute flex right-3 top-0 cursor-pointer opacity-80 hover:opacity-100'
            )} onClick={removeAll}>
                <div>{t('search.remove_all')}</div>
                <div className={cn('h-6 w-6')}>
                    <img className={'m-1'} src={
                        '/trash-2-outline.svg'
                    } alt={''} />
                </div>
            </div>
            {Object.keys(transferItems).map(assetId =>
                <div className={cn(
                    'relative h-48 my-auto mx-4'
                )}>
                    <div className={cn(
                        'absolute top-0 left-32 w-6 h-6 z-20 cursor-pointer'
                    )}>
                        <img src="/mini_asset_card/minus.svg" alt="X" onClick={
                            () => removeAsset(transferItems, assetId)
                        } />
                    </div>
                    <MiniAssetPreview asset={transferItems[assetId]} minimal={true} />
                </div>
            )}
        </div> : '' ;

    const btnClass = cn(
        'border h-6 w-1/2 my-auto border-primary rounded-md',
        'text-primary opacity-80 hover:opacity-100'
    );
    
    const btnContainerClass = cn('flex justify-end h-8 w-48')

    let footer = '';
    if (['bulk_transfer', 'bulk_transfer_duplicates', 'bulk_transfer_lowest_mints'].includes(searchSearch))
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.transferring_x_items', {x: Object.keys(transferItems).length,})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <input
                        className={cn('border-b border-primary w-10')}
                        placeholder={t('asset.to')}
                        type="text"
                        onChange={changeReceiver}
                        value={receiver}
                    />
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0 || (!receiver)}
                            className={btnClass}
                            onClick={transfer}
                        >
                            {t('asset.transfer')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else
    if ('bulk_distribute' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.transferring_x_items', {x: Object.keys(transferItems).length})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={distribute}
                        >
                            {t('search.bulk_distribute')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if ('bulk_burn' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.burning_x_items', {x: Object.keys(transferItems).length,})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={burn}>{t('asset.burn')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if ('bulk_cancel' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.canceling_x_sales', {x: Object.keys(transferItems).length})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={cancel}>{t('asset.cancel')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if ('bulk_buy' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.buying_x_items_for_y', {x: Object.keys(transferItems).length,
                        y: `${buyPricesValue > 100 ? formatNumber(buyPricesValue) : formatNumberS(buyPricesValue)} WAX`
                    })}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={buy}>{t('asset.buy')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if (sellActions.includes(searchSearch))
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {getSellingElement(t('search.selling_x_items_for_y', {x: Object.keys(sellPrices).length,
                        y: `${sellPricesValue > 100 ?
                            formatNumber(sellPricesValue) : formatNumberS(sellPricesValue)} WAX`}))}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={searchSearch === 'bulk_edit' ? edit : sell}
                        >
                            {t('asset.sell')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if (bundleActions.includes(searchSearch))
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.selling_x_items', {x: Object.keys(transferItems).length})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <input
                            className={cn('border-b border-primary w-1/2 bg-transparent h-6 my-auto mr-2')}
                            placeholder={t('asset.price')}
                            type="text"
                            onChange={changeBundlePrice}
                            value={bundlePrice ? bundlePrice : ''}
                        />
                        <button
                            disabled={Object.keys(transferItems).length === 0 || (!bundlePrice)}
                            className={btnClass}
                            onClick={sellBundle}>{t('asset.sell')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if ('bulk_stake' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.staking_x_items', {x: Object.keys(transferItems).length})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={stake}>{t('asset.stake')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );
    else if ('bulk_unstake' === searchSearch)
        footer = (
            <BulkFooter
                addedAssets={addedAssets}
            >
                <BulkFooterItem>
                    {t('search.unstaking_x_items', {x: Object.keys(transferItems).length})}
                </BulkFooterItem>
                <BulkFooterItem>
                    <div className={btnContainerClass}>
                        <button
                            disabled={Object.keys(transferItems).length === 0}
                            className={btnClass}
                            onClick={unstake}>{t('asset.unstake')}
                        </button>
                    </div>
                </BulkFooterItem>
            </BulkFooter>
        );

    const reducePrice = () => {
        assets.filter(asset => asset.standard === 'atomicassets' ? asset['aAssetId'] : asset['assetId']).map(
            (asset, index) => {
            const {aAssetId, lowest, assetId} = asset;

            const localId = asset.standard === 'atomicassets' ? aAssetId : assetId;

            if (lowest) {
                sellPrices[localId] = {price: lowest * 0.99, asset: mappedAssets[localId]};
                transferItems[localId] = mappedAssets[localId];
            }
        });

        setSellPricesValue(Object.keys(sellPrices).map(assetId => parseFloat(sellPrices[assetId].price)).reduce(
            (prev, curr) => prev + curr, 0));
        setSellPricesLength(Object.keys(sellPrices).length);
        setSellPrices(sellPrices);

        dispatch({ type: 'SET_ASSETS', payload: transferItems });
    };

    const allAssets = Object.keys(transferItems).length === assets.length;

    const scrollDown = () => {
        const elem = document.getElementById('BulkPage');
        elem.scrollTo({left: 0, top: elem.scrollHeight, behavior: "smooth"});
    }

    return (
        <div className={
            cn('w-full pr-10 text-neutral')
        }>
            {showAddedAssets && !state.scrolledDown ?
                <div
                    onClick={scrollDown}
                    className={cn(
                        'absolute p-4 right-10 bottom-32',
                        'bg-blue z-100 cursor-pointer',
                        'rounded-2xl shadow'
                    )}>
                    <div className={'flex justify-center'}>
                        <div>Finish</div>
                        <div className={cn('h-6 w-6')}>
                            <img className={'m-1'} src={
                                '/arrowhead-down-outline.svg'
                            } alt={''} />
                        </div>
                    </div>
                </div> : '' }
            <div className={cn('relative ml-4 w-full')}>
                { !isLoading && ['bulk_transfer', 'bulk_transfer_duplicates', 'bulk_transfer_lowest_mints', 'bulk_buy',
                    'bulk_cancel', 'bulk_burn', 'bulk_stake', 'bulk_unstake'].includes(
                        searchSearch) && assets.length > 0 ?
                    <div className={cn(
                        'flex justify-end opacity-80 hover:opacity-100 cursor-pointer'
                    )} onClick={allAssets ? removeAll : checkItemAll}>
                        <div>{allAssets ? t('search.remove_all') : t('search.all_assets')}</div>
                        <div className={cn('h-6 w-6')}>
                            <img className={!allAssets ? 'm-auto' : 'm-1'} src={
                                !allAssets ? '/arrowhead-down-outline.svg' : '/trash-2-outline.svg'
                            } alt={''} />
                        </div>
                    </div> : ''
                }
                {sellActions.includes(searchSearch) && assets && assets.length > 0 ?
                    <div className={cn(
                        'flex justify-end opacity-80 hover:opacity-100 cursor-pointer'
                    )} onClick={reducePrice}>
                        <div>{t('general.set_market_price_percent')}</div>
                        <div className={cn('h-6 w-6')}>
                            <img className={'m-auto'} src={'/arrowhead-down-outline.svg'} alt={''} />
                        </div>
                    </div> : '' }
                { isLoading ? <LoadingIndicator/> :
                    <div className={cn('w-full')}>
                        { assets.filter(asset => asset.standard === 'atomicassets' ? asset['aAssetId'] : asset['assetId']).map(
                            (asset, index) =>
                                <BulkItem
                                    asset={asset}
                                    index={index}
                                    sellPrices={sellPrices}
                                    errorAssets={errorAssets}
                                    transactions={transactions}
                                    dismissError={dismissError}
                                    searchSearch={searchSearch}
                                    transferItems={transferItems}
                                    distributeItems={distributeItems}
                                    changeReceivers={changeReceivers}
                                    changePrice={changePrice}
                                    sellActions={sellActions}
                                    checkItem={checkItem}
                                    checkBundleItem={checkBundleItem}
                                />
                        )}
                    </div>
                }
                {assets.length > 0 ? footer : '' }
            </div>
        </div>
    );
}

export default BulkList;
