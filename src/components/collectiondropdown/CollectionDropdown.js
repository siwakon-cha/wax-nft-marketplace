import {
    createCollectionImageOption,
    createCollectionOption,
    createAuthors,
    setQueryStringWithoutPageReload
} from "../helpers/FormatLinks";

import React, {useContext, useEffect, useState} from "react";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {useTranslation} from "react-i18next";

import qs from 'qs';
import {Context} from "../waxplorer";
import {get} from "../helpers/Api";
import LoadingIndicator from "../loadingindicator";
import VerifiedCheck from "../verifiedcheck/VerifiedCheck";
import cn from "classnames";


const CollectionDropdown = (props) => {
    const {t} = useTranslation('common');

    const disableVerified = props['disableVerified'];
    const setAuthorsOnly = props['setAuthorsOnly'];

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const getValue = (key, def) => {
        if (values[key] || values[key] === false)
            return values[key];
        return def;
    };

    const [authors, setAuthors] = useState(null);
    const [isLoadingCollections, setIsLoadingCollections] = useState(false);
    const [state, dispatch] = useContext(Context);

    const [searchAuthor, setSearchAuthor] = useState(process.browser ? (props['searchAuthor'] ? props['searchAuthor'] : '*') : '*');
    const [authorSearch, setAuthorSearch] = useState('');
    const [searchTimer, setSearchTimer] = useState(null);

    const [searchVerified, setSearchVerified] = useState((props['searchVerified'] ? props['searchVerified'] : getValue(
        'verified', 'true')) !== 'false');

    const getDefaultOption = () => (
        { value: '', label: '-', title: '-'}
    );

    const [authorDropDownOptions, setAuthorDropDownOptions] = useState(authors ? createAuthors(
        authors, false, t('navigation.all_collections'), true) : [getDefaultOption(),
        { value: 'virl', title: 'virl', label: 'virl'},
        { value: 'vgo', title: 'virl', label: 'vgo'}
    ]);

    const checkVerified = props['checkVerified'];
    const selectAuthor = props['selectAuthor'];

    const searchItem = props['searchItem'];

    const onCheckVerified = () => {
        const query = values;

        if (searchVerified) {
            query['verified'] = 'false';
            setSearchVerified(false);
        } else {
            setSearchVerified(true);
            delete query['verified'];
        }

        if (checkVerified)
            checkVerified(searchVerified ? 'false' : 'true');

        setQueryStringWithoutPageReload(qs.stringify(query));
    };

    const onSearchAuthor = (e) => {
        setAuthorSearch(e.target.value);
    };

    const onSelectAuthor = (e) => {
        const query = values;

        const author = e ? e.value : '';

        if (selectAuthor)
            selectAuthor(author);

        query['category'] = '';

        query['collection'] = author;

        setSearchAuthor(author);

        setQueryStringWithoutPageReload(qs.stringify(query));

        setAuthorSearch(null);
    };

    const isLoading = state.isLoading;

    const createAuthorDropDownOptions = (authors) => {
        setAuthorDropDownOptions(createAuthors(authors, false, t('navigation.all_collections'), true));
        setAuthors(authors);
        setIsLoadingCollections(false);
    };

    const fetchAuthors = async (verified, term='') => {
        if ((!term || term.length > 2) && !isLoadingCollections) {
            if (searchTimer) {
                clearInterval(searchTimer);
            }

            setSearchTimer(setTimeout(async () => {
                setIsLoadingCollections(true);
                await get(
                    setAuthorsOnly? 'set-authors' : `authors/${verified}?term=${term ? term : ''}`,
                    setAuthorsOnly ? 'set-api' : 'api'
                ).then((result) => createAuthorDropDownOptions(result));
            }, 1000));
        }
    };

    useEffect(() => {
        if (searchAuthor !== state.searchAuthor) {
            dispatch({type: 'SET_COLLECTION', payload: searchAuthor ? searchAuthor : '*'});
            dispatch({type: 'SET_SWITCHED_TAB', payload: true});
        }
        if (!authors && process.browser)
            fetchAuthors(searchVerified);
    }, [searchAuthor]);

    useEffect(() => {
        if (process.browser)
            fetchAuthors(searchVerified, authorSearch);
        dispatch({type: 'SET_SWITCHED_TAB', payload: true});
    }, [searchVerified, authorSearch]);

    const getAuthorOption = (options, author) => {
        return options.map(item => item.value).indexOf(author);
    };

    const defaultOptions = [];

    let authorLocation = searchAuthor && searchAuthor !== '*' ? getAuthorOption(authorDropDownOptions, searchAuthor.split(',')[0]) : 0;

    if (authorLocation > authorDropDownOptions.length - 101) {
        authorLocation = Math.max(0, authorDropDownOptions.length - 101);
    }

    const length = authorDropDownOptions ? authorDropDownOptions.filter(
        option => !option || option === -1 || option === null || !defaultOptions.map(
            option => option && option.value).includes(option.value)).length : 0;

    const dropDownOptions = authorDropDownOptions ? authorDropDownOptions.filter(
        option => !option || option === -1 || option === null || !defaultOptions.map(
            option => option && option.value).includes(option.value)).slice(authorLocation, Math.min(length - authorLocation, authorLocation + 100)) : null;

    if (searchAuthor && searchAuthor !== '*')
        searchAuthor.split(',').map(author => {
            if (!defaultOptions.includes(dropDownOptions[getAuthorOption(dropDownOptions, author)]) && !(searchAuthor.split(',').length > 1 && author === '*') )
                defaultOptions.push(dropDownOptions[getAuthorOption(dropDownOptions, author)])
        });

    const option = searchAuthor && searchAuthor !== '*' ? getAuthorOption(dropDownOptions, searchAuthor.split(',')[0]) : -1;

    return (
        <div className="w-full lg:hidden">
            {authors ? <div
                className="CollectionElement"
            >
                <div className={cn('w-48')}>
                    <Autocomplete
                        multiple={!searchItem}
                        options={dropDownOptions}
                        getOptionLabel={(option) => option ? option.title : null}
                        renderOption={(option) => (
                            <React.Fragment>
                                { option.image ? createCollectionImageOption(
                                    option.title, option.image) : createCollectionOption(option.title) }
                            </React.Fragment>
                        )}
                        defaultValue={!searchItem ? defaultOptions : defaultOptions ? defaultOptions[0] : null}
                        id="collection-box"
                        style={{ width: '100%' }}
                        popupIcon={null}
                        deactivated={isLoading}
                        onChange={(event, newValue) => {
                            onSelectAuthor(newValue);
                        }}
                        onInput={(e) => onSearchAuthor(e)}
                        renderInput={(params) =>
                            <div className={option && option > 0 ? "CollectionDropdown" : "CollectionDropdown ChooseCollection"}>
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder={t('profile.collection')}
                                />
                            </div>
                        }
                    />
                    <VerifiedCheck searchVerified={searchVerified} onCheckVerified={onCheckVerified} />
                </div>
            </div> : <LoadingIndicator/> }
        </div>
    );
};

export default CollectionDropdown;
