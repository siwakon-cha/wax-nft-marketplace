import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {formatNumber, sleep} from "../helpers/FormatLinks";
import {get, post} from "../helpers/Api";

import LoadingIndicator from "../loadingindicator";
import {Context} from "../waxplorer";
import {getBoostAction} from "../helpers/WaxApi";

const Wallet = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [waxBalance, setWaxBalance] = useState(0);
    const [trilliumBalance, setTrilliumBalance] = useState(0);
    const [stakedTrilliumBalance, setStakedTrilliumBalance] = useState(0);
    const [atomicBalance, setAtomicBalance] = useState(0);
    const [arenaBalance, setArenaBalance] = useState(0);
    const [aetherBalance, setAetherBalance] = useState(0);
    const [aetherStakedBalance, setAetherStakedBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [atomicError, setAtomicError] = useState(null);
    const [waxError, setWaxError] = useState(null);
    const [arenaError, setArenaError] = useState(null);
    const [aetherError, setAetherError] = useState(null);

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const parseWaxBalance = (res) => {
        if (res && res.status === 200) {
            let wax = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    wax += parseFloat(row['balance'].replace(' WAX', ''))
                });

            setWaxBalance(wax);
        }
    };

    const getWaxBalance = async (name) => {
        const body = {
            'code': 'eosio.token',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1,
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';

        post(url, body).then(res => parseWaxBalance(res));
    };

    const parseCollectedAether = (res) => {
        if (res && res.status === 200) {
            let collected = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    collected += parseFloat(row['collected'].replace(' AETHER', ''));
                });

            return collected;
        }

        return 0;
    };

    const parseAetherBalance = (res) => {
        if (res && res.status === 200) {
            let balance = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    if (row['balance'].includes(' AETHER'))
                        balance += parseFloat(row['balance'].replace(' AETHER', ''))
                });

            setAetherStakedBalance(balance);
        }
        setIsLoading(false);
    };

    const getCollectedAether = async (name) => {
        const authors = await get('get-rplanet-authors').then(result => {return result});

        setAetherBalance(0);

        const aether = await authors.map(async author => {
            const body = {
                'code': 's.rplanet',
                'index_position': 'primary',
                'json': 'true',
                'key_type': 'i64',
                'limit': 1,
                'lower_bound': name,
                'upper_bound': name,
                'reverse': 'false',
                'scope': author,
                'show_payer': 'false',
                'table': 'accounts',
                'table_key': ''
            };

            const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';

            sleep(20);

            return await post(url, body).then(res => {return parseCollectedAether(res)});
        }).reduce(async (a, b) => await a + await b);

        setAetherBalance(aether);
    };

    const getAetherBalance = async (name) => {
        const body = {
            'code': 'e.rplanet',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 100,
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseAetherBalance(res));
    };

    const parseAtomicBalance = (res) => {
        if (res && res.status === 200) {
            let atomic = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    if (Object.keys(row).includes('quantities'))
                        row['quantities'].map(quantity => {
                            if (quantity.includes(' WAX')) {
                                atomic += parseFloat(quantity.replace(' WAX', ''))
                            }
                        });
                });

            setAtomicBalance(atomic);
        }
    };

    const getAtomicBalance = async (name) => {
        const body = {
            'code': 'atomicmarket',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1,
            'lower_bound': name,
            'upper_bound': name,
            'reverse': 'false',
            'scope': 'atomicmarket',
            'show_payer': 'false',
            'table': 'balances',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseAtomicBalance(res));
    };

    const parseArenaBalance = (res) => {
        if (res && res.status === 200) {
            let waxarena = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    waxarena += parseFloat(row['balance'].replace(' WAX', ''))
                });

            setArenaBalance(waxarena);
        }
    };

    const getArenaBalance = async (name) => {
        const body = {
            'code': 'waxarena3dk1',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1,
            'lower_bound': name,
            'upper_bound': name,
            'reverse': 'false',
            'scope': 'waxarena3dk1',
            'show_payer': 'false',
            'table': 'claimable',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseArenaBalance(res));
    };

    const parseTrilliumBalance = (res) => {
        if (res && res.status === 200) {
            let trillium = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    const end = row['balance'].length - 4;
                    trillium += parseFloat(row['balance'].substr(0, end))
                });

            setTrilliumBalance(trillium);
        }
    };

    const parseStakedTrilliumBalance = (res) => {
        if (res && res.status === 200) {
            let trillium = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    const end = row['balance'].length - 4;
                    trillium += parseFloat(row['balance'].substr(0, end))
                });

            setStakedTrilliumBalance(trillium);
        }
    };

    const getStakedTrilliumBalance = async (name) => {
        const body = {
            'code': 'token.worlds',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 100,
            'lower_bound': '',
            'upper_bound': '',
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseStakedTrilliumBalance(res));
    };

    const getTrilliumBalance = async (name) => {
        const body = {
            'code': 'alien.worlds',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 100,
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
        post(url, body).then(res => parseTrilliumBalance(res));
    };

    const getUserBalances = async (name) => {
        if (process.browser) {
            getWaxBalance(name);
            getCollectedAether(name);
            getAetherBalance(name);
            getAtomicBalance(name);
            getArenaBalance(name);
            getTrilliumBalance(name);
            getStakedTrilliumBalance(name);
        }
    };

    useEffect(() => {
        if (userName)
            getUserBalances(userName);
    }, [userName]);


    const claimAtomic = async(quantity) => {
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [
                    getBoostAction(activeUser), {
                    account: 'atomicmarket',
                    name: 'withdraw',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        owner: userName,
                        token_to_withdraw: `${quantity.toFixed(8)} WAX`
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
        } catch (e) {
            console.log(e);
            setAtomicError(e.message);
        } finally {
            setTimeout(function () {
                getAtomicBalance(userName);
                getWaxBalance()
                setIsLoading(false);
            }, 2000);
        }
    };

    const claimArena = async() => {
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [getBoostAction(activeUser), {
                    account: 'waxarena3dk1',
                    name: 'userbalcl',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        account: userName
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
        } catch (e) {
            console.log(e);
            setArenaError(e.message);
        } finally {
            setTimeout(function () {
                getWaxBalance(userName);
                setIsLoading(false);
            }, 2000);
        }
    };

    const handleTransfer = (transferInfo) => {
        const wasTransferred = transferInfo['transferred'];
        const error = transferInfo['error'];

        if (wasTransferred) {
            setTimeout(function () {
                getWaxBalance(userName);
                setIsLoading(false);
            }, 2000);
        } else {
            setIsLoading(false);
        }

        setWaxError(error);
    };

    const [state, dispatch] = useContext(Context);

    const transfer = async() => {
        setIsLoading(true);
        dispatch({ type: 'SET_WAX_BALANCE', payload: waxBalance });
        dispatch({ type: 'SET_ACTION', payload: 'transfer_wax' });
        dispatch({ type: 'SET_CALLBACK', payload: (transferInfo) => handleTransfer(transferInfo) });
    };

    const claimAether = async() => {
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [getBoostAction(activeUser),
                {
                    account: 's.rplanet',
                    name: 'claim',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        to: userName
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });

        } catch (e) {
            console.log(e);
            setAetherError(e.message);
        } finally {
            setTimeout(function () {
                getAetherBalance(userName);
                getCollectedAether(userName);
            }, 2000);
        }
    };

    const claimAtomicButton = (
        <div className="">
            <button className="BuyButton Relative" onClick={() => claimAtomic(atomicBalance)}>{t('asset.claim')}</button>
        </div>
    );

    const claimArenaButton = (
        <div className="">
            <button className="BuyButton Relative" onClick={() => claimArena(arenaBalance)}>{t('asset.claim')}</button>
        </div>
    );

    const claimAetherButton = (
        <div className="">
            <button className="BuyButton Relative" onClick={() => claimAether(aetherBalance)}>{t('asset.claim')}</button>
        </div>
    );

    const transferWaxButton = (
        <div className="">
            <button className="BuyButton Relative" onClick={transfer}>{t('asset.transfer')}</button>
        </div>
    );

    const dismissAtomicError = () => {
        setAtomicError(null);
    };

    const dismissWaxError = () => {
        setWaxError(null);
    };

    const dismissArenaError = () => {
        setArenaError(null);
    };

    const dismissAetherError = () => {
        setAetherError(null);
    };

    return (
        <div className="BalanceContainer">
            <table>
              <tbody>
                <tr>
                    <td><b>{`WAX ${t('navigation.balance')}:`}</b></td>
                    <td></td>
                    <td>{formatNumber(waxBalance)} WAX</td>
                    <td>{isLoading ? <LoadingIndicator/> : (waxBalance > 0 ? transferWaxButton : '')}
                        {waxError ? <div className="ErrorNote" onClick={dismissWaxError}>{waxError}</div> : ''}
                    </td>
                </tr>
                <tr>
                    <td><b>{`Atomicmarket ${t('navigation.balance')}:`}</b></td>
                    <td>{formatNumber(atomicBalance)} WAX</td>
                    <td></td>
                    <td>{isLoading ? <LoadingIndicator/> : (atomicBalance > 0 ? claimAtomicButton : '')}
                        {atomicError ? <div className="ErrorNote" onClick={dismissAtomicError}>{atomicError}</div> : ''}
                    </td>
                </tr>
                <tr>
                    <td><b>{`Waxarena ${t('navigation.balance')}:`}</b></td>
                    <td>{formatNumber(arenaBalance)} WAX</td>
                    <td></td>
                    <td>{isLoading ? <LoadingIndicator/> : (arenaBalance > 0 ? claimArenaButton : '')}
                        {arenaError ? <div className="ErrorNote" onClick={dismissArenaError}>{arenaError}</div> : ''}
                    </td>
                </tr>
                <tr>
                    <td><b>{`Aether ${t('navigation.balance')}:`}</b></td>
                    <td>{formatNumber(aetherBalance)} Aether</td>
                    <td>{formatNumber(aetherStakedBalance)} Aether</td>
                    <td>{isLoading ? <LoadingIndicator/> : (aetherBalance > 0 ? claimAetherButton : '')}
                        {aetherError ? <div className="ErrorNote" onClick={dismissAetherError}>{aetherError}</div> : ''}
                    </td>
                </tr>
                <tr>
                    <td><b>{`TLM ${t('navigation.balance')}:`}</b></td>
                    <td>{formatNumber(trilliumBalance)} TLM</td>
                    <td>{formatNumber(stakedTrilliumBalance)} TLM</td>
                    <td></td>
                </tr>
              </tbody>
            </table>
        </div>
    );
};

export default Wallet;
