import cn from "classnames";
import Button from "../../common/util/input/Button";
import {
    createAttributes, createBorders,
    createCategories, createColors, createRarities, createTypes, createVariants,
    getAttributeName,
    getBorderName,
    getColorName,
    getNumberName,
    getRarityName, getTypeName,
    getVariantName
} from "../../helpers/FormatLinks";
import Input from "../../common/util/input/Input";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import SelectionField from "./SelectionField";
import CollectionSelector from "../../collectionselector/CollectionSelector";
import FilterElement from "./FilterElement";
import RangeField from "./RangeField";
import InputSearch from "./InputSearch";

const SearchFilters = (props) => {
    const {t} = useTranslation('common');
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;
    const [show, setShow] = useState(true);

    const {
        searchCategory, searchVariant, searchRarity, searchColor, searchBorder, searchType, searchFavorites,
        searchAttr7, searchAttr8, searchAttr9, searchAttr10, maxPrice, minPrice, minAether, maxAether, minMint, maxMint,
        searchOwner, searchTerm, searchAuthor, searchSearch, searchSettings, setVars, setSearchOwner, exactSearch,
        orderBy, searchOfferType, isLoading, searchVerified, searchLimit, ownerTerm, setMaxPrice, setMinPrice,
        setMinMint, setMaxMint, setMinAether, setMaxAether, bulk, authorCategories, clearFilters, cleared, tab
    } = props;

    const initFilters = () => {
        const startFilters = [];

        if (searchCategory || searchAuthor) {
            startFilters.push('category');
        }
        if (searchRarity || searchAuthor) {
            startFilters.push('rarity');
        }
        if (searchVariant) {
            startFilters.push('variant');
        }
        if (searchColor) {
            startFilters.push('color');
        }
        if (searchBorder) {
            startFilters.push('border');
        }
        if (searchType) {
            startFilters.push('type');
        }
        if (searchFavorites) {
            startFilters.push('favorites');
        }
        if (searchAttr7) {
            startFilters.push('attr7');
        }
        if (searchAttr8) {
            startFilters.push('attr8');
        }
        if (searchAttr9) {
            startFilters.push('attr9');
        }
        if (searchAttr10) {
            startFilters.push('attr10');
        }
        if (maxPrice || minPrice) {
            startFilters.push('price');
        }
        if (maxAether || minAether) {
            startFilters.push('aether');
        }
        if (maxMint || minMint) {
            startFilters.push('mint');
        }
        if (searchOwner) {
            startFilters.push('owner');
        }
        if (searchTerm) {
            startFilters.push('name');
        }

        return startFilters;
    };

    const [filters, setFilters] = useState(initFilters());

    useEffect(() => {}, [filters.length]);

    const isPackSearch = searchSearch === 'ft_packs' || searchSearch === 'my_ft_packs';

    const targetTab = searchSettings ? searchSettings['tab'] : null;

    const variantName = getVariantName(t, searchAuthor, searchCategory);

    const rarityName = getRarityName(t, searchAuthor, searchCategory);

    const colorName = getColorName(t, searchAuthor, searchCategory);

    const borderName = getBorderName(t, searchAuthor, searchCategory);

    const typeName = getTypeName(t, searchAuthor, searchCategory);

    const attr7Name = getAttributeName(t, searchAuthor, searchCategory, 0);

    const attr8Name = getAttributeName(t, searchAuthor, searchCategory, 1);

    const attr9Name = getAttributeName(t, searchAuthor, searchCategory, 2);

    const attr10Name = getAttributeName(t, searchAuthor, searchCategory, 3);

    let searchDropDownOptions = [
        { value: 'sales', label: 'Standard' },
        { value: 'cheapest', label: t('search.cheapest')},
        { value: 'below_average', label: t('search.below_average') },
        { value: 'below_last_sold', label: t('search.below_last_sold') },
        { value: 'trades', label: t('search.trades')},
        { value: 'assets', label: t('search.assets')},
        { value: 'burned', label: t('search.burned')},
        { value: 'staked', label: t('asset.staked')},
        { value: 'tubed', label: t('asset.tubed')},
        { value: 'bundles', label: t('search.bundles')},
    ];

    if (bulk)
        searchDropDownOptions = [
            { value: 'bulk_sell', label: t('search.bulk_sell')},
            { value: 'bulk_burn', label: t('search.bulk_burn')},
            { value: 'bulk_stake', label: t('asset.stake')},
            { value: 'bulk_unstake', label: t('asset.unstake')},
            { value: 'bulk_edit', label: t('search.bulk_edit')},
            { value: 'bulk_sell_dupes', label: t('search.bulk_sell_dupes')},
            { value: 'bulk_sell_highest_duplicates', label: t('search.bulk_sell_highest_duplicates')},
            { value: 'bulk_cancel', label: t('asset.cancel')},
            { value: 'bulk_buy', label: t('asset.buy')},
            { value: 'bulk_transfer', label: t('search.bulk_transfer')},
            { value: 'bulk_transfer_duplicates', label: t('search.bulk_transfer_duplicates')},
            { value: 'bulk_transfer_lowest_mints', label: t('search.bulk_transfer_lowest_mints')},
            { value: 'bulk_distribute', label: t('search.bulk_distribute')},
            { value: 'bulk_bundle', label: t('search.bundle')},
            { value: 'bulk_bundle_highest_mints', label: t('search.bundle_highest_mints')},
            { value: 'bulk_bundle_lowest_mints', label: t('search.bundle_lowest_mints')},
            { value: 'bulk_bundle_highest_duplicates', label: t('search.bundle_highest_duplicates')}
        ];

    const limitDropDownOptions = [
        { value: 40,  label: t('search.x_results', {x: 40}) } ,
        { value: 100, label: t('search.x_results', {x: 100}) } ,
        { value: 200, label: t('search.x_results', {x: 200}) } ,
        { value: 300, label: t('search.x_results', {x: 300}) } ,
        { value: 400, label: t('search.x_results', {x: 400}) }
    ];

    if (targetTab === 'inventory' && userName)
        searchDropDownOptions = [
            { value: 'assets', label: t('search.my_assets')},
            { value: 'duplicates', label: t('search.duplicates')},
            { value: 'highest_duplicates', label: t('search.highest_duplicates')},
            { value: 'my_packs', label: t('search.my_packs')},
            { value: 'lowest_mints', label: t('search.lowest_mints')},
            { value: 'highest_mints', label: t('search.highest_mints')},
            { value: 'staked', label: t('asset.staked')},
            { value: 'tubed', label: t('asset.tubed')},
        ];
    else if(targetTab === 'assets')
        searchDropDownOptions = [
            { value: 'assets', label: t('search.all_assets')},
            { value: 'burned', label: t('search.burned')},
            { value: 'staked', label: t('asset.staked')},
            { value: 'tubed', label: t('asset.tubed')},
        ];
    else if(targetTab === 'templates')
        searchDropDownOptions = [
            { value: 'templates', label: t('search.templates')},
        ];
    else if(targetTab === 'favorites')
        searchDropDownOptions = [
            { value: 'favorites', label: t('search.favorites')}
        ];
    else if(targetTab === 'new-trade')
        searchDropDownOptions = [{ value: 'tradable', label: t('trade.tradable')}];
    else if(targetTab === 'bundles')
        searchDropDownOptions = [{ value: 'bundles', label: t('search.bundles')}];
    else if (targetTab === 'sales') {
        searchDropDownOptions = [
            { value: 'sales', label: 'Standard' } ,
            { value: 'cheapest', label: 'Cheapest'},
        ];
        if (userName) {
            searchDropDownOptions.push({ value: 'cheapest_missing', label: t('search.cheapest_missing')});
            searchDropDownOptions.push({ value: 'missing', label: 'Missing'});
        }
        searchDropDownOptions.push(
            { value: 'aether_listings', label: 'Aether' }
        );
        searchDropDownOptions.push(
            { value: 'below_average', label: t('search.below_average') }
        );
        searchDropDownOptions.push(
            { value: 'below_last_sold', label: t('search.below_last_sold') }
        );
    }
    else if (targetTab === 'auctions')
        searchDropDownOptions = [
            { value: 'sales', label: 'Standard' } ,
            { value: 'below_average', label: t('search.below_average') },
            { value: 'below_last_sold', label: t('search.below_last_sold') }
        ];
    else if (targetTab === 'packs')
        searchDropDownOptions = [
            { value: 'packs', label: t('overview.packs')}
        ];

    const selectAuthor = searchAuthor;

    const categoryDropDownOptions = authorCategories ? createCategories(authorCategories['categories'].filter(
        item => item['category'] !== null && (
            !selectAuthor || searchAuthor === item['author'] || item['artist'] === selectAuthor)),
        'All') : null;

    const rarityDropDownOptions = authorCategories ? createRarities(authorCategories['categories'].filter(
        item => searchAuthor ? searchAuthor === item['author'] && item['rarity'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchColor || item['color'] === searchColor)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
            && (!searchType || item['type'] === searchType)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchCategory || item['category'] === searchCategory) : item['rarity'] !== null), 'All') : null;

    const variantDropDownOptions = authorCategories ? createVariants(authorCategories['categories'].filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['variant'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
                && (!searchType || item['type'] === searchType)
                && (!searchColor || item['color'] === searchColor)
                && (!searchAttr7 || item['attr7'] === searchAttr7)
                && (!searchAttr8 || item['attr8'] === searchAttr8)
                && (!searchAttr9 || item['attr9'] === searchAttr9)
                && (!searchAttr10 || item['attr10'] === searchAttr10)
                && (!searchCategory || item['category'] === searchCategory) : item['variant'] !== null),
        'All') : null;

    const colorDropDownOptions = authorCategories ? createColors(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['color'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
            : item['color'] !== null), 'All') : null;

    const attr7Options = authorCategories ? createAttributes(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr7'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
            : item['attr7'] !== null), 'attr7', 'All') : null;

    const attr8Options = authorCategories ? createAttributes(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr8'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchBorder || !item['border'] ||  item['border'].toString() === searchBorder.toString())
            : item['attr8'] !== null), 'attr8', 'All') : null;

    const attr9Options = authorCategories ? createAttributes(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr9'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchBorder || !item['border'] ||  item['border'].toString() === searchBorder.toString())
            : item['attr9'] !== null), 'attr9', 'All') : null;

    const attr10Options = authorCategories ? createAttributes(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr10'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchBorder || !item['border'] ||  item['border'].toString() === searchBorder.toString())
            : item['attr10'] !== null), 'attr10', 'All') : null;

    const borderDropDownOptions = authorCategories ? createBorders(authorCategories['categories'].filter(
            item => searchAuthor ? item['author'] === searchAuthor && item['border'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchVariant || item['variant'] === searchVariant)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchType || item['type'] === searchType)
                && (!searchAttr7 || item['attr7'] === searchAttr7)
                && (!searchAttr8 || item['attr8'] === searchAttr8)
                && (!searchAttr9 || item['attr9'] === searchAttr9)
                && (!searchAttr10 || item['attr10'] === searchAttr10)
                && (!searchColor || item['color'] === searchColor) : item['border'] !== null),
        '-') : null;

    const typeDropDownOptions = authorCategories ? createTypes(authorCategories['categories'].filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['type'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchAttr9 || item['attr9'] === searchAttr9)
            && (!searchAttr10 || item['attr10'] === searchAttr10)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
            : item['type'] !== null), 'All') : null;


    const filterDropDownOptions = [];

    filterDropDownOptions.push({ value: '', label: 'Add Filter' });

    if (categoryDropDownOptions && !filters.includes('category')) {
        filterDropDownOptions.push({ value: 'category', label: t('asset.category') });
    }

    if (variantDropDownOptions && !filters.includes('variant')) {
        filterDropDownOptions.push({ value: 'variant', label: variantName });
    }

    if (rarityDropDownOptions && !filters.includes('rarity')) {
        filterDropDownOptions.push({ value: 'rarity', label: rarityName });
    }

    if (colorDropDownOptions && !filters.includes('color')) {
        filterDropDownOptions.push({ value: 'color', label: colorName });
    }

    if (borderDropDownOptions && !filters.includes('border')) {
        filterDropDownOptions.push({ value: 'border', label: borderName });
    }

    if (typeDropDownOptions && !filters.includes('type')) {
        filterDropDownOptions.push({ value: 'type', label: typeName });
    }

    if (attr7Options && !filters.includes('attr9')) {
        filterDropDownOptions.push({ value: 'attr7', label: attr7Name });
    }

    if (attr8Options && !filters.includes('attr8')) {
        filterDropDownOptions.push({ value: 'attr8', label: attr8Name });
    }

    if (attr9Options && !filters.includes('attr9')) {
        filterDropDownOptions.push({ value: 'attr9', label: attr9Name });
    }

    if (attr10Options && !filters.includes('attr10') && attr10Name !== 'Video') {
        filterDropDownOptions.push({ value: 'attr10', label: attr10Name });
    }

    if (!filters.includes('owner')) {
        filterDropDownOptions.push({value: 'owner', label: ownerTerm});
    }

    if (!filters.includes('name')) {
        filterDropDownOptions.push({ value: 'name', label: t('search.name') });
    }

    if (!filters.includes('number')) {
        filterDropDownOptions.push({ value: 'number', label: getNumberName(t, searchAuthor) });
    }

    if (!filters.includes('asset_id')) {
        filterDropDownOptions.push({ value: 'asset_id', label: 'Asset ID' });
    }

    if (!filters.includes('template_id')) {
        filterDropDownOptions.push({ value: 'template_id', label: 'Template ID' });
    }

    if (!filters.includes('mint')) {
        filterDropDownOptions.push({ value: 'mint', label: t('asset.mint') });
    }

    if (!filters.includes('price')) {
        filterDropDownOptions.push({ value: 'price', label: t('asset.price') });
    }

    if (!filters.includes('aether')) {
        filterDropDownOptions.push({ value: 'aether', label: 'min/max Aether' });
    }

    if (!filters.includes('favorites')) {
        filterDropDownOptions.push({ value: 'favorites', label: t('search.favorites') });
    }

    const applyPriceRange = (min, max) => {
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory,
            searchRarity, searchVariant, exactSearch, orderBy, searchSearch, searchOfferType, min,
            max, minMint, maxMint, searchColor, searchBorder, searchType, searchAttr7, searchAttr8,
            searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const applyAetherRange = (min, max) => {
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, orderBy,
            searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0, min,
            max
        );
    };

    const applyMintRange = (min, max) => {
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, orderBy,
            searchSearch, searchOfferType, minPrice, maxPrice, min, max, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const applyOwnerChange = (val) => {
        setVars(
            searchTerm, val, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, orderBy,
            searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const handleOwnerChange = (e) => {
        setSearchOwner(e.target.value);
    };

    const onSelectCategory = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let type = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;

        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.variant).includes(searchVariant);
            color = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.color).includes(searchColor);
            border = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            type = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.type).includes(searchType);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['category'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars(
            searchTerm, searchOwner, searchAuthor, e.value,
            rarity ? searchRarity : '',  variant ? searchVariant : '', exactSearch, orderBy, searchSearch,
            searchOfferType, minPrice, maxPrice, minMint, maxMint, color ? searchColor : '', border ? searchBorder : '',
            type ? searchType : '', attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '',
            attr10 ? searchAttr10 : '', searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const onSelectLimit = (e) => {
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory,
            searchRarity, searchVariant, exactSearch, orderBy, searchSearch, searchOfferType, minPrice,
            maxPrice, minMint, maxMint, searchColor, searchBorder, searchType, searchAttr7, searchAttr8, searchAttr9,
            searchAttr10, searchVerified, searchFavorites, e.value, 0
        );
    };

    const getOrder = (search, def) => {
        let order = def;

        if (['assets', 'duplicates', 'highest_duplicates', 'packs'].includes(search)) {
            order = 'date_desc'
        } else if (search === 'trades') {
            order = 'date_desc'
        } else if (search === 'templates') {
            order = 'template_id_desc'
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

    const onSelectSearch = (e) => {
        let order = getOrder(e.value, orderBy);
        
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity , searchVariant, exactSearch, order,
            e.value, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const onSelectAuthor = (e) => {
        let category = true;
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let type = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;

        let author = e;
        if (e === searchAuthor)
            author = '';

        if (authorCategories) {
            category = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.category).includes(searchCategory);
            rarity = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.variant).includes(searchVariant);
            color = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.color).includes(searchColor);
            border = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            type = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.type).includes(searchType);
            attr7 = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !author || item['author'] === e).map(
                item => item.attr10).includes(searchAttr10);
        }

        setVars( searchTerm, searchOwner, author, category ? searchCategory : '', rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice, maxPrice,
            minMint, maxMint, color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '',
            searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const onCheckVerified = () => {
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch,
            orderBy, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder,
            searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, !searchVerified, searchFavorites,
            searchLimit, 0
        );
    };

    const onSelectRarity = (e) => {
        let variant = true;
        let color = true;
        let type = true;
        let border = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            color = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.color).includes(searchColor);
            variant = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['rarity'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, e.value,  variant ? searchVariant : '', exactSearch,
            orderBy, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint,
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectVariant = (e) => {
        let color = true;
        let rarity = true;
        let type = true;
        let border = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            color = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.color).includes(searchColor);
            type = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['variant'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',  e.value,
            exactSearch, orderBy, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint,
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectColor = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['color'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice,
            maxPrice, minMint, maxMint, e.value, border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '',
            searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const onSelectAttr7 = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let color = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            color = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.color).includes(searchColor);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['attr7'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice,
            maxPrice, minMint, maxMint, color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            e.value, attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectAttr8 = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let color = true;
        let attr7 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            color = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.color).includes(searchColor);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['attr8'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice,
            maxPrice, minMint, maxMint, color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', e.value, attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectAttr9 = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let color = true;
        let attr7 = true;
        let attr8 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            color = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.color).includes(searchColor);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['attr9'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory,
            rarity ? searchRarity : '',  variant ? searchVariant : '', exactSearch, orderBy, searchSearch,
            searchOfferType, minPrice, maxPrice, minMint, maxMint, color ? searchColor : '', border ? searchBorder : '',
            type ? searchType : '', attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', e.value,
            attr10 ? searchAttr10 : '', searchVerified, searchFavorites, searchLimit, 0
        );
    };

    const onSelectAttr10 = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let color = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.variant).includes(searchVariant);
            type = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.type).includes(searchType);
            border = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            color = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.color).includes(searchColor);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['attr10'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
        }
        setVars(
            searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice,
            maxPrice, minMint, maxMint, color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', e.value, searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectBorder = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let type = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.variant).includes(searchVariant);
            color = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.color).includes(searchColor);
            type = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.type).includes(searchType);
            attr7 = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || (item['border'] && item['border']
            ).toString() === e.value).map(item => item.attr10).includes(searchAttr10);
        }
        setVars( 
            searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '',
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice, maxPrice,
            minMint, maxMint, color ? searchColor : '', e.value, type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified,
            searchFavorites, searchLimit, 0
        );
    };

    const onSelectType = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let attr7 = true;
        let attr8 = true;
        let attr9 = true;
        let attr10 = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.variant).includes(searchVariant);
            color = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.color).includes(searchColor);
            border = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            attr7 = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
            attr9 = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.attr9).includes(searchAttr9);
            attr10 = authorCategories['categories'].filter(item => !e.value || item['type'] === e.value).map(
                item => item.attr10).includes(searchAttr10);
        }
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, rarity ? searchRarity : '', 
            variant ? searchVariant : '', exactSearch, orderBy, searchSearch, searchOfferType, minPrice, maxPrice, 
            minMint, maxMint, color ? searchColor : '', border ? searchBorder : '', e.value, attr7 ? searchAttr7 : '', 
            attr8 ? searchAttr8 : '', attr9 ? searchAttr9 : '', attr10 ? searchAttr10 : '', searchVerified, 
            searchFavorites, searchLimit, 0
        );
    };

    const handleUserChange = (e) => {
        if (userName) {
            setVars(searchTerm, userName, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, 
                orderBy, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder,
                searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, searchFavorites, 
                searchLimit, 0
            );
        }
    };

    const onCheckFavorites = () => {
        setVars( searchTerm, searchOwner, searchAuthor, searchCategory, searchRarity, searchVariant, exactSearch, 
            orderBy, searchSearch, searchOfferType, minPrice, maxPrice, minMint, maxMint, searchColor, searchBorder, 
            searchType, searchAttr7, searchAttr8, searchAttr9, searchAttr10, searchVerified, 
            !searchFavorites, searchLimit, 0
        );
    };

    const getCategoryOption = (category) => {
        return categoryDropDownOptions.map(item => item.value).indexOf(category);
    };

    const getLimitOption = (limit) => {
        return limitDropDownOptions.map(item => item.value.toString()).indexOf(limit.toString());
    };

    const getRarityOption = (rarity) => {
        return rarityDropDownOptions.map(item => item.value).indexOf(rarity);
    };

    const getVariantOption = (variant) => {
        return variantDropDownOptions.map(item => item.value).indexOf(variant);
    };

    const getColorOption = (color) => {
        return colorDropDownOptions.map(item => item.value).indexOf(color);
    };

    const getAttributeOption = (list, value) => {
        return list.map(item => item.value).indexOf(value);
    };

    const getBorderOption = (border) => {
        if (border === undefined)
            return 0;
        return borderDropDownOptions.map(item => item.value.toString()).indexOf(
            border || border === 0 ? border.toString() : 0);
    };

    const getTypeOption = (type) => {
        return typeDropDownOptions.map(item => item.value).indexOf(type);
    };

    const getSearchOption = (search) => {
        return searchDropDownOptions.map(item => item.value).indexOf(search);
    };

    const defaultSearchOption = searchDropDownOptions[getSearchOption(searchSearch)];
    const defaultCategoryOption = categoryDropDownOptions ? categoryDropDownOptions[getCategoryOption(searchCategory)] : null;
    const defaultLimitOption = limitDropDownOptions ? limitDropDownOptions[getLimitOption(searchLimit)] : null;
    const defaultRarityOption = rarityDropDownOptions ? rarityDropDownOptions[getRarityOption(searchRarity)]: null;
    const defaultVariantOption = variantDropDownOptions ? variantDropDownOptions[getVariantOption(searchVariant)] : null;
    const defaultBorderOption = borderDropDownOptions ? borderDropDownOptions[getBorderOption(searchBorder)]: null;
    const defaultTypeOption = typeDropDownOptions ? typeDropDownOptions[getTypeOption(searchType)]: null;
    const defaultColorOption = colorDropDownOptions ? colorDropDownOptions[getColorOption(searchColor)] : null;
    const defaultAttr7Option = attr7Options ? attr7Options[getAttributeOption(attr7Options, searchAttr7)] : null;
    const defaultAttr8Option = attr8Options ? attr8Options[getAttributeOption(attr8Options, searchAttr8)] : null;
    const defaultAttr9Option = attr9Options ? attr9Options[getAttributeOption(attr9Options, searchAttr9)] : null;
    const defaultAttr10Option = attr10Options ? attr10Options[getAttributeOption(attr10Options, searchAttr10)] : null;

    const toggleShow = () => {
        setShow(!show);
    }

    return (
        <div
            className={cn(
                'overflow-x-hidden p-4',
                'bg-paper rounded-2xl shadow',
                'w-full bg-gradient-to-b from-bluet via-blueg to-browng',
                {'md:w-14 md:h-28 ': tab !== 'new-trade' && !show},
                {'md:w-1/5 xl:w-1/6': tab !== 'new-trade' && show},
                {'c-h-page': tab !== 'new-trade'}
            )}
        >
            <div className={cn(
                'relative mb-8 cursor-pointer',
                {'h-4': show},
                {'h-12 mb-0': !show}
            )} onClick={toggleShow}>
                <div className={cn(
                    'pl-2 m-auto text-lg text-left',
                    {'md:transform md:-rotate-90 md:relative md:top-10': !show}
                )}>Filters</div>
                <div className={cn(
                    'absolute m-auto right-0 top-0',
                    {'hidden md:block': show},
                    {'block md:hidden': !show}
                )}>
                    <img
                        src="/close_btn_y.svg"
                        className={cn(
                            'm-2 h-4 w-4',
                        )} alt="X"
                    />
                </div>
            </div>
            <div className={cn(
                {'hidden md:block': show},
                {'block md:hidden': !show}
            )} >
                <FilterElement
                    title={'Listing Type'}
                    active={true}
                >
                    <SelectionField
                        options={searchDropDownOptions}
                        onChange={onSelectSearch}
                        value={defaultSearchOption}
                        id="DropdownField1"
                        disabled={ (searchSettings && searchSettings['search_type'] && searchSettings['search_type']['fixed']) || isLoading ? 'disabled' : '' }
                    />
                </FilterElement>
                <FilterElement
                    title={t('navigation.collections')}
                    active={true}
                >
                    <CollectionSelector
                        searchAuthor={searchAuthor}
                        searchVerified={searchVerified}
                        selectAuthor={onSelectAuthor}
                        checkVerified={onCheckVerified}
                        searchItem={true}
                    />
                </FilterElement>
                { categoryDropDownOptions ?
                    <FilterElement
                        title={t('search.category')}
                        active={searchCategory}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={categoryDropDownOptions}
                            onChange={onSelectCategory}
                            value={defaultCategoryOption}
                            placeholder={t('search.category')}
                            id="DropdownField3"
                            disabled={ searchSearch === 'bulk_burn' || !categoryDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : ''
                }
                { rarityDropDownOptions ?
                    <FilterElement
                        title={rarityName}
                        active={searchRarity}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={rarityDropDownOptions}
                            onChange={onSelectRarity}
                            value={defaultRarityOption}
                            placeholder={rarityDropDownOptions[0].value}
                            id="DropdownField5"
                            disabled={ isPackSearch || searchSearch === 'bulk_burn' || !rarityDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { variantDropDownOptions ?
                    <FilterElement
                        title={variantName}
                        active={searchVariant}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={variantDropDownOptions}
                            onChange={onSelectVariant}
                            value={defaultVariantOption}
                            placeholder={variantDropDownOptions[0].label}
                            id="DropdownField4"
                            disabled={ isPackSearch || !variantDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : ''
                }
                { typeDropDownOptions ?
                    <FilterElement
                        title={typeName}
                        active={searchType}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={typeDropDownOptions}
                            onChange={onSelectType}
                            value={defaultTypeOption}
                            placeholder={typeDropDownOptions[0].label}
                            id="DropdownField7"
                            disabled={ isPackSearch || !typeDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : ''
                }
                { borderDropDownOptions ?
                    <FilterElement
                        title={borderName}
                        active={searchBorder || searchBorder === 0}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={borderDropDownOptions}
                            onChange={onSelectBorder}
                            value={defaultBorderOption}
                            placeholder={borderDropDownOptions[0].label}
                            id="DropdownField8"
                            disabled={ isPackSearch || !borderDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { colorDropDownOptions ?
                    <FilterElement
                        title={colorName}
                        active={searchColor}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={colorDropDownOptions}
                            onChange={onSelectColor}
                            value={defaultColorOption}
                            placeholder={colorDropDownOptions[0].label}
                            id="DropdownField9"
                            disabled={ isPackSearch || !colorDropDownOptions || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { attr7Options ?
                    <FilterElement
                        title={attr7Name}
                        active={searchAttr7}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={attr7Options}
                            onChange={onSelectAttr7}
                            value={defaultAttr7Option}
                            placeholder={attr7Options[0].label}
                            id="DropdownField10"
                            disabled={ isPackSearch || !attr7Options || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : ''
                }
                { attr8Options ?
                    <FilterElement
                        title={attr8Name}
                        active={searchAttr8}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={attr8Options}
                            onChange={onSelectAttr8}
                            value={defaultAttr8Option}
                            placeholder={attr8Options[0].label}
                            id="DropdownField11"
                            disabled={ isPackSearch || !attr8Options || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { attr9Options ?
                    <FilterElement
                        title={attr9Name}
                        active={searchAttr9}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={attr9Options}
                            onChange={onSelectAttr9}
                            value={defaultAttr9Option}
                            placeholder={attr9Options[0].label}
                            id="DropdownField12"
                            disabled={ isPackSearch || !attr9Options || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { attr10Options ?
                    <FilterElement
                        title={attr10Name}
                        active={searchAttr10}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={attr10Options}
                            onChange={onSelectAttr10}
                            value={defaultAttr10Option}
                            placeholder={attr10Options[0].label}
                            id="DropdownField13"
                            disabled={ isPackSearch || isLoading || !searchAuthor ? 'disabled' : '' }
                        />
                    </FilterElement> : ''
                }
                { limitDropDownOptions && searchSearch.includes('bulk') ?
                    <FilterElement
                        title={t('search.limit')}
                        cleared={cleared}
                    >
                        <SelectionField
                            options={limitDropDownOptions}
                            onChange={onSelectLimit}
                            value={defaultLimitOption}
                            placeholder={t('search.limit')}
                            id="DropdownFieldLimit"
                            disabled={ !limitDropDownOptions || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement>  : ''
                }
                <FilterElement
                    title={ownerTerm}
                    active={searchOwner}
                    cleared={cleared}
                >
                    <InputSearch
                        placeholder={ownerTerm}
                        applyTerm={applyOwnerChange}
                        handleTermChange={handleOwnerChange}
                        value={searchOwner ? searchOwner : ''}
                        disabled={ isPackSearch || isLoading || (searchSettings && searchSettings['owner'] && searchSettings['owner']['fixed']) ? 'disabled' : '' }
                    />
                    { userName && userName !== searchOwner && !(isPackSearch || isLoading) && !(
                        searchSettings['owner'] && searchSettings['owner']['fixed']) ?
                        <div className="AutoFillButton" onClick={handleUserChange}>
                            <img src="/person-outline.svg" />
                        </div> : '' }
                </FilterElement>
                <form>
                    {['sales', 'missing', 'below_last_sold', 'cheapest_missing', 'bundles', 'trades',
                      'cheapest', 'packs', 'ft_packs', 'bulk_buy'].includes(searchSearch) ?
                    <FilterElement
                        title={'Price'}
                        active={minPrice || maxPrice}
                        cleared={cleared}
                    >
                        <RangeField
                            disabled={isLoading ? 'disabled' : ''}
                            minVal={minPrice}
                            maxVal={maxPrice}
                            setMin={setMinPrice}
                            setMax={setMaxPrice}
                            applyRange={applyPriceRange}
                            useFloat={true}
                            name={'price'}
                        />
                    </FilterElement> : ''}
                    <FilterElement
                        title={'Aether'}
                        active={minAether || maxAether}
                        cleared={cleared}
                    >
                        <RangeField
                            disabled={isLoading ? 'disabled' : ''}
                            minVal={minAether}
                            maxVal={maxAether}
                            applyRange={applyAetherRange}
                            setMin={setMinAether}
                            setMax={setMaxAether}
                            useFloat={true}
                            name={'aether'}
                        />
                    </FilterElement>
                    {['bundles', 'ft_packs'].includes(searchSearch) ? '' :
                    <FilterElement
                        title={'Mint'}
                        active={minMint || maxMint}
                        cleared={cleared}
                    >
                        <RangeField
                            disabled={isPackSearch || isLoading ? 'disabled' : '' }
                            minVal={minMint}
                            maxVal={maxMint}
                            applyRange={applyMintRange}
                            setMin={setMinMint}
                            setMax={setMaxMint}
                            useFloat={false}
                            name={'mint'}
                        />
                    </FilterElement>}
                </form>
                <FilterElement
                    title={'Favorites'}
                    active={searchFavorites}
                    cleared={cleared}
                >
                    <div className={userName && !isPackSearch ? "SettingsElementCheck FilterElement" :
                        "SettingsElementCheck Hidden"}
                    >
                        <div className={cn('flex p-2')}
                             onClick={onCheckFavorites}
                        >
                            <div>{t('search.favorites')}</div>
                            { searchFavorites ?
                                <img className={'h-5 w-5 m-auto'} src="/star.svg" alt="fav"/> :
                                <img className={'h-5 w-5 m-auto'} src="/star-outline.svg" alt="fav"/>
                            }
                        </div>
                    </div>
                </FilterElement>
                <Input
                    name="ExactSearch"
                    type="hidden"
                    value={exactSearch === 'true' || exactSearch === true}
                    disabled={ isPackSearch || isLoading ? 'disabled' : '' }
                />
                <Button className={cn(
                    'flex justify-center mx-auto',
                    'bg-transparent text-black my-4 rounded',
                    'text-neutral border border-neutral'
                )} onClick={clearFilters}>
                    Clear
                </Button>
            </div>
        </div>
    );
}

export default SearchFilters;