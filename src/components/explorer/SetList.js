import React, {useEffect, useState} from 'react';

import SetPreview from "./SetPreview";
import { useQuery } from 'react-query';
import LoadingIndicator from "../loadingindicator";

import {get} from "../helpers/Api";
import CollectionDropdown from "../collectiondropdown";
import qs from 'qs';
import {useRouter} from "next/router";
import Pagination from "../pagination/Pagination";

function SetList(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const embedded = props['embedded'];
    const author = props['author'];
    const limit = props['limit'] ? props['limit'] : 10;

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const [searchOffset, setSearchOffset] = useState(values['offset'] ? values['offset'] : 0);
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState(null);

    const className = props['className'];

    const [searchAuthor, setSearchAuthor] = useState(
        author ? author : process.browser && values['collection'] ? values['collection'] : '*');

    const setSets = (res) => {
        setResult(res);
        setIsLoading(false);
    }

    const fetchSets = async (author, offset) => {
        setIsLoading(true);
        get(`set-previews/${author ? author : '*'}?limit=${limit}&offset=${offset}`, 'set-api').then(res => setSets(res));
    }

    useEffect(() => {
        fetchSets(searchAuthor, searchOffset)
    }, [searchAuthor, searchOffset]);

    const onSelectAuthor = (e) => {
        setSearchAuthor(e);
    };

    const getPagination = (location) => {
        return (
            <Pagination
                result={result}
                limit={limit}
                offset={searchOffset}
                setOffset={setSearchOffset}
                location={location}
            />
        )
    };

    return (
            <div>
                { embedded ? '' : <CollectionDropdown
                    searchVerified={true}
                    searchAuthor={searchAuthor}
                    selectAuthor={onSelectAuthor}
                    searchItem={true}
                    disableVerified={true}
                    setAuthorsOnly={true}
                /> }
                { embedded ? '' : getPagination('Top')}
                { isLoading ? <LoadingIndicator/> : <div className={`CollectionList ${embedded ? 'Embedded' : ''} ${className}`}>
                    {
                        result.map((set, index) => <SetPreview key={set.author+'_'+index} set={set} ual={ual} />)
                    }
                </div> }
                { embedded || isLoading ? '' : getPagination('Bottom')}
            </div>
    );
}

export default SetList;
