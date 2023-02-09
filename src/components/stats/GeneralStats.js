import React, {useContext, useEffect, useState} from 'react';

import get from "../helpers/Api";
import {formatNumber, formatGrowth, formatMarket, formatCollectionAuthor} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";

function GeneralStats(props) {
    const {t, i18n} = useTranslation('common');

    const [numberOfNewAssets, setNumberOfNewAssets] = useState({'numberOfNewAssets': 'Loading...', 'numberOfNewAssetsGrowth': 'Loading'});
    const [totalRevenue, setTotalRevenue] = useState({'totalRevenue': 'Loading...', 'totalUsdRevenue': 'Loading...'});
    const [numberOfAssets, setNumberOfAssets] = useState('Loading...');
    const [volume, setVolume] = useState({'volume': 'Loading...', 'usdVolume': 'Loading...', 'volumeGrowth': 'Loading...'});
    const [numberOfTraders, setNumberOfTraders] = useState({'numberOfTraders': 'Loading...', 'numberOfTradersGrowth': 'Loading...'});
    const [numberOfTransfers, setNumberOfTransfers] = useState({'numberOfTransfers': 'Loading...', 'numberOfTransfersGrowth': 'Loading...'});
    const [topBuyer, setTopBuyer] = useState({'topBuyer': 'Loading...', 'topBuyerVolume': 'Loading...', 'topBuyerUsdVolume': 'Loading...'});
    const [topSeller, setTopSeller] = useState({'topSeller': 'Loading...', 'topSellerVolume': 'Loading...', 'topSellerUsdVolume': 'Loading...'});
    const [topMarket, setTopMarket] = useState({'topMarket': 'Loading...', 'topMarketVolume': 'Loading...', 'topMarketUsdVolume': 'Loading...'});
    const [topCollection, setTopCollection] = useState({'topCollection': 'Loading...', 'topCollectionVolume': 'Loading...', 'topCollectionUsdVolume': 'Loading...'});
    const searchAuthor = props['searchAuthor'];

    const getNumberOfNewAssets = (data) => {
        const {numberOfNewAssets, numberOfNewAssetsGrowth} = data;
        setNumberOfNewAssets({numberOfNewAssets: formatNumber(numberOfNewAssets), numberOfNewAssetsGrowth: formatGrowth(numberOfNewAssetsGrowth)});
    };

    const getNumberOfAssets = (data) => {
        const { numberOfAssets } = data;
        setNumberOfAssets({numberOfAssets: formatNumber(numberOfAssets)});
    };

    const getNumberOfTraders = (data) => {
        const { numberOfTraders, numberOfTradersGrowth } = data;
        setNumberOfTraders({numberOfTraders: formatNumber(numberOfTraders), numberOfTradersGrowth: formatGrowth(numberOfTradersGrowth)});
    };

    const getTotalRevenue = (data) => {
        const { totalRevenue, totalUsdRevenue } = data;
        setTotalRevenue({totalRevenue: formatNumber(totalRevenue) + ' WAX', totalUsdRevenue: '$'+formatNumber(totalUsdRevenue)});
    };

    const getTotalVolume = (data) => {
        const { volume, usdVolume, volumeGrowth, usdVolumeGrowth } = data;
        setVolume({
            volume: formatNumber(volume) + ' WAX',
            usdVolume: '$'+formatNumber(usdVolume),
            volumeGrowth: formatGrowth(volumeGrowth, usdVolumeGrowth, true)
        });
    };

    const getNumberOfTransfers = (data) => {
        const { numberOfTransfers, numberOfTransfersGrowth } = data;
        setNumberOfTransfers({numberOfTransfers: formatNumber(numberOfTransfers), numberOfTransfersGrowth: formatGrowth(numberOfTransfersGrowth)});
    };

    const getTopBuyer = (data) => {
        const { buyer, volume, usdVolume } = data;
        setTopBuyer({
            topBuyer: buyer,
            topBuyerVolume: formatNumber(volume) + ' WAX',
            topBuyerUsdVolume: '$'+formatNumber(usdVolume)
        });
    };

    const getTopSeller = (data) => {
        const { seller, volume, usdVolume } = data;
        setTopSeller({
            topSeller: seller,
            topSellerVolume: formatNumber(volume) + ' WAX',
            topSellerUsdVolume: '$'+formatNumber(usdVolume)
        });
    };

    const getTopMarket = (data) => {
        const { market, volume, usdVolume } = data;
        setTopMarket({
            topMarket: formatMarket(market),
            topMarketVolume: formatNumber(volume) + ' WAX',
            topMarketUsdVolume: '$'+formatNumber(usdVolume)
        });
    };

    const getTopCollection = (data) => {
        const { collection, volume, usdVolume } = data;
        setTopCollection({
            topCollection: formatCollectionAuthor(collection),
            topCollectionVolume: formatNumber(volume) + ' WAX',
            topCollectionUsdVolume: '$'+formatNumber(usdVolume)
        });
    };

    const loadNumAssets24h = async (author) => {
        return await get(`num-assets-24h/` + (author ? author : '*'), 'statistics').then((res) => getNumberOfNewAssets(res));
    };

    const loadVolume = async (author) => {
        return await get('volume/' + (author ? author : '*'), 'statistics').then((res) => getTotalVolume(res));
    };

    const loadTotalRevenue = async (author) =>
        await get("total-revenue/" + (author ? author : '*'), 'statistics').then((res) => getTotalRevenue(res));

    const loadNumAssets = async (author) =>
        await get("num-assets/" + (author ? author : '*'), 'statistics').then((res) => getNumberOfAssets(res));

    const loadNumTraders = async (author) => {
        await get('traders/' + (author ? author : '*'), 'statistics').then((res) => getNumberOfTraders(res));
    };

    const loadTopBuyer = async (author) => {
        await get('top-buyer/' + (author ? author : '*'), 'statistics').then((res) => getTopBuyer(res));
    };

    const loadTopSeller = async (author) => {
        await get('top-seller/' + (author ? author : '*'), 'statistics').then((res) => getTopSeller(res));
    };

    const loadTopMarket = async (author) => {
        await get('top-market/' + (author ? author : '*'), 'statistics').then((res) => getTopMarket(res));
    };

    const loadTopCollection = async (author) => {
        await get('top-collection/' + (author ? author : '*'), 'statistics').then((res) => getTopCollection(res));
    };

    useEffect(() => {
        if (process.browser) {
            loadNumAssets24h(searchAuthor);
            loadVolume(searchAuthor);
            loadTotalRevenue(searchAuthor);
            loadNumAssets(searchAuthor);
            loadNumTraders(searchAuthor);
            loadTopBuyer(searchAuthor);
            loadTopSeller(searchAuthor);
            loadTopMarket(searchAuthor);
            loadTopCollection(searchAuthor);
        }
    }, [searchAuthor]);

    return (
        <div className="GeneralStats AnalyticsComponent">
            <div>
                <table>
                    <tbody>
                        <tr><td><b>{t('analytics.total_number_of_assets')}:</b></td><td>{numberOfAssets.numberOfAssets}</td><td></td></tr>
                        <tr><td><b>{t('analytics.total_trade_volume')}:</b></td><td>{totalRevenue.totalRevenue}<span className="usd-s">/{totalRevenue.totalUsdRevenue}</span></td><td></td></tr>
                        <tr><td><b>{t('analytics.new_assets')}:</b></td><td>{numberOfNewAssets.numberOfNewAssets}</td><td>{numberOfNewAssets.numberOfNewAssetsGrowth}</td></tr>
                        <tr><td><b>{t('analytics.trade_volume_24h')}:</b></td><td>{volume.volume}<span className="usd-s">/{volume.usdVolume}</span></td><td>{volume.volumeGrowth}</td></tr>
                        <tr><td><b>{t('analytics.traders_24h')}:</b></td><td>{numberOfTraders.numberOfTraders}</td><td>{numberOfTraders.numberOfTradersGrowth}</td></tr>
                        <tr><td><b>{t('analytics.top_buyer_24h')}:</b></td><td>{topBuyer.topBuyer}</td><td>{topBuyer.topBuyerVolume}<span className="usd-s">/{topBuyer.topBuyerUsdVolume}</span></td></tr>
                        <tr><td><b>{t('analytics.top_seller_24h')}:</b></td><td>{topSeller.topSeller}</td><td>{topSeller.topSellerVolume}<span className="usd-s">/{topSeller.topSellerUsdVolume}</span></td></tr>
                        <tr><td><b>{t('analytics.top_market_24h')}:</b></td><td>{topMarket.topMarket}</td><td>{topMarket.topMarketVolume}<span className="usd-s">/{topMarket.topMarketUsdVolume}</span></td></tr>
                        <tr><td><b>{t('analytics.top_collection_24h')}:</b></td><td>{topCollection.topCollection}</td><td>{topCollection.topCollectionVolume}<span className="usd-s">/{topCollection.topCollectionUsdVolume}</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GeneralStats;
