import React, {useContext, useEffect, useState} from 'react';

import get from "../helpers/Api";

import LoadingIndicator from '../loadingindicator/LoadingIndicator';
import CollectionSet from './CollectionSet';
import qs from 'qs';
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import SetSearchFilters from "./SetSearchFilters";
import {Context} from "../waxplorer";
import cn from "classnames";
import Pagination from "../pagination/Pagination";


function SetsComponent(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const account = props['account'];

    const setsType = props['type'] ? props['type'] : 'default';

    const {t} = useTranslation('common');

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const [searchRarity, setSearchRarity] = useState(values['rarity'] ? values['rarity'] : null);
    const [searchCategory, setSearchCategory] = useState(values['category'] ? values['category'] : null);
    const [searchVariant, setSearchVariant] = useState(values['variant'] ? values['variant'] : null);
    const [searchColor, setSearchColor] = useState(values['color'] ? values['color'] : null);
    const [searchBorder, setSearchBorder] = useState(values['border'] ? values['border'] : null);
    const [searchType, setSearchType] = useState(values['type'] ? values['type'] : null);
    const [searchName, setSearchName] = useState(values['name'] ? values['name'] : null);
    const [searchAttr7, setSearchAttr7] = useState(values['attr7'] ? values['attr7'] : null);
    const [searchAttr8, setSearchAttr8] = useState(values['attr8'] ? values['attr8'] : null);
    const searchLimit = 10;
    const [searchOffset, setSearchOffset] = useState(values['offset'] ? parseInt(values['offset']) : 0);
    const [searchArtist, setSearchArtist] = useState(values['artist'] ? values['artist'] : null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [showMissing, setShowMissing] = useState(false);
    const [authorCategories, setAuthorCategories] = useState(null);
    const [searchCompleted, setSearchCompleted] = useState(values['completion'] ? values['completion'] : '');
    const [includeTubes, setIncludeTubes] = useState(!values['tubes'] || values['tubes'] === 'true');
    const [orderDir, setOrderDir] = useState('DESC');
    const [orderBy, setOrderBy] = useState(values['order_by'] ? values['order_by'] : 'completion');
    const [showMenu, setShowMenu] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const searchAuthor = props['collection'];

    const [ state, dispatch ] = useContext(Context);

    const categories = state.setCategories && state.setCategories[searchAuthor];

    const [searchSet, setSearchSet] = useState(values['set'] ? values['set'] : '');

    const getSearchResult = (result) => {
        setIsLoading(false);
        return result;
    };

    const router = useRouter();

    const setQueryStringWithoutPageReloadPush = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

    const searchShit = async(author, limit, offset) => {
        setIsLoading(true);

        let result = [];

        setSearchResults(result);

        const searchPath = `complex-collection-new?owner=${account}&author=${
            author && author !== '*' ? author : ''}&include_tubes=${includeTubes}&limit=${limit}&offset=${
            offset ? offset : 0}&category=${searchCategory ? searchCategory : ''}&variant=${
            searchVariant  ? (searchVariant.includes('#') || searchVariant.includes('&') || searchVariant.includes('?') ? escape(searchVariant) : searchVariant) : ''}&rarity=${
            searchRarity ? (searchRarity.includes('#') || searchRarity.includes('&') || searchRarity.includes('?') ? escape(searchRarity) : searchRarity) : ''}&color=${
            searchColor ? (searchColor.includes('#') || searchColor.includes('&') || searchColor.includes('?') ? escape(searchColor) : searchColor) : ''}&border=${searchBorder || searchBorder === 0 ? searchBorder : ''}&type=${
            searchType ? searchType : ''}&attr7=${searchAttr7 ? searchAttr7 : ''}&name=${searchName ? escape(searchName) : ''}&attr8=${
            searchAttr8 ? searchAttr8 : ''}&order_by=${orderBy ? orderBy : ''}&completion=${searchCompleted ? searchCompleted : ''}&order_dir=${
            orderDir ? orderDir : ''}&user_sets=${setsType === 'userSets' ? 'true' : 'false'}&set=${searchSet ? searchSet : ''}`;

        result = await get(searchPath, 'set-api').then(getSearchResult);

        setSearchResults(result);
        setTotalResults(result && result.length > 0 ? result[0].totalResults : 0);
    };

    const parseAuthorCategories = async (result) => {
        setAuthorCategories(result['authorCategories']);
    };

    const parseCollectionSets = (result) => {
        const dict = {};
        dict[result['authors'][0]] = result['categories'];
        dispatch({type: 'SET_SET_CATEGORIES', payload: dict });
    };

    const getInitialCollection = async () => {
        await get(`author-collection-names-new/${searchAuthor}`, 'set-api').then(result => parseAuthorCategories(result));

        get(`collection-sets-new/${searchAuthor}`, 'set-api').then(result => parseCollectionSets(result));

        searchShit(searchAuthor, searchLimit, searchOffset);

        setVars(searchAuthor, searchCategory, searchVariant, searchRarity, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchSet, searchArtist, searchName, searchOffset, includeTubes,
            searchCompleted, orderBy);
    };

    useEffect(() => {
        if (!account || !categories) {
            getInitialCollection();
        } else {
            searchShit(searchAuthor, searchLimit, searchOffset);
        }
    }, [account]);

    const handleOffsetChange = (offset) => {
        const query = setVars(searchAuthor, searchCategory, searchVariant, searchRarity, searchColor, searchBorder,
            searchType, searchAttr7, searchAttr8, searchSet, searchArtist, searchName, offset, includeTubes,
            searchCompleted, orderBy);

        setQueryStringWithoutPageReloadPush(qs.stringify(query));

        searchShit(searchAuthor, searchLimit, offset);
    };

    const applyVars = (author, category = '', variant = '', rarity = '', color = '', border = '', type = '', attr7 = '',
                     attr8 = '', set = '', artist = '', name = '', offset = 0, tubes = true, completion = '',
                     order_by = 'completion') => {
        const query = setVars(author, category, variant, rarity, color, border, type, attr7, attr8, set, artist, name,
            offset, tubes, completion, order_by);

        setQueryStringWithoutPageReloadPush(qs.stringify(query));

        searchShit(searchAuthor, searchLimit, offset);
    };

    const setVars = (author, category = '', variant = '', rarity = '', color = '', border = '', type = '', attr7 = '',
                     attr8 = '', set = '', artist = '', name = '', offset = 0, tubes = true, completion = '',
                     order_by = 'completion') => {
        const query = values;

        if (offset)
            query['offset'] = offset;
        else
            delete query['offset'];
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
        if (set)
            query['set'] = set;
        else
            delete query['set'];
        if (attr7)
            query['attr7'] = attr7;
        else
            delete query['attr7'];
        if (attr8)
            query['attr8'] = attr8;
        else
            delete query['attr8'];
        if (name)
            query['name'] = name;
        else
            delete query['name'];
        if (tubes === false)
            query['tubes'] = 'false';
        else
            delete query['tubes'];
        if (completion)
            query['completion'] = completion;
        else
            delete query['completed'];
        if (order_by && order_by !== 'completion')
            query['order_by'] = order_by;
        else
            delete query['order_by'];
        if (tubes === false)
            query['tubes'] = 'false';
        else
            delete query['tubes'];
        if (account && account !== userName)
            query['account'] = account;
        else
            delete query['account'];

        query['collection'] = author !== '*' ? author : '';

        setSearchOffset(offset);
        setSearchVariant(variant);
        setSearchRarity(rarity);
        setSearchName(name);
        setSearchCategory(category);
        setSearchAttr8(attr8);
        setSearchAttr7(attr7);
        setSearchSet(set);
        setSearchType(type);
        setSearchColor(color);
        setSearchBorder(border);
        setIncludeTubes(tubes);
        setSearchCompleted(completion);
        setOrderBy(order_by);

        return query;
    };

    const getPagination = (location) => {
        return (
            <Pagination
                result={searchResults}
                limit={searchLimit}
                offset={searchOffset}
                setOffset={handleOffsetChange}
                location={location}
            />
        )
    };

    return (
        <div className={cn(
            'flex flex-wrap w-full'
        )}>
            <SetSearchFilters
                searchAuthor={searchAuthor}
                searchCategory={searchCategory}
                searchRarity={searchRarity}
                searchVariant={searchVariant}
                searchColor={searchColor}
                searchType={searchType}
                searchName={searchName}
                searchBorder={searchBorder}
                categories={categories}
                searchAttr7={searchAttr7}
                searchAttr8={searchAttr8}
                searchSet={searchSet}
                searchArtist={searchArtist}
                setVars={applyVars}
                includeTubes={includeTubes}
                searchCompleted={searchCompleted}
                orderBy={orderBy}
                authorCategories={authorCategories}
                searchOffset={searchOffset}
                setIncludeTubes={setIncludeTubes}
                orderDir={orderDir}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                isLoading={isLoading}
            />
            {
                (
                    <div className={cn(
                        'w-full md:w-4/5 xl:w-5/6 pt-4 px-4',
                        {'flex flex-wrap': searchResults.length < searchLimit}
                    )}>
                        <div className={cn(
                            'relative flex text-neutral mt-0 mb-4'
                        )}>
                            { searchResults && searchResults.length > 0 ? (t('search.showing_x_of_y_results', {
                                x: `${searchOffset + 1} - ${Math.min(totalResults, searchOffset + searchResults.length)}`,
                                y: totalResults})) : (isLoading ? '' : t('search.0_results')) }
                        </div>
                    { getPagination('Top') }
                    { isLoading ? <LoadingIndicator /> : '' }
                        {
                            searchResults ? searchResults.map((setItem, index) => (
                                <CollectionSet
                                    index={index}
                                    showSet={index === 0 || searchResults.filter(item => (!searchCompleted || (searchCompleted === 'true' ? (item['numOwned'] === item['total']) : (item['numOwned'] !== item['total'])))).length < 4}
                                    
                                    searchResults={searchResults}
                                    item={setItem}
                                    searchOwner={account}
                                    showMissing={showMissing}
                                    collectionName={searchAuthor}
                                    searchColor={searchColor}
                                    searchType={searchType}
                                    searchAttr7={searchAttr7}
                                    searchAttr8={searchAttr8}
                                    searchVariant={searchVariant}
                                    searchRarity={searchRarity}
                                    searchBorder={searchBorder}
                                    isLoading={isLoading}
                                    includeTubes={includeTubes}
                                />
                            )) : ''
                        }
                    { getPagination('Bottom') }
                    </div>
                )
            }
        </div>
    );
}

export default SetsComponent;
