import React, {useContext} from 'react';
import {useTranslation} from "react-i18next";
import cn from "classnames";
import {get} from "../../components/helpers/Api";
import AssetList from "../../components/assetlist";
import CollectionPreview from "../../components/explorer/CollectionPreview";
import {Context} from "../../components/waxplorer";
import {useQuery} from "react-query";
import LoadingIndicator from "../../components/loadingindicator";

import Link from 'next/link';
import Page from "../../components/page/Page";
import qs from 'qs';
import AssetListHeader from '../../components/common/util/AssetListHeader';

const SearchPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const term = props['term'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const GetCollections = () => {
        const { isLoading, error, data } = useQuery(`search-term-${term}-collections`, () => get(
            `search-term/${term}/collections`));

        return {
            isLoadingCollections: isLoading,
            collectionData: data
        }
    };

    const GetAssets = () => {
        const { isLoading, error, data } = useQuery(`search-term-${term}-assets`, () => get(
            `search-term/${term}/assets`));

        return {
            isLoadingAssets: isLoading,
            assetData: data
        }
    };

    const GetSales = () => {
        const { isLoading, error, data } = useQuery(`search-term-${term}-sales`, () => get(
            `search-term/${term}/sales`));

        return {
            isLoadingSales: isLoading,
            salesData: data
        }
    };

    const GetUsers = () => {
        const { isLoading, error, data } = useQuery(`search-term-${term}-users`, () => get(`search-term/${term}/users`));

        return {
            isLoadingUsers: isLoading,
            usersData: data
        }
    };

    const { isLoadingCollections, collectionData } = GetCollections();
    const { isLoadingAssets, assetData } = GetAssets();
    const { isLoadingSales, salesData } = GetSales();
    const { isLoadingUsers, usersData } = GetUsers();

    const title = t('links.check_out_search', {search: term});
    const description = t('links.inspect_asset_on_waxplorer');

    return (
        <Page
            id={'SearchPage'}
            title={title}
            description={description}
        >
            <div className="ResultRow">
                <div>
                    <AssetListHeader classNames='NextLink'>
                        {t('navigation.collections')}
                    </AssetListHeader>
                    {isLoadingCollections ? <LoadingIndicator/> : collectionData && collectionData['collections'] && collectionData['collections'].length ? <div className="CollectionList">
                        {
                            collectionData['collections'].map((collection, index) => <CollectionPreview key={collection.collection+'_'+index} collection={collection} ual={ual} />)
                        }
                    </div> : '0 Results' }
                </div>
                <div className="ResultRow">
                    <Link className='NextLink' href={`/explorer?tab=assets&name=${term}&force_refresh=true`}>
                        <div>
                            <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                                {t('search.assets')}
                            </AssetListHeader>
                        </div>
                    </Link>
                    {isLoadingAssets ? <LoadingIndicator/> : assetData && assetData['assets'] && assetData['assets'].length > 0 ?
                    <AssetList
                        
                        name="SearchResults"
                        onSale={true}
                        isLoading={false}
                        ual={ual}
                        assets={assetData['assets']}
                    /> : '0 Results' }
                </div>
                <div className="ResultRow">
                    <Link className='NextLink' href={`/market?tab=sales&name=${term}&force_refresh=true`}>
                        <div>
                            <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                                {t('search.sales')}
                            </AssetListHeader>
                        </div>
                    </Link>
                    {isLoadingSales ? <LoadingIndicator/> : salesData && salesData['sales'] && salesData['sales'].length > 0 ?
                    <AssetList 
                        name="SearchResults"
                        onSale={true}
                        isLoading={false}
                        ual={ual}
                        assets={salesData['sales']}
                    /> : '0 Results' }
                </div>
                <div className="ResultRow">
                    <AssetListHeader>
                        <div>{t('navigation.users')}</div>
                    </AssetListHeader>
                    {isLoadingUsers ? <LoadingIndicator/> : usersData && usersData['users'] && usersData['users'].length > 0 ? <div className="CollectionList">
                        {
                            usersData['users'].map((user, index) => <Link href={`/user/${user.user}`}>
                                <div  className="InfoBox" key={user.user+'_'+index}>
                                    {user.user}
                                </div>
                            </Link>)
                        }
                    </div> : '0 Results' }
                </div>
            </div>
        </Page>
    );
};

SearchPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('search?', ''));
};

export default SearchPage;
