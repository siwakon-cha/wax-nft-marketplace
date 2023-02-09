import React, {useContext, useEffect, useState} from 'react';
import get from "../helpers/Api";
import AssetList from '../assetlist';

import qs from 'qs';
import LoadingIndicator from '../loadingindicator/LoadingIndicator';
import {Context} from "../waxplorer";
import {useTranslation} from "react-i18next";

const FixedSearchComponent = (props) => {
    const searchSettings = props['searchSettings'] ? props['searchSettings'] : {'minimal' : false};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const getValue = (key, def) => {
        if (searchSettings[key])
            return searchSettings[key]['value'];
        return def;
    };

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const { ual } = props;

    const userName = props['userName'];
    const title = props['title'];
    const [ state, dispatch ] = useContext(Context);
    const [searchResults, setSearchResults] = useState([]);
    const searchName = getValue('name', null);
    const searchOwner = getValue('owner', null);
    const searchCategory = getValue('category', null);
    const searchSearch = getValue('search_type', 'sales');
    const orderBy = getValue('order_by', 'offer');
    const orderDir = getValue('order_dir', 'ASC');
    const searchRarity = getValue('rarity', null);
    const searchVariant = getValue('variant', null);
    const searchColor = getValue('color', null);
    const searchAttr7 = getValue('attr7', null);
    const searchAttr8 = getValue('attr8', null);
    const searchAttr9 = getValue('attr9', null);
    const searchAttr10 = getValue('attr10', null);
    const searchTemplateId = getValue('templateId', null);
    const searchFavorites = getValue('favorites', false);
    const searchBorder = getValue('border', null);
    const searchType = getValue('type', null);
    const [isLoading, setIsLoading] = useState(false);
    const exactSearch = getValue('exact_search', false);
    const limitIncrease = getValue('limit', 10);
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const minPrice = getValue('min_price', 0);
    const maxPrice = getValue('max_price', 0);
    const minMint = getValue('min_mint', 0);
    const maxMint = getValue('max_mint', 0);
    const id = props['id'];
    const [isInitial, setIsInitial] = useState(true);
    const [searchDate, setSearchDate] = useState(new Date());
    const searchOffset = getValue('offset', 0);
    const currentSearchPath = [];
    const className = props['className'];

    const searchOfferType = searchSettings['searchOfferType'] ? searchSettings['searchOfferType'] : 'sales';

    const searchAuthor = getValue('collection', '*');

    const searchVerified = !searchAuthor;

    const getSearchResult = (result, searchPath) => {
        setIsLoading(false);
        if (currentSearchPath.length === 0 || currentSearchPath[currentSearchPath.length - 1] === searchPath) {
            setSearchResults(result);
        }

        return result;
    };

    const searchShit = async(name, owner, author, category, rarity, variant, isExactSearch, order, dir, search,
                             offerType, price_min, price_max, mint_min, mint_max, color, border, type, attr7, attr8,
                             attr9, attr10, templateId, verified, favorites, limit=limitIncrease,
                             offset=0, initial=false) => {
        if (search === 'bulk_bundle' && !author)
            return;

        if (!author || author === '*')
            category = '';

        setIsLoading(true);
        setIsInitial(false);

        let result = [];

        if (limit === limitIncrease) {
            setSearchResults(result);
        }

        const searchPath = `search?term=${name ? (name.includes('#') || name.includes('&') || name.includes('?') ? escape(name) : name) : ''}&owner=${owner ? owner : ''}&author=${author ? author : ''}&category=${
            category ? category : ''}&rarity=${rarity ? rarity : ''}&variant=${variant ? (variant.includes('#') || variant.includes('&')  || variant.includes('?') ? escape(variant) : variant) : ''}&order_by=${
            order ? order : 'asset_id'}&color=${color ? color : ''}&type=${type ? type : ''}&border=${border ? border : ''}&order_dir=${
            dir ? dir : 'ASC'}&limit=${limit}&search_type=${search}&exact_search=${
            isExactSearch ? isExactSearch : false}&offer_type=${offerType}${values['mint']?`&mint=${values['mint']}`:''}&min_price=${
            price_min}&max_price=${price_max}&min_mint=${mint_min}&max_mint=${mint_max}&offset=${offset}&attr7=${attr7 ? attr7 : ''}&attr8=${
            attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${attr10 ? attr10 : ''}&verified=${verified}&favorites=${
            favorites}&user=${userName ? userName : ''}&template_id=${templateId ? templateId : ''}`;

        currentSearchPath.push(searchPath);
        await get(searchPath).then((result) => getSearchResult(result, searchPath));

        let searchTerm = t('search.assets');
        let ownerTerm = t('search.owner');
        switch(search) {
            case 'trades':
                searchTerm = t('search.trades');
                ownerTerm = t('search.buyer');
            break;
            case 'sales':
                searchTerm = t('search.sales');
                ownerTerm = t('search.seller') + '/' + t('search.market');
            break;
            case 'duplicates':
                searchTerm = t('search.duplicates');
            break;
            case 'missing':
                searchTerm = t('search.missing_assets');
            break;
            case 'cheapest_missing':
                searchTerm = t('search.cheapest_missing_assets');
            break;
            case 'bundles':
                searchTerm = t('search.bundles');
                ownerTerm = t('search.seller') + '/' + t('search.market');
            break;
        }

        setSearchDate(new Date());
    };

    useEffect(() => {
        if (!isLoading && isInitial && searchResults.length === 0 && process.browser) {
            searchShit(searchName, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch,
                orderBy, orderDir, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor,
                searchBorder, searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchTemplateId,
                searchVerified, searchFavorites, limitIncrease, 0, true);
        }
    }, [searchOffset, currentSearchPath, searchSearch]);

    const handleScroll = e => {
        let element = e.target;

        if (element.className === 'AssetSearch') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
        }
    };

    const scrollUp = () => {
        const element = document.getElementsByClassName("AssetSearch")[0];
        element.scrollTo({left: 0, top: 0, behavior: "smooth"});
    };

    return (
        <div className={`AssetSearch Embedded ${className}`} onScroll={handleScroll}>
            {process.browser ? <div className={ "SearchResults Fixed" }>
                <AssetList
                    id={id}
                    searchDate={searchDate}
                    search={searchSearch}
                    
                    name="SearchResults"
                    assets={searchResults.length > 0 ? searchResults : []}
                    onSale={true}
                    isLoading={isLoading}
                    ual={ual}
                    type={getValue('preview_type', null)}
                />
                { isLoading && searchResults.length > 0 ? <LoadingIndicator/> : '' }
            </div> : '' }
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}><img src = "/up-arrow.svg" /></div> : '' }
        </div>
    );
};

export default FixedSearchComponent;
