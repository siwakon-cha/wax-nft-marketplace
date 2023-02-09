import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {formatNumber} from "../helpers/FormatLinks";
import {get} from "../helpers/Api";

import LoadingIndicator from "../loadingindicator";
import {Context} from "../waxplorer";

const FtWallet = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [packs, setPacks] = useState([]);
    const [elements, setElements] = useState([]);
    const [isLoadingPacks, setIsLoadingPacks] = useState(true);
    const [isLoadingElements, setIsLoadingElements] = useState(true);
    const [errors, setErrors] = useState({});

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const getPacks = async (user) => {
        get('my-packs/' + user).then((result) => {
            setPacks(result);
            setIsLoadingPacks(false);
        })
    };

    const getElements = async (user) => {
        get('my-elements/' + user).then((result) => {
            setElements(result);
            setIsLoadingElements(false);
        })
    };

    const dismissError = (symbol) => {
        delete errors[symbol];
        setErrors(errors);
    };

    const [state, dispatch] = useContext(Context);

    const handleSell = (sellInfo) => {
        if (sellInfo) {
            const wasSold = sellInfo['sold'];

            if (wasSold) {
                setTimeout(function () {
                    getPacks(userName);
                    getElements(userName);
                }, 2000);
            } else {
                setIsLoadingPacks(false);
                setIsLoadingElements(false);
            }
        }
    };

    const sell = async(pack) => {
        setIsLoadingPacks(true);
        setIsLoadingElements(true);
        dispatch({ type: 'SET_ASSET', payload: pack });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleSell(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'sell' });
    };

    useEffect(() => {
        if(userName)
            Promise.all([
                getPacks(userName),
                getElements(userName)
            ]);
    }, [userName]);

    return (
        <div className="relative w-auto m-auto">
            <table className="w-full leading-triple">
                { (!isLoadingPacks && packs && packs.length > 0) || (!isLoadingElements && elements && elements.length > 0) ? <tr>
                    <th></th>
                    <th>{t('asset.author')}</th>
                    <th>Token</th>
                    <th>{t('asset.name')}</th>
                    <th>{t('asset.average_sold')}</th>
                    <th>{t('asset.last_sold')}</th>
                    <th>{t('search.market')}</th>
                    <th>{t('asset.owned')}</th>
                    <th></th>
                </tr> : '' }
              {
                  isLoadingPacks ? <LoadingIndicator /> : packs ? packs.map(pack => {
                      const sellButton = (
                          <div>
                              <button className="w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent relative top-0 left-0 outline-none mt-4 mb-0 mx-auto border-xs border-solid border-primary hover:font-bold" onClick={() => sell(pack)}>{t('asset.sell')} 1</button>
                          </div>
                      );
                      return (
                          <tr>
                              <td className="text-left w-auto overflow-x-auto text-white"><div><img className="max-h-25" src={pack['image']} alt={pack['symbol']} /></div></td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['author']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['symbol']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['name']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['average'] ? `${formatNumber(pack['average'])} WAX / $${formatNumber(pack['usd_average'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['last_sold'] ? `${formatNumber(pack['last_sold'])} WAX / $${formatNumber(pack['usd_last_sold'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['lowest'] ? `${formatNumber(pack['lowest'])} WAX / $${formatNumber(pack['usd_lowest'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['amount']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{pack['amount'] > 0 ? sellButton : ''}
                                  {errors['symbol'] ? <div className="absolute bg-gray-800 rounded text-center z-30 p-2 leading-5 flex justify-center text-yellow-600 text-xs ml-auto mr-auto border border-solid border-errorNote max-w-62.5 max-h-25 w-11/12 h-4/5" onClick={() => dismissError(pack['symbol'])}>{errors['symbol']}</div> : ''}
                              </td>
                          </tr>
                      );
                  }) : ''
              }
              {
                  isLoadingElements ? <LoadingIndicator /> : elements ? elements.map(element => {
                      const sellButton = (
                          <div>
                              <button className="w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent relative top-0 left-0 outline-none mt-4 mb-0 mx-auto border-xs border-solid border-primary hover:font-bold" onClick={() => sell(element)}>{t('asset.sell')} 1</button>
                          </div>
                      );
                      return (
                          <tr>
                              <td className="text-left w-auto overflow-x-auto text-white"><div><img className="max-h-25" src={element['image']} alt={element['symbol']} /></div></td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['author']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['symbol']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['name']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['average'] ? `${formatNumber(element['average'])} WAX / $${formatNumber(element['usd_average'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['last_sold'] ? `${formatNumber(element['last_sold'])} WAX / $${formatNumber(element['usd_last_sold'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['lowest'] ? `${formatNumber(element['lowest'])} WAX / $${formatNumber(element['usd_lowest'])}` : ''}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['amount']}</td>
                              <td className="text-center w-auto overflow-x-auto text-white">{element['amount'] > 0 ? sellButton : ''}
                                  {errors['symbol'] ? <div className="absolute bg-gray-800 rounded text-center z-30 p-2 leading-5 flex justify-center text-yellow-600 text-xs ml-auto mr-auto border border-solid border-errorNote max-w-62.5 max-h-25 w-11/12 h-4/5" onClick={() => dismissError(element['symbol'])}>{errors['symbol']}</div> : ''}
                              </td>
                          </tr>
                      );
                  }) : ''
              }
            </table>
        </div>
    );
};

export default FtWallet;
