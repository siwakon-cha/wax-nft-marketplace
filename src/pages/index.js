import React from 'react';
import qs from 'qs';
import {formatCollectionAuthor, getImage} from "../components/helpers/FormatLinks";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {get} from "../components/helpers/Api";
import LoadingIndicator from "../components/loadingindicator";
import Link from "next/link";
import Page from '../components/page/Page';
import cn from "classnames";


const HomePage = (props) => {
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const getValue = (key, def) => {
        if (values[key])
            return values[key];
        return def;
    };

    const searchAuthor = props.collection ? props.collection : process.browser ? getValue('collection', '') : '';

    const { isLoading, error, data } = useQuery(`frontpage-images`, () => get(`frontpage-images`));

    const image = getImage(searchAuthor);

    const pageTitle = t('navigation.home');
    let title = `${searchAuthor && searchAuthor !== '*' ? `${formatCollectionAuthor(searchAuthor)} ${pageTitle}` : pageTitle} on NFTHive.io`;

    return (
        <Page
            id={"HomePage"}
            title={title}
            description={t('links.explore_and_trade_nfts_on_the_wax_blockchain')}
            image={image}
            classNames={'bg-gradient-to-b from-transparent to-bluet2'}
        >
            <div>
            {
                isLoading ? <LoadingIndicator/> :
                <div className={cn(
                    'content-center'
                )}>
                    <div className={'flex flex-wrap justify-center mt-8 mx-auto mb-auto'}>
                        <div className={"HoneyCombs1"}>
                            <div className={`HiveImageBg1`}>
                                <img src={'/frontpage/SVG/wabe_grau.svg'} />
                            </div>
                            <div className={`HiveImage3`}>
                                <Link href={`/collection/${data[2]['collection']}`}>
                                    <img className={"NextLink"} src={data[2]['image']} />
                                </Link>
                            </div>
                            <div className={`HiveImage2`}>
                                <Link href={`/collection/${data[1]['collection']}`}>
                                    <img className={"NextLink"} src={data[1]['image']} />
                                </Link>
                            </div>
                            <div className={`HiveImage1`}>
                                <Link href={`/collection/${data[0]['collection']}`}>
                                    <img className={"NextLink"} src={data[0]['image']} />
                                </Link>
                            </div>
                        </div>
                        <div className={"HiveContent"}>
                            <div>
                                <h1 className={"WelcomeHeader"}>Welcome to NFTHive!</h1>
                                <div className={"IntroText"}>Browse all Simpleassets and Atomicassets Listings scattered across the different WAX.io <Link href={'/market'}>Marketplaces</Link>.
                                    Collect and complete Sets of different <Link href={"/explorer?tab=collections"}>Collections</Link> - no matter whether you have staked, listed or tubed your assets.
                                    Buy and Sell fungible token <Link href={'/market?tab=packs'}>Packs</Link>, NFT Packs, and all kinds of NFTs in one place.
                                    Try the NFTHive <Link href={'/bulk?search_type=bulk_sell'}>Bulk Tools</Link> to sell, buy, transfer or stake hundreds of NFTs at once - or to edit and push active Listings.</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            </div>
        </Page>
    );
};


HomePage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('?', ''));
};

export default HomePage;
