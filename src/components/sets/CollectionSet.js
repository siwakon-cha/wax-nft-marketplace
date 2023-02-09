import React, {useContext, useEffect, useState} from 'react';

import CollectionList from './CollectionList';
import {
    formatNumber,
    getAttributeName,
    getColorName,
    getTypeName,
    getVariantName,
    getRarityName,
    getBorderName,
    openSearchPopup,
} from "../helpers/FormatLinks";
import LoadingIndicator from "../loadingindicator";
import { get } from "../helpers/Api";

import Link from 'next/link';

import {Context} from "../waxplorer";
import ErrorMessage from "../popups/ErrorMessage";
import cn from "classnames";
import {useTranslation} from "react-i18next";
import SetHeaderInfo from "./SetHeaderInfo";
import SetMoreOptions from "./SetMoreOptions";

function CollectionSet(props) {
    const item = props['item'];
    const {author, category, rarity, variant, name, score, color, total, border, type, attr7, attr8, attr9, attr10,
           tubeId} = item;

    const collectionName = props['collectionName'];
    const searchOwner = props['searchOwner'];
    const {t} = useTranslation('common');
    const includeTubes = props['includeTubes'];
    item['owner'] = searchOwner;

    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zoom, setZoom] = useState(5);
    const [showStats, setShowStats] = useState(true);
    const [tubed, setTubed] = useState(false);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const numOwned = assets.length > 0 ? assets.filter(item => item.owner).length : item['numOwned'];

    const zoomOut = () => {
        if (zoom > 1)
            setZoom (zoom - 1);
    };

    const zoomIn = () => {
        if (zoom < 7)
            setZoom (zoom + 1);
    };

    const parseResult = (res) => {
        setIsLoading(false);
        return res;
    };

    const getAssets = async (refresh=false) => {
        if (assets.length === 0 || refresh) {
            setIsLoading(true);

            let result = [];

            if (!refresh) {
                setAssets(result);
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const searchPath = `collection-items?owner=${searchOwner}&author=${author}&name=${
                name ? (name.includes('#') || name.includes('&')  || name.includes('?') ? escape(name) : name) : ''}&category=${category ? category : ''}&rarity=${
                rarity ? (rarity.includes('#') || rarity.includes('&')  || rarity.includes('?') ? escape(rarity) : rarity) : ''}&variant=${
                variant ? (variant.includes('#') || variant.includes('&')  || variant.includes('?') ? escape(variant) : variant) : ''}&color=${color ? color : ''}&border=${
                border ? border : ''}&type=${type ? type : ''}&attr7=${attr7 ? attr7 : ''}&attr8=${
                attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${attr10 ? attr10 : ''}&include_tubes=${
                includeTubes}&refresh=${refresh}`;

            result = await get(searchPath, 'set-api').then(res => parseResult(res));

            setAssets(result);
            setRefreshing(false);
        }
    };

    const setId = 'set'+author+name+color+border+type+rarity+variant;

    const [ state, dispatch ] = useContext(Context);

    const [showSet, setShowSet] = useState(state.lastShownSet === setId || props['showSet']);


    useEffect(() => {
        if (showSet)
            getAssets(refreshing);
    }, [showSet, color, name, collectionName, rarity, variant, border, type, includeTubes, searchOwner, refreshing]);

    const filterItem = (item, owner = null) =>
            (!category || item['category'] === category) &&
            (!variant || item['variant'] === variant) &&
            (!rarity || item['rarity'] === rarity) &&
            (!type || item['type'] === type) &&
            (!name || item['name'] === name) &&
            (!color || item['color'] === color) &&
            (!border || item['border'].toString() === border.toString()) &&
        (owner ? item['owner'] === owner : true);

    const user_assets = assets.length > 0 ? assets.filter(
        item => item['owner']
    ) : [];

    const missing_assets = assets.length > 0 ? assets.filter(
        item => !item['owner']
    ) : assets;

    let val_average = 0;

    user_assets.map(item => {
        const avg = item['average'];
        if (avg)
            val_average += avg;
    });

    let val_lowest = 0;
    let available = 0;
    let not_available = 0;

    missing_assets.map(item => {
        const lowest = item['lowest'];
        if (lowest) {
            val_lowest += lowest;
            available += 1;
        } else if (!lowest) {
            not_available += 1;
        }
    });

    const fullSet = assets && assets.length > 0 && assets.filter(
        item => filterItem(item, searchOwner)).length === assets.filter(item => filterItem(item)).length && searchOwner;

    let sellArea = '';

    function refresh(closed=true) {
        setRefreshing(true);
    }

    const toggleShowStats = () => {
        setShowStats(!showStats);
    };

    const toggleShowSet = () => {
        if (!showSet)
            dispatch({ type: 'SET_LAST_SHOWN_SET', payload: setId });

        setShowSet(!showSet);
    };

    const handleBought = (bought) => {
        const error = bought && bought['error'];
        if (bought && bought['bought']) {
            setRefreshing(true);
        }

        if (error) {
            setError(error);
        }
    };

    const handleTubed = (transferred) => {
        const errors = transferred && transferred['errors'];
        if (transferred && transferred['transferred']) {
            setTubed(true);
        }

        if (errors) {
            setError(errors[0]);
        }
    };

    const createTube = (assets, tubeId, lowestMints=true) => {
        dispatch({ type: 'SET_ASSETS', payload: assets });
        dispatch({ type: 'SET_TUBE_ID', payload: tubeId });
        dispatch({ type: 'SET_LOWEST_MINTS', payload: lowestMints });
        dispatch({ type: 'SET_CALLBACK', payload: (transferred) => handleTubed(transferred) });
        dispatch({ type: 'SET_ACTION', payload: 'tube' });
    };

    const buyMissing = (asset) => {
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (bought) => handleBought(bought) });
        dispatch({ type: 'SET_ACTION', payload: 'buy_missing' });
    };

    const variantName = getVariantName(t, collectionName, category);
    const rarityName = getRarityName(t, collectionName, category);
    const borderName = getBorderName(t, collectionName, category);
    const colorName = getColorName(t, collectionName, category);
    const typeName = getTypeName(t, collectionName, category);
    const attr7Name = getAttributeName(t, collectionName, category, 0);
    const attr8Name = getAttributeName(t, collectionName, category, 1);

    const dismissError = () => {
        setError(null);
    }

    let headerCnt = 2;

    if (category)
        headerCnt += 1;
    if (name)
        headerCnt += 1;
    if (rarity)
        headerCnt += 1;
    if (variant)
        headerCnt += 1;
    if (color)
        headerCnt += 1;
    if (border)
        headerCnt += 1;
    if (type)
        headerCnt += 1;
    if (attr7)
        headerCnt += 1;
    if (attr8 || author === 'kogsofficial')
        headerCnt += 1;
    if (tubeId)
        headerCnt += 1;
    if (score)
        headerCnt += 1;

    return (
        <div className={
            'relative w-full h-auto rounded-2xl bg-paper shadow mb-4'
        } id={setId}>
            <div className={cn(
                `grid grid-cols-3`,
                'relative h-auto text-left',
                'rounded-t-2xl mb-2 cursor-pointer',
                'bg-gradient-to-b from-transparent hover:from-bluet to-transparent',
                {'md:grid-cols-4': headerCnt === 4},
                {'md:grid-cols-5': headerCnt === 5},
                {'md:grid-cols-6': headerCnt === 6},
                {'md:grid-cols-7': headerCnt === 7},
                {'md:grid-cols-8': headerCnt === 8},
                {'md:grid-cols-9': headerCnt === 9},
                {'md:grid-cols-10': headerCnt === 10},
                {'md:grid-cols-11': headerCnt === 11},
                {'md:grid-cols-12': headerCnt === 12},
                {'md:grid-cols-13': headerCnt === 13}
            )} onClick={toggleShowSet}>
                <SetHeaderInfo title={t('profile.collection')} value={collectionName} />
                { category ? <SetHeaderInfo title={'Schema'} value={category} /> : '' }
                { name ? <SetHeaderInfo title={t('profile.name')} value={name} /> : '' }
                { rarity ? <SetHeaderInfo title={rarityName} value={rarity} /> : '' }
                { variant ? <SetHeaderInfo title={variantName} value={variant} /> : '' }
                { color ? <SetHeaderInfo title={colorName} value={color} /> : '' }
                { border ? <SetHeaderInfo title={borderName} value={border} /> : '' }
                { type ? <SetHeaderInfo title={typeName} value={type} /> : '' }
                { attr7 ? <SetHeaderInfo title={attr7Name} value={attr7} /> : '' }
                { attr8 ? <SetHeaderInfo title={attr8Name} value={attr8} /> : (
                    author === 'kogsofficial' ? <SetHeaderInfo title={t('search.type')} value={'Royal'} /> : '' )}
                { tubeId ? <SetHeaderInfo title={'Tube ID'} value={tubeId} /> : '' }
                <SetHeaderInfo title={t('profile.completion')} value={`${ numOwned }/${ total }`} />
                { score ? <SetHeaderInfo title={t('profile.score')} value={fullSet || (total === numOwned) ? score : `0/${score}`} /> : '' }
            </div>
            <div className={cn(
                'text-neutral flex flex-wrap justify-evenly h-32 md:h-10'
            )}>
                { val_average && showStats ? <div className="flex">{t('profile.set_value')} { `${formatNumber(val_average)} WAX` } </div> : ''}
                { available && showStats ? <div
                    onClick={() => openSearchPopup(searchOwner ? 'cheapest_missing' : 'cheapest', item, dispatch, refresh)}
                    className={cn('flex opacity-80 hover:opacity-100 cursor-pointer')}>
                    <div>{t('profile.num_available_for', {num: available, amount: formatNumber(val_lowest)})}</div>
                    <div className={cn('h-6 w-6')}>
                        <img className={cn('m-0.5')} src="/search.svg"/>
                    </div>
                </div> : ''}
                { available && searchOwner && showStats ?
                    <div
                        onClick={() => buyMissing(item)}
                        className={cn('flex opacity-80 hover:opacity-100 cursor-pointer')}>
                        <div>{t('profile.buy_all_missing')}</div>
                        <div className={cn('h-6 w-6')}>
                            <img className={cn('m-0.5')} src="/purchase.svg"/>
                        </div>
                    </div> : ''}
                { not_available ? <div>{t('profile.not_available')}: {not_available}</div> : '' }
                <SetMoreOptions
                    item={item}
                    zoomOut={zoomOut}
                    zoomIn={zoomIn}
                    showStats={showStats}
                    assets={assets}
                    toggleShowStats={toggleShowStats}
                    createTube={createTube}
                    tubed={tubed}
                    refresh={refresh}
                />
            </div>
            {error ? <div className={cn('relative h-20')} onClick={dismissError}>
                <ErrorMessage error={error} />
            </div> : '' }

            <div className={cn(
                'max-h-0 overflow-y-auto InsideScroll transition',
                'transition-height duration-500 mx-2 md:mx-10',
                {'max-h-192 h-screen overflow-y-auto': showSet}
            )}>
                { isLoading && !refreshing ? <LoadingIndicator/> :
                    <CollectionList
                        showStats={showStats}
                        zoom={zoom}
                        name={"SearchResults"}
                        assets={assets}
                        refresh={refresh}
                    />
                }
            </div>
            {sellArea}
            <div className={cn(
                'relative w-16 h-16 mx-auto cursor-pointer opacity-80 hover:opacity-100',
                'transition transition-transform duration-500',
                {'transform rotate-180': !showSet}
            )}
                onClick={toggleShowSet}>
                <img className={'m-auto w-16 h-16'} src="/collapse.svg" />
            </div>
        </div>
    );
}

export default CollectionSet;
