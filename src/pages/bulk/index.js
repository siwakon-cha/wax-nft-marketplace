import React from 'react';
import qs from 'qs';
import Page from '../../components/page/Page';
import SearchComponent from '../../components/searchitems/SearchComponent';

const BulkPage = (props) => {
    return (
        <Page
            id={"BulkPage"}
            title={'Bulk Tools on NFTHive.io'}
            description={'Sell multiple NFTs, edit Listings or transfer large amounts of NFTs'}
        >
            <SearchComponent
                {...props}
                bulk={true}
                searchSettings={{
                    'limit': {value: 60, fixed: false},
                    'expanded': false
                }}
            />
        </Page>
    );
};

BulkPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[1].replace('bulk?', ''));

    values['search_page'] = true;
    values['searchType'] = values['search_type'] ? values['search_type'] : 'bulk_sell';

    return values;
};

export default BulkPage;
