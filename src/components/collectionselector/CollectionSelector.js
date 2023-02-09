import {
    createAuthors
} from "../helpers/FormatLinks";

import React, {useContext, useEffect, useState} from "react";

import {useTranslation} from "react-i18next";

import qs from 'qs';
import {Context} from "../waxplorer";
import {get} from "../helpers/Api";
import LoadingIndicator from "../loadingindicator";
import cn from "classnames";
import {useRouter} from "next/router";
import VerifiedCheck from "../verifiedcheck/VerifiedCheck";


const CollectionSelector = (props) => {
    const {t} = useTranslation('common');

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
    const [authorSearch, setAuthorSearch] = useState('');

    const searchAuthor = props['searchAuthor'];
    const [searchTimer, setSearchTimer] = useState(null);

    const [searchVerified, setSearchVerified] = useState((props['searchVerified'] ? props['searchVerified'] : getValue(
        'verified', 'true')) !== 'false');

    const [authorDropDownOptions, setAuthorDropDownOptions] = useState(authors ? createAuthors(
        authors, false, t('navigation.all_collections'), true) : []);

    const checkVerified = props['checkVerified'];
    const selectAuthor = props['selectAuthor'];

    const router = useRouter();

    const setQueryStringWithoutPageReloadPush = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

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

        setQueryStringWithoutPageReloadPush(qs.stringify(query));
    };

    const onSearchAuthor = (e) => {
        setAuthorSearch(e.target.value);
    };

    const onSelectAuthor = (e) => {
        if (selectAuthor)
            selectAuthor(e ? e.value : '');
    };

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
        if (process.browser)
            fetchAuthors(searchVerified, authorSearch);
        dispatch({type: 'SET_SWITCHED_TAB', payload: true});
    }, [searchVerified, authorSearch]);

    const getAuthorOption = (options, author) => {
        return options.map(item => item.value).indexOf(author);
    };

    const defaultOptions = [];

    const dropDownOptions = authorDropDownOptions;

    if (searchAuthor && searchAuthor !== '*')
        searchAuthor.split(',').map(
            author => {
                if (!defaultOptions.includes(dropDownOptions[getAuthorOption(dropDownOptions, author)]) && !(
                    searchAuthor.split(',').length > 1 && author === '*') )
                    defaultOptions.push(dropDownOptions[getAuthorOption(dropDownOptions, author)])
            }
        );

    return (
        <div className={cn(
            'relative w-full p-2 m-auto'
        )}>
            <div className={cn(
                'flex h-12 border-t-2 border-r-2 border-l-2',
                'border-primaryt rounded-t-2xl bg-paper'
            )}>
                <input
                    className={cn(
                        'bg-transparent w-full px-2'
                    )}
                    type="Textfield"
                    variant="standard"
                    placeholder={t('profile.collection')}
                    onChange={onSearchAuthor}
                />
            </div>
            <div className={cn(
                'h-auto border-b-2 border-r-2 border-l-2',
                'border-primaryt rounded-b-2xl overflow-hidden',
                'bg-paper'
            )}>
                <div className={'h-48 overflow-y-auto InsideScroll m-2'}>
                {isLoadingCollections ? <LoadingIndicator/> : dropDownOptions.map(option =>
                    <div onClick={() => onSelectAuthor(option)} className={cn(
                    'flex hover:bg-bluet cursor-pointer transition transition-colors duration-300',
                        {'bg-bluet': option.value === searchAuthor}
                    )}>
                        <div className={cn('flex w-8 h-8 rounded-2xl p-1')}><img className={cn('m-auto')} src={option.image}/></div>
                        <div className={cn('flex text-neutral my-auto')}>{option.title}</div>
                    </div>
                )}
                </div>
            </div>
            <VerifiedCheck searchVerified={searchVerified} onCheckVerified={onCheckVerified} />
        </div>
    );
};

export default CollectionSelector;
