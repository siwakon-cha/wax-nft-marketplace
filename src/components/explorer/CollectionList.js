import React, {useEffect, useState} from 'react';

import CollectionPreview from "./CollectionPreview";
import { useQuery } from 'react-query';
import LoadingIndicator from "../loadingindicator";

import {get} from "../helpers/Api";
import CollectionDropdown from "../collectiondropdown";
import qs from 'qs';

function CollectionList(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    const [searchAuthor, setSearchAuthor] = useState(process.browser && values['collection'] ? values['collection'] : '*');

    const [searchVerified, setSearchVerified] = useState(process.browser && values['verified'] ? values['verified'] : true);

    useEffect(() => {
    }, [searchVerified, searchAuthor]);

    const onSelectAuthor = (e) => {
        setSearchAuthor(e);
    };

    const onCheckVerified = (e) => {
        setSearchVerified(e);
    };

    const { isLoading, error, data } = useQuery(
        `collections-${searchAuthor}-${searchVerified}`,
        process.browser ? () => get(`collections-overview/${searchAuthor ? searchAuthor : '*'}?verified=${searchVerified}`) : () => {
            return {isLoading: true, error: null, data: null}} );

    return (
        isLoading || !data ? <LoadingIndicator/> :
            <div className="CollectionList">
                        <CollectionDropdown searchVerified={searchVerified} searchAuthor={searchAuthor} selectAuthor={onSelectAuthor} checkVerified={onCheckVerified} searchItem={true} />
            {
                data && data.map((collection, index) => <CollectionPreview
                    key={collection.collection+'_'+index} collection={collection} ual={ual} />)
            }
        </div>
    );
}

export default CollectionList;
