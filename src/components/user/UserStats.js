import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {get} from "../helpers/Api";
import {formatNumber} from "../helpers/FormatLinks";

const UserStats = (props) => {
    const userName = props['userName'];

    const [sellVolume, setSellVolume] = useState(0);
    const [sellUsdVolume, setSellUsdVolume] = useState(0);
    const [buyUsdVolume, setBuyUsdVolume] = useState(0);
    const [buyVolume, setBuyVolume] = useState(0);
    const [numberOfAssets, setNumberOfAssets] = useState(0);
    const [totalSells, setTotalSells] = useState(0);
    const [totalBuys, setTotalBuys] = useState(0);
    const [estimatedValue, setEstimatedValue] = useState(0);
    const [estimatedUsdValue, setEstimatedUsdValue] = useState(0);
    const [aetherRate, setAetherRate] = useState(0);
    const [upliftiumRate, setUpliftiumRate] = useState(0);

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const getUserStats = async (name) => {
        Promise.all([
            get(`total-buys?buyer=${name}`, 'statistics').then((result) => {setTotalBuys(result['totalBuys'])}),
            get(`total-sells?seller=${name}`, 'statistics').then((result) => {setTotalSells(result['totalSells'])}),
            get(`buy-volume?buyer=${name}`, 'statistics').then((result) => {
                setBuyVolume(result['buyVolume']);
                setBuyUsdVolume(result['buyUsdVolume']);
            }),
            get(`sell-volume?seller=${name}`, 'statistics').then((result) => {
                setSellVolume(result['sellVolume']);
                setSellUsdVolume(result['sellUsdVolume']);
            }),
            get(`user-assets?owner=${name}`, 'statistics').then((result) => {
                setNumberOfAssets(result['numAssets']);
                setEstimatedValue(result['estimatedValue']);
                setEstimatedUsdValue(result['estimatedUsdValue']);
            }),
            get(`aether-per-hour/${name}`).then((result) => {
                setAetherRate(result['aetherRate']);
            }),
            get(`upliftium-per-hour/${name}`).then((result) => {
                setUpliftiumRate(result['upliftiumRate']);
            }),
            get(`aether-per-hour/${name}`).then((result) => {
                setAetherRate(result['aetherRate']);
            })
        ]);
    };

    useEffect(() => {
        if (userName)
            getUserStats(userName);
    }, [userName]);

    return (
        <div className="StatsContainer">
            <table>
              <tbody>
                <tr>
                    <td><b>{t('profile.number_of_assets')}</b></td>
                    <td>{numberOfAssets}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.estimated_value')}</b></td>
                    <td>${formatNumber(estimatedUsdValue)}</td>
                    <td>{formatNumber(estimatedValue)} WAX</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.assets_sold')}</b></td>
                    <td>{totalSells}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.assets_bought')}</b></td>
                    <td>{totalBuys}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.sell_revenue')}</b></td>
                    <td>${formatNumber(sellUsdVolume)}</td>
                    <td>{formatNumber(sellVolume)} WAX</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.buy_volume')}</b></td>
                    <td>${formatNumber(buyUsdVolume)}</td>
                    <td>{formatNumber(buyVolume)} WAX</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.aether_rate')}</b></td>
                    <td><img src={'/aether_icon.png'} /></td>
                    <td>{formatNumber(aetherRate / 10000.0)} / hour</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>{t('profile.upliftium_rate')}</b></td>
                    <td><img src={'/upliftium.png'} /></td>
                    <td>{formatNumber(upliftiumRate)} / hour</td>
                    <td></td>
                </tr>
              </tbody>
            </table>
        </div>
    );
};

export default UserStats;
