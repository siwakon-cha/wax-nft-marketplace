import Dropdown from "react-dropdown";
import LoadingIndicator from "../loadingindicator";
import CollectionInfo from "./CollectionInfo";
import React, {useEffect, useState} from "react";
import {
    createCategories,
    createRarities,
    createVariants,
    getColorName,
    getTypeName,
    getVariantName,
    getRarityName,
    getBorderName,
    setQueryStringWithoutPageReload
} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";
import qs from "qs";
import {useTranslation} from "react-i18next";


const CollectionStats = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const searchAuthor = props['searchAuthor'];
    const [searchOrderBy, setSearchOrderBy] = useState(values['order_by'] ? values['order_by'] : 'score');
    const [searchLimit, setSearchLimit] = useState(100);
    const [searchCategory, setSearchCategory] = useState(values['category'] ? values['category'] : '');
    const [searchVariant, setSearchVariant] = useState(values['variant'] ? values['variant'] : '');
    const [searchRarity, setSearchRarity] = useState(values['rarity'] ? values['rarity'] : '');
    const [collectionResults, setCollectionResults] = useState([]);
    const [authorCategories, setAuthorCategories] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [sortDir, setSortDir] = useState(1);
    const [sortBy, setSortBy] = useState('number');

    const {t} = useTranslation('common');

    const initPage = async() => {
        {
            let variant = true;
            let rarity = true;
            let category = true;

            const data = await get(`author-categories?author=${searchAuthor}`).then(result => {setAuthorCategories(result); return result;});

            if (data) {
                rarity = data['categories'].filter(item => item['author'] === searchAuthor).map(item => item.rarity).includes(searchRarity);
                variant = data['categories'].filter(item => item['author'] === searchAuthor).map(item => item.variant).includes(searchVariant);
                category = data['categories'].filter(item => item['author'] === searchAuthor).map(item => item.category).includes(searchCategory);
            }
            searchShit(searchAuthor, category ? searchCategory : '', variant ? searchVariant : '', rarity ? searchRarity : '', 'score', searchLimit, true);
        }
    };

    const updateQueryStr = (order_by, limit, category, variant, rarity, initial) => {
        const query = values;
        if (order_by && order_by !== 'score')
            query['order_by'] = order_by;
        if (category)
            query['category'] = category;
        if (variant)
            query['variant'] = variant;
        if (rarity)
            query['rarity'] = rarity;

        if (!initial)
            setQueryStringWithoutPageReload(qs.stringify(query));
    };

    const getSearchResult = (result) => {
        setIsLoading(false);
        return result;
    };

    const searchShit = async(author, category, variant, rarity, order_by='score', limit=100, initial=false) => {

        setIsLoading(true);

        setSearchOrderBy(order_by);
        setSearchLimit(limit);
        setSearchCategory(category);
        setSearchVariant(variant);
        setSearchRarity(rarity);

        updateQueryStr(order_by, limit, category, variant, rarity, initial);

        const colSearchPath = `collections?author=${author}&category=${category}&variant=${variant}&rarity=${rarity}`;

        if (limit === 100)
            setCollectionResults([]);

        const colResult = await get(colSearchPath, 'set-api').then(getSearchResult);

        setCollectionResults(colResult);

        setIsLoading(false);
    };

    useEffect(() => {
        initPage();
    }, []);

    const selectSortBy = (key) => {
        if (key === sortBy) {
            setSortDir(sortDir * -1)
        } else {
            setSortDir(1)
        }
        setSortBy(key)
    };

    const onSelectCategory = (e) => {
        let variant = true;
        let rarity = true;
        if (authorCategories) {
            rarity = authorCategories['categories'].filter(item => item['category'] === e.value).map(item => item.rarity).includes(searchRarity);
            variant = authorCategories['categories'].filter(item => item['category'] === e.value).map(item => item.variant).includes(searchVariant);
        }
        searchShit(searchAuthor, e.value, variant ? searchVariant : '',  rarity ? searchRarity : '', searchOrderBy, searchLimit);
    };

    const categoryDropDownOptions = authorCategories ? createCategories(authorCategories['categories'].filter(item => searchAuthor ? item['author'] === searchAuthor && item['category'] !== null : item['category'] !== null), t('ranking.category')) : null;
    const rarityDropDownOptions = authorCategories ? createRarities(authorCategories['categories'].filter(item => searchAuthor ? item['author'] === searchAuthor && item['rarity'] !== null : item['rarity'] !== null), t('ranking.rarity')) : null;
    const variantDropDownOptions = authorCategories ? createVariants(authorCategories['categories'].filter(item => searchAuthor ? item['author'] === searchAuthor && item['variant'] !== null : item['variant'] !== null), t('ranking.variant')) : null;

    const getCategoryOption = (category) => {
        return categoryDropDownOptions.map(item => item.value).indexOf(category);
    };

    const getRarityOption = (rarity) => {
        return rarityDropDownOptions.map(item => item.value).indexOf(rarity);
    };

    const getVariantOption = (variant) => {
        return variantDropDownOptions.map(item => item.value).indexOf(variant);
    };

    const defaultCategoryOption = categoryDropDownOptions ? categoryDropDownOptions[getCategoryOption(searchCategory)] : null;
    const defaultVariantOption = variantDropDownOptions ? variantDropDownOptions[getVariantOption(searchVariant)] : null;
    const defaultRarityOption = rarityDropDownOptions ? rarityDropDownOptions[getRarityOption(searchRarity)] : null;

    const onSelectRarity = (e) => {
        searchShit(searchAuthor, searchCategory, searchVariant, e.value, searchOrderBy, searchLimit);
    };

    const onSelectVariant = (e) => {
        searchShit(searchAuthor, searchCategory,  e.value, searchRarity, searchOrderBy, searchLimit);
    };

    const variantName = getVariantName(t, searchAuthor, searchCategory);

    const colorName = getColorName(t, searchAuthor, searchCategory);

    const typeName = getTypeName(t, searchAuthor, searchCategory);

    const rarityName = getRarityName(t, searchAuthor, searchCategory);

    const borderName = getBorderName(t, searchAuthor, searchCategory);

    return <div>
        <div className="StatSettings">
            <div className="SettingsElement">
                <Dropdown
                    options={categoryDropDownOptions}
                    onChange={onSelectCategory}
                    value={defaultCategoryOption}
                    placeholder={t('ranking.category')}
                    id="DropdownField"
                    disabled={ !categoryDropDownOptions || isLoading ? 'disabled' : '' }
                />
            </div>
            {searchAuthor !== 'kogsofficial' ? <div className="SettingsElement">
                <Dropdown
                    options={variantDropDownOptions}
                    onChange={onSelectVariant}
                    value={defaultVariantOption}
                    placeholder={variantName}
                    id="DropdownField"
                    disabled={ !variantDropDownOptions || isLoading ? 'disabled' : '' }
                />
            </div> : '' }
            <div className="SettingsElement">
                <Dropdown
                    options={rarityDropDownOptions}
                    onChange={onSelectRarity}
                    value={defaultRarityOption}
                    placeholder={rarityName}
                    id="DropdownField"
                    disabled={ !rarityDropDownOptions || isLoading ? 'disabled' : '' }
                />
            </div>
        </div>
        <div className="RankingTable">
            <table cellSpacing="0">
                <tr>
                    <th>{t('ranking.image')}</th>
                    <th onClick={() => selectSortBy('name')}>{t('ranking.name')}</th>
                    <th onClick={() => selectSortBy('number')}>{t('ranking.number')}</th>
                    <th onClick={() => selectSortBy('variant')}>{variantName}</th>
                    <th onClick={() => selectSortBy('rarity')}>{rarityName}</th>
                    {['darkcountryh', 'alien.worlds', 'kogsofficial'].includes(searchAuthor) ? <th onClick={() => selectSortBy('color')}>{colorName}</th> : '' }
                    {['kogsofficial'].includes(searchAuthor) ? <th onClick={() => selectSortBy('border')}>{borderName}</th> : '' }
                    {['darkcountryh', 'alien.worlds', 'kogsofficial'].includes(searchAuthor) ? <th onClick={() => selectSortBy('type')}>{typeName}</th> : '' }

                    {searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <th onClick={() => selectSortBy('difficulty')}>Difficulty</th> : '' }
                    {searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <th onClick={() => selectSortBy('delay')}>Delay</th> : '' }
                    {searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <th onClick={() => selectSortBy('ease')}>Ease</th> : '' }
                    {searchAuthor === 'alien.worlds' && 'tool.worlds' === searchCategory ? <th onClick={() => selectSortBy('luck')}>Luck</th> : '' }

                    <th onClick={() => selectSortBy('average')}>{t('ranking.average_wax')}</th>
                    <th onClick={() => selectSortBy('total')}>{t('asset.available')}</th>
                    <th onClick={() => selectSortBy('burned')}>{t('asset.burned')}</th>
                    <th onClick={() => selectSortBy('rarityScore')}>{t('ranking.rarity_score')}</th>
                </tr>
                {
                    isLoading && (!collectionResults || collectionResults.length === 0) ? (<LoadingIndicator/>) :
                    collectionResults.sort((a, b) => (Number.isNaN(a[sortBy]) ? ('' + b[sortBy]).localeCompare(a[sortBy]) : (b[sortBy] - a[sortBy])) * sortDir).map((collectionRow) => <CollectionInfo
                        searchAuthor={searchAuthor}
                        searchCategory={searchCategory}
                        collectionRow={collectionRow}
                        
                    />)
                }
            </table>
        </div>
    </div>;
};

export default CollectionStats;
