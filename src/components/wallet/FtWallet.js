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
        <div className="FTContainer">
            <table>
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
                          <div className="">
                              <button className="BuyButton Relative" onClick={() => sell(pack)}>{t('asset.sell')} 1</button>
                          </div>
                      );
                      return (
                          <tr>
                              <td><div className={"PackIcon"}><img src={pack['image']} alt={pack['symbol']} /></div></td>
                              <td>{pack['author']}</td>
                              <td>{pack['symbol']}</td>
                              <td>{pack['name']}</td>
                              <td>{pack['average'] ? `${formatNumber(pack['average'])} WAX / $${formatNumber(pack['usd_average'])}` : ''}</td>
                              <td>{pack['last_sold'] ? `${formatNumber(pack['last_sold'])} WAX / $${formatNumber(pack['usd_last_sold'])}` : ''}</td>
                              <td>{pack['lowest'] ? `${formatNumber(pack['lowest'])} WAX / $${formatNumber(pack['usd_lowest'])}` : ''}</td>
                              <td>{pack['amount']}</td>
                              <td>{pack['amount'] > 0 ? sellButton : ''}
                                  {errors['symbol'] ? <div className="ErrorNote" onClick={() => dismissError(pack['symbol'])}>{errors['symbol']}</div> : ''}
                              </td>
                          </tr>
                      );
                  }) : ''
              }
              {
                  isLoadingElements ? <LoadingIndicator /> : elements ? elements.map(element => {
                      const sellButton = (
                          <div className="">
                              <button className="BuyButton Relative" onClick={() => sell(element)}>{t('asset.sell')} 1</button>
                          </div>
                      );
                      return (
                          <tr>
                              <td><div className={"PackIcon"}><img src={element['image']} alt={element['symbol']} /></div></td>
                              <td>{element['author']}</td>
                              <td>{element['symbol']}</td>
                              <td>{element['name']}</td>
                              <td>{element['average'] ? `${formatNumber(element['average'])} WAX / $${formatNumber(element['usd_average'])}` : ''}</td>
                              <td>{element['last_sold'] ? `${formatNumber(element['last_sold'])} WAX / $${formatNumber(element['usd_last_sold'])}` : ''}</td>
                              <td>{element['lowest'] ? `${formatNumber(element['lowest'])} WAX / $${formatNumber(element['usd_lowest'])}` : ''}</td>
                              <td>{element['amount']}</td>
                              <td>{element['amount'] > 0 ? sellButton : ''}
                                  {errors['symbol'] ? <div className="ErrorNote" onClick={() => dismissError(element['symbol'])}>{errors['symbol']}</div> : ''}
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
