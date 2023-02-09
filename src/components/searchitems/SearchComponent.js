import React, {useContext, useEffect, useState} from 'react';
import get from "../helpers/Api";
import AssetList from '../assetlist';

import qs from 'qs';
import LoadingIndicator from '../loadingindicator/LoadingIndicator';

import {formatNumber, setQueryStringWithoutPageReloadPush} from '../helpers/FormatLinks';
import {Context} from "../waxplorer";
import {useTranslation} from "react-i18next";
import BulkList from "../bulklist/BulkList";
import Pagination from "../pagination/Pagination";
import SearchFilters from "./searchfilters/SearchFilters";
import cn from "classnames";
import TopFilters from "./topfilters/TopFilters";

const SearchComponent = (props) => {
    const searchSettings = props['searchSettings'] ? props['searchSettings'] : {'minimal' : false};

    const [authorCategories, setAuthorCategories] = useState(null);
    const [searchCnt, setSearchCnt] = useState(1);

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const tab = values['tab'];

    const getValue = (key, def) => {
        if (searchSettings[key] && searchSettings[key]['fixed'])
            return searchSettings[key]['value'];
        if (values[key])
            return unescape(values[key]);
        if (searchSettings[key])
            return searchSettings[key]['value'];
        return def;
    };

    const getOrder = (search, def) => {
        let order = def;

        if (['assets', 'duplicates', 'highest_duplicates', 'packs'].includes(search)) {
            order = 'date_desc'
        } else if (search === 'trades') {
            order = 'date_desc'
        } else if (search === 'templates') {
            order = 'template_id_asc'
        } else if (['missing', 'cheapest', 'cheapest_missing'].includes(search)) {
            order = 'offer_asc'
        } else if ('sales' === search) {
            order = 'date_desc'
        } else if (search === 'bundles') {
            order = 'date_desc'
        } else if (['lowest_mints', 'highest_mints', 'bulk_transfer_lowest_mints'].includes(search)) {
            order = 'mint_asc'
        } else if (['bulk_transfer', 'bulk_distribute', 'bulk_cancel', 'bulk_transfer_duplicates', 'bulk_stake',
            'bulk_unstake', 'bulk_sell', 'bulk_burn', 'bulk_sell_duplicates', 'bulk_sell_dupes', 'bulk_bundle',
            'bulk_bundle_lowest_mints', 'bulk_bundle_highest_mints',
            'bulk_bundle_highest_duplicates', 'bulk_sell_highest_duplicates'].includes(
                search)) {
            order = 'date_desc'
        } else if (search === 'bulk_buy') {
            order = 'offer_asc'
        }

        return order;
    };

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const { ual } = props;
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;

    const tradeSearch = props['trade'];

    const [ state, dispatch ] = useContext(Context);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState(getValue('term', getValue('name', getValue('template_id',
        getValue('asset_id', getValue('number', null))))));
    const [searchOwner, setSearchOwner] = useState(getValue('owner', null));
    const [searchCategory, setSearchCategory] = useState(!tradeSearch ? values['category'] : null);
    const [searchSearch, setSearchSearch] = useState(getValue('search_type', (props['bulk'] ? 'bulk_sell' : 'sales')));

    const [orderBy, setOrderBy] = useState(getValue('order_by', getOrder(searchSearch,'offer_asc')));
    const [searchRarity, setSearchRarity] = useState(values['rarity']);
    const [searchVariant, setSearchVariant] = useState(values['variant']);
    const [searchColor, setSearchColor] = useState(values['color']);
    const [searchAttr7, setSearchAttr7] = useState(values['attr7']);
    const [searchAttr8, setSearchAttr8] = useState(values['attr8']);
    const [searchAttr9, setSearchAttr9] = useState(values['attr9']);
    const [searchAttr10, setSearchAttr10] = useState(values['attr10']);
    const [searchFavorites, setSearchFavorites] = useState(values['favorites'] ? values['favorites'] === 'true' : false);
    const [searchBorder, setSearchBorder] = useState(values['border']);
    const [searchType, setSearchType] = useState(values['type']);
    const [isLoading, setIsLoading] = useState(false);
    const [exactSearch, setExactSearch] = useState(values['exact_search']);
    const [searchLimit, setSearchLimit] = useState(getValue('limit', searchSettings['limit'] ? searchSettings['limit']['value'] : 40));
    const limitIncrease = searchSettings['limit'] ? searchSettings['limit']['value'] : 40;
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const [minPrice, setMinPrice] = useState(values['min_price'] ? values['min_price'] : 0);
    const [maxPrice, setMaxPrice] = useState(values['max_price'] ? values['max_price'] : 0);
    const [minAether, setMinAether] = useState(values['min_aether'] ? values['min_aether'] : 0);
    const [maxAether, setMaxAether] = useState(values['max_aether'] ? values['max_aether'] : 0);
    const [minMint, setMinMint] = useState(values['min_mint'] ? values['min_mint'] : 0);
    const [maxMint, setMaxMint] = useState(values['max_mint'] ? values['max_mint'] : 0);
    const [ownerTerm, setOwnerTerm] = useState(t('search.owner'));
    const expanded = searchSettings['expanded'] !== false;
    const [searchDate, setSearchDate] = useState(new Date());
    const [searchOffset, setSearchOffset] = useState(values['offset'] ? values['offset'] : 0);
    const [currentSearchPath, setCurrentSearchPath] = useState([]);
    const [cleared, setCleared] = useState(false);
    const [searchAuthor, setSearchAuthor] = useState(getValue('collection', null) ? getValue(
        'collection', null) : props['collection'] && props['collection'] !== '*' ? props['collection'] : '*');
    const onAdd = props['onAdd'];

    const [lastSearch, setLastSearch] = useState('');

    const targetTab = searchSettings ? searchSettings['tab'] : null;
    const bulk = props['bulk'];

    const refresh = values['refresh'] ? values['refresh'] : '';

    const parseAuthorCategories = (res) => {
        const rarity = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.rarity).includes(searchRarity);
        const variant = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.variant).includes(searchVariant);
        const category = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.category).includes(searchCategory);
        const color = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.color).includes(searchColor);
        const border = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.border + '').includes(searchBorder);
        const type = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.type).includes(searchType);
        const attr7 = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.attr7).includes(searchAttr7);
        const attr8 = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.attr8).includes(searchAttr8);
        const attr9 = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.attr9).includes(searchAttr9);
        const attr10 = res['categories'].filter(item => item['author'] === searchAuthor).map(
            item => item.attr10).includes(searchAttr10);

        setAuthorCategories(res);

        setVarsAndSearch(
            searchTerm,
            bulk && ual['activeUser']['accountName'] ? ual['activeUser']['accountName'] : searchOwner,
            searchAuthor, category ? searchCategory : '', rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch,
            searchOfferType, minPrice, maxPrice, minMint, maxMint, color ? searchColor : '',
            border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '',
            searchVerified, searchFavorites, searchLimit, searchOffset
        );
    }

    useEffect(() => {
        if (tradeSearch && !searchOwner)
            return;

        if (process.browser) {
            if (!isLoading && (!targetTab || !tab || targetTab === tab)) {
                if (!bulk || (ual['activeUser'] && ual['activeUser']['accountName'])) {
                    if (searchAuthor && searchAuthor !== '*') {
                        getAuthorCategories().then(parseAuthorCategories);
                    } else {
                        searchShit(
                            searchTerm, bulk && ual['activeUser']['accountName']
                                ? ual['activeUser']['accountName'] : searchOwner, searchAuthor, searchCategory,
                            '', '', exactSearch, orderBy, searchSearch, searchOfferType,
                            minPrice, maxPrice, minMint, maxMint, '', '', '',
                            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites,
                            searchLimit, searchOffset, minAether, maxAether, !refresh
                        );
                    }
                }
            }
        }
    }, [searchCnt]);

    useEffect(() => {

    }, [cleared]);

    const isPackSearch = searchSearch === 'ft_packs' || searchSearch === 'my_ft_packs';

    const getAuthorCategories = async() => {
        if (!isPackSearch)
            return await get(`author-categories?author=${searchAuthor}`).then(result => {setAuthorCategories(result); return result;});
        else
            return await get(`author-categories-packs?author=${searchAuthor}`).then(result => {setAuthorCategories(result); return result;});
    };

    const checkLastSearch = (searchPath, initial) => {
        if (state.last_search_path === searchPath && initial) {
            dispatch({ type: 'SET_LOADING', payload: false });
            setIsLoading(false);
            setSearchResults(state.last_search_result);
        } else {
            dispatch({ type: 'SET_SEARCH_TRIGGERED', payload: true });
            dispatch({ type: 'SET_LOADING', payload: true });
            get(searchPath).then((result) => getSearchResult(result, searchPath));
        }
    };

    const searchShit = async(
        term, owner, author, category, rarity, variant, isExactSearch, order, search, offerType, price_min,
        price_max, mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit,
        offset=0, aether_min, aether_max, initial=false
    ) => {
        if (['bulk_bundle', 'bulk_bundle_lowest_mints', 'bulk_bundle_highest_mints',
            'bulk_bundle_highest_duplicates'].includes(search) && !author)
            return;

        if (!author || author === '*')
            category = '';

        setIsLoading(true);

        if (price_max && parseFloat(price_max) < parseFloat(price_min)) {
            price_max = price_min
        }

        if (aether_max && parseFloat(aether_max) < parseFloat(aether_min)) {
            aether_max = aether_min
        }

        let result = [];

        setSearchResults(result);

        const searchPath = `search?term=${
            term ? (term.includes('#') || term.includes('&')  || term.includes('?') ? escape(term) : term) : ''}&owner=${
            owner ? owner : ''}&author=${author ? author : ''}&category=${
            category ? category : ''}&rarity=${rarity ? rarity : ''}&variant=${
            variant ? (variant.includes('#') || variant.includes('&')  || variant.includes('?') ? escape(
                variant) : variant) : ''}&order_by=${
            order ? order : 'asset_id'}&color=${color ? color : ''}&type=${type ? type : ''}&border=${
            border ? border : ''}&limit=${limit}&search_type=${search}&exact_search=${
            isExactSearch ? isExactSearch : false}&offer_type=${offerType}${values['mint']?`&mint=${values['mint']}`:''}&min_price=${
            price_min}&max_price=${price_max}&min_mint=${mint_min}&max_mint=${mint_max}&offset=${offset}&attr7=${attr7 ? attr7 : ''}&attr8=${
            attr8 ? attr8 : ''}&attr9=${attr9 ? attr9 : ''}&attr10=${attr10 ? attr10 : ''}&verified=${verified}&favorites=${
            favorites}&user=${ual['activeUser'] && ual['activeUser']['accountName'] ? ual['activeUser']['accountName'] : ''}&max_aether=${
            aether_max ? aether_max : ''}&min_aether=${aether_min ? aether_min : ''}`;

        currentSearchPath.push(searchPath);

        dispatch({ type: 'SET_SWITCHED_TAB', payload: false });
        dispatch({ type: 'SET_SCROLLED_DOWN', payload: false });

        checkLastSearch(searchPath, initial);

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
            case 'highest_duplicates':
                searchTerm = t('search.highest_duplicates');
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
        setOwnerTerm(ownerTerm);
    };

    const selectedAssets = props['selectedAssets'];

    const searchOfferType = searchSettings['searchOfferType'] ? searchSettings['searchOfferType'] : 'sales';

    const [searchVerified, setSearchVerified] = useState(getValue(
        'verified', 'true'));

    const totalResults = searchResults && searchResults.length > 0 ? searchResults[0].total_results : 0;
    const estimatedValue = searchResults && searchResults.length > 0 ? searchResults[0].estimated_usd_value : 0;
    const totalResultsUnknown = searchResults && searchResults.length > 0 && !totalResults;

    const getSearchResult = (result, searchPath) => {
        setIsLoading(false);

        if (result['error']) {
            setSearchResults([]);
            return [];
        }

        if (currentSearchPath.length === 0 || currentSearchPath[currentSearchPath.length - 1] === searchPath) {
            dispatch({ type: 'SET_LAST_SEARCH_RESULT', payload: result });
            dispatch({ type: 'SET_LAST_SEARCH_PATH', payload: searchPath });

            if (!result || result.length === 0 || result[0].totalResults < searchOffset) {
                setSearchOffset(0);
            }
            setSearchResults(result);
        }
        dispatch({ type: 'SET_LOADING', payload: false });
        return result;
    };

    const setVars = (
        term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
        mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
        aether_min, aether_max
    ) => {
        exact = exact === 'true' || exact === true;
        if (!searchAuthor || searchAuthor === '*')
            category = '';

        if (mint_max && parseInt(mint_max) < parseInt(mint_min)) {
            mint_max = mint_min
        }

        if (!['sales', 'bundles', 'cheapest_missing', 'missing', 'packs', 'ft_packs',
            'cheapest', 'bulk_buy'].includes(search)) {
            offerType = '';
            if (search !== 'trades') {
                price_min = 0;
                price_max = 0;
            }
        }

        const ownerSearches = ['missing', 'cheapest_missing', 'duplicates', 'highest_duplicates', 'favorites'];

        if (ownerSearches.includes(search) && !owner) {
            if (userName)
                owner = userName;
            else
                search = 'assets';
        } else if (ownerSearches.includes(searchSearch) && !ownerSearches.includes(search) && owner) {
            owner = '';
        }

        if (order === 'diff') {
            if (search === 'assets') {
                order = 'asset_id_asc'
            }
            if (search === 'templates') {
                order = 'template_id_asc'
            }
            if (search === 'trades') {
                order = 'date_desc'
            }
            if (search === 'bundles') {
                order = 'offer_asc'
            }
        }

        const query = values;

        delete query['name'];
        delete query['number'];
        delete query['asset_id'];
        delete query['template_id'];

        if (query['refresh'])
            delete query['refresh'];
        if (term)
            query['term'] = escape(term);
        else
            delete query['term'];
        if (owner && tab !== 'new-trade')
            query['owner'] = owner;
        else
            delete query['owner'];
        if (author)
            query['collection'] = author;
        else
            delete query['collection'];
        if (category)
            query['category'] = category;
        else
            delete query['category'];
        if (rarity)
            query['rarity'] = rarity;
        else
            delete query['rarity'];
        if (variant)
            query['variant'] = variant;
        else
            delete query['variant'];
        if (order)
            query['order_by'] = order;
        else
            delete query['order_by'];
        if (search)
            query['search_type'] = search;
        else
            delete query['search_type'];
        if (exact)
            query['exact_search'] = exact;
        else
            delete query['exact_search'];
        if (offerType)
            query['offer_type'] = offerType;
        else
            delete query['offer_type'];
        if (price_min)
            query['min_price'] = price_min;
        else
            delete query['min_price'];
        if (price_max)
            query['max_price'] = price_min && parseFloat(price_max) < parseFloat(price_min) ? price_min : price_max;
        else
            delete query['max_price'];
        if (aether_min)
            query['min_aether'] = aether_min;
        else
            delete query['min_aether'];
        if (aether_max)
            query['max_aether'] = aether_min && parseFloat(aether_max) < parseFloat(aether_min) ? aether_min : aether_max;
        else
            delete query['max_aether'];
        if (mint_min)
            query['min_mint'] = mint_min;
        else
            delete query['min_mint'];
        if (mint_max)
            query['max_mint'] = mint_min && parseInt(mint_max) < parseInt(mint_min) ? mint_min : mint_max;
        else
            delete query['max_mint'];
        if (tab)
            query['tab'] = tab;
        else
            delete query['tab'];
        if (color)
            query['color'] = color;
        else
            delete query['color'];
        if (border)
            query['border'] = border;
        else
            delete query['border'];
        if (type)
            query['type'] = type;
        else
            delete query['type'];
        if (offset)
            query['offset'] = offset;
        else
            delete query['offset'];
        if (attr7)
            query['attr7'] = attr7;
        else
            delete query['attr7'];
        if (attr8)
            query['attr8'] = attr8;
        else
            delete query['attr8'];
        if (attr9)
            query['attr9'] = attr9;
        else
            delete query['attr9'];
        if (attr10)
            query['attr10'] = attr10;
        else
            delete query['attr10'];
        if (verified === 'false' || verified === false)
            query['verified'] = 'false';
        else
            delete query['verified'];
        if (favorites)
            query['favorites'] = 'true';
        else
            delete query['favorites'];
        if (limit !== limitIncrease)
            query['limit'] = limit;
        else
            delete query['limit'];

        const searchStr = qs.stringify(query);

        setSearchTerm(term);
        setSearchOwner(owner);
        setSearchAuthor(author);
        setSearchLimit(limit);
        setSearchSearch(search);
        setSearchCategory(category);
        setSearchRarity(rarity);
        setSearchVariant(variant);
        setOrderBy(order);
        setExactSearch(exact);
        setMinMint(mint_min);
        setMaxMint(mint_max);
        setMinPrice(price_min);
        setMaxPrice(price_max);
        setMinAether(aether_min);
        setMaxAether(aether_max);
        setSearchColor(color);
        setSearchBorder(border);
        setSearchType(type);
        setSearchOffset(offset);
        setSearchAttr7(attr7);
        setSearchAttr8(attr8);
        setSearchAttr9(attr9);
        setSearchAttr10(attr10);
        setSearchFavorites(favorites);
        setSearchVerified(verified);
        setSearchCnt(searchStr !== lastSearch ? searchCnt + 1 : searchCnt);
        setLastSearch(searchStr);
        setCleared(false);

        return query;
    };

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

    const setVarsAndSearch = (
        term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
        mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
        aether_min, aether_max, initial
    ) => {
        setVars(
            term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
            mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
            aether_min, aether_max, initial
        );
        searchShit(
            term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
            mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
            aether_min, aether_max, initial
        );
    }

    const setVarsAndPush = (
        term, owner, author, category, rarity, variant, exactSearch, order, search, offerType, price_min, price_max,
        mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
        aether_min, aether_max
    ) => {
        const query = setVars(
            term, owner, author, category, rarity, variant, exactSearch, order, search, offerType, price_min, price_max,
            mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit, offset,
            aether_min, aether_max
        );
        setQueryStringWithoutPageReloadPush(qs.stringify(query));
    }

    const clearFilters = () => {
        setVarsAndPush(
            '', '', '*', '', '', '', false, orderBy, searchSearch,
            '', 0, 0, 0, 0, '', '', '', '', '',
            '', '', true, false, searchLimit, 0, 0, 0
        );

        setCleared(true);
    };

    const changeSearch = (
        term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max, mint_min,
        mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit,
        offset=0, aether_min=minAether, aether_max=maxAether, initial=false
    ) => {
        if (tradeSearch) {
            setVarsAndSearch(
                term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
                mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit,
                offset, aether_min, aether_max, initial
            );
        } else {
            setVarsAndPush(
                term, owner, author, category, rarity, variant, exact, order, search, offerType, price_min, price_max,
                mint_min, mint_max, color, border, type, attr7, attr8, attr9, attr10, verified, favorites, limit,
                offset, aether_min, aether_max, initial
            );
        }
    }

    const setOffset = (i) => {
        changeSearch(
            searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, orderBy,
            searchSearch,searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder,
            searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites,
            searchLimit, i
        )
    };

    const setOrder = (order) => {
        changeSearch(
            searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, order,
            searchSearch,searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder,
            searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites,
            searchLimit, 0
        );
    };

    const setTerm = (term) => {
        setSearchTerm(term);
    };

    const applyTerm = (term) => {
        changeSearch(
            term, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, orderBy,
            searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0
        );
    }

    const getPagination = (search, location) => {
        if (['ft_packs', 'bulk_sell_dupes', 'bulk_edit', 'bulk_sell', 'bulk_buy', 'bulk_cancel', 'bulk_transfer',
            'bulk_transfer_duplicates', 'bulk_distribute', 'bulk_transfer_lowest_mints', 'bulk_bundle',
            'bulk_bundle_lowest_mints', 'bulk_bundle_highest_mints', 'bulk_burn', 'bulk_stake', 'bulk_unstake',
            'bulk_bundle_highest_duplicates', 'bulk_sell_highest_duplicates'].includes(search))
            return '';

        return (
            <Pagination
                result={searchResults}
                offset={searchOffset}
                limit={searchLimit}
                location={location}
                setOffset={setOffset}
            />
        )
    };

    return (
        <div className={cn(
            'flex flex-wrap w-full'
        )} onScroll={handleScroll}>
            <SearchFilters
                searchCategory={searchCategory}
                searchVariant={searchVariant}
                searchRarity={searchRarity}
                searchColor={searchColor}
                searchBorder={searchBorder}
                searchType={searchType}
                searchFavorites={searchFavorites}
                searchAttr7={searchAttr7}
                searchAttr8={searchAttr8}
                searchAttr9={searchAttr9}
                searchAttr10={searchAttr10}
                maxPrice={maxPrice}
                minPrice={minPrice}
                minAether={minAether}
                maxAether={maxAether}
                minMint={minMint}
                maxMint={maxMint}
                setSearchOwner={setSearchOwner}
                searchOwner={searchOwner}
                searchTerm={searchTerm}
                searchAuthor={searchAuthor}
                searchSearch={searchSearch}
                searchSettings={searchSettings}
                setVars={changeSearch}
                exactSearch={exactSearch}
                orderBy={orderBy}
                searchOfferType={searchOfferType}
                isLoading={isLoading}
                tradeSearch={tradeSearch}
                searchOffset={searchOffset}
                currentSearchPath={currentSearchPath}
                searchVerified={searchVerified}
                searchLimit={searchLimit}
                ownerTerm={ownerTerm}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                setMinMint={setMinMint}
                setMaxMint={setMaxMint}
                setMinAether={setMinAether}
                setMaxAether={setMaxAether}
                authorCategories={authorCategories}
                clearFilters={clearFilters}
                ual={ual}
                bulk={props['bulk']}
                cleared={cleared}
                tab={tab}
            />

            {process.browser ? <div className={cn('w-full md:w-4/5 xl:w-5/6')}>
                <div className={'flex flex-wrap h-64 md:h-32 xl:h-16 mx-4 mb-auto'}>
                    {searchSearch === 'ft_packs' ?
                        '' :
                        <div className={cn(
                            'relative flex flex-wrap h-auto',
                            'w-full my-auto md:mb-auto md:mt-0'
                        )}>
                            <TopFilters
                                disabled={isPackSearch || isLoading ? 'disabled' : ''}
                                setOrder={setOrder}
                                searchTerm={searchTerm}
                                searchSearch={searchSearch}
                                orderBy={orderBy}
                                authorCategories={authorCategories}
                                searchAuthor={searchAuthor}
                                searchCategory={searchCategory}
                                setTerm={setTerm}
                                applyTerm={applyTerm}
                                cleared={cleared}
                                tab={tab}
                            />
                            <div className={cn(
                                'h-auto md:h-10 relative w-full md:w-1/2 xl:w-1/4',
                                'flex text-neutral mb-auto mx-auto'
                            )}>
                                <div className={'mx-auto md:ml-auto md:mr-0 my-auto'}>
                                {searchResults && searchResults.length > 0 ? (totalResultsUnknown ? t(
                                    'search.showing_x_of_unknown_number_of_results', {number: searchResults.length}) :
                                    t('search.showing_x_of_y_results', {
                                    x: `${parseInt(searchOffset) + 1} - ${searchOffset + searchResults.length}`,
                                    y: totalResults
                                })) : (isLoading ? '' : t('search.0_results'))}
                                {searchResults && estimatedValue ? <div>{` (${t('profile.estimated_value')}: $${formatNumber(estimatedValue)})`}</div> : ''}
                                </div>
                            </div>
                            {getPagination(searchSearch, 'Top')}
                        </div>
                    }
                </div>


                {searchSearch && searchSearch.includes('bulk')
                    ? <BulkList isLoading={isLoading} searchResults={searchResults.length > 0 ? searchResults : []}
                                searchSearch={searchSearch}
                                searchDate={searchDate} />
                    : <AssetList onAdd={onAdd} selectedAssets={selectedAssets} searchDate={searchDate}
                                 search={searchSearch} name="SearchResults"
                                 assets={searchResults.length > 0 ? searchResults : []} onSale={true}
                                 isLoading={isLoading} ual={ual} type={getValue('preview_type', null)}/>
                }
                { isLoading && searchResults.length > 0 ? <LoadingIndicator/> : '' }
                {isLoading ? '' : getPagination(searchSearch, 'Bottom')}
            </div> : '' }
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}>
                <img src = "/up-arrow.svg" />
            </div> : '' }
        </div>
    );
};

export default SearchComponent;
