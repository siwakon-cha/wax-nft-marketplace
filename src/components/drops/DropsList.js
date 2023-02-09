import React, {useEffect, useState} from 'react';

import {get} from "../helpers/Api";

import Drop from "./Drop";
import {useQuery} from "react-query";
import LoadingIndicator from "../loadingindicator";
import CollectionDropdown from "../collectiondropdown";
import Dropdown from "react-dropdown";
import qs from 'qs';
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import Pagination from "../pagination/Pagination";
import cn from 'classnames';

const DropsList = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const getValue = (key, def) => {
        if (values[key])
            return unescape(values[key]);
        return def;
    };

    const router = useRouter();

    const setQueryStringWithoutPageReloadPush = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

    const getOrderDir = (orderBy, def) => {
        let order = def;

        if (orderBy === 'drop_id') {
            order = 'DESC'
        } else if (orderBy === 'price') {
            order = 'ASC'
        }

        return order;
    };

    const [offset, setOffset] = useState(getValue('offset', 0));
    const [orderDir, setOrderDir] = useState(getValue('order_dir', 'DESC'));
    const [orderBy, setOrderBy] = useState(getValue('order_by',     'date'));
    const [market, setMarket] = useState(getValue('market', ''));
    const [searchDropId, setSearchDropId] = useState(getValue('drop_id', null));
    const [minPrice, setMinPrice] = useState(getValue('min_price', 0));
    const [maxPrice, setMaxPrice] = useState(getValue('max_price', 0));
    const [searchAuthor, setSearchAuthor] = useState(getValue('collection', '*'));
    const [searchVerified, setSearchVerified] = useState('true');
    const limit = 40;
    const [showMenu, setShowMenu] = useState(true);
    const tab = values['tab'];

    const { isLoading, error, data } = useQuery(`drops?drop_id=${searchDropId ? searchDropId : ''}&offset=${
        offset ? offset : 0}&order_dir=${orderDir ? orderDir : ''}&order_by=${orderBy ? orderBy : ''}&collection=${
            searchAuthor ? searchAuthor : ''}&verified=${searchVerified}&min_price=${
                minPrice ? minPrice : ''}&max_price=${maxPrice ? maxPrice : ''}`, () => get(
                    `drops?drop_id=${searchDropId ? searchDropId : ''}&offset=${
        offset ? offset : 0}&order_dir=${orderDir ? orderDir : ''}&order_by=${orderBy ? orderBy : ''}&collection=${
            searchAuthor ? searchAuthor : ''}&verified=${searchVerified}&min_price=${
                minPrice ? minPrice : ''}&max_price=${maxPrice ? maxPrice : ''}&market=${market ? market : ''}`));

    const {t, i18n} = useTranslation('common');



    useEffect(() => {
    }, [market, searchDropId]);

    const getPagination = (location) => {
        return (
            <Pagination
                result={data}
                limit={limit}
                offset={offset}
                setOffset={setOffset}
                location={location}
            />
        );
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleToggle = () => {
        if (!showMenu)
            toggleMenu()
    };

    const setVars = (dropId, author, order, dir, price_min, price_max, verified, market, offset=0) => {

        if (price_max && parseInt(price_max) < parseInt(price_min)) {
            price_max = price_min
        }

        const query = values;

        if (dropId)
            query['drop_id'] = dropId;
        else
            delete query['drop_id'];
        if (author)
            query['collection'] = author;
        else
            delete query['collection'];
        if (order)
            query['order_by'] = order;
        else
            delete query['order_by'];
        if (dir)
            query['order_dir'] = dir;
        else
            delete query['order_dir'];
        if (price_min)
            query['min_price'] = price_min;
        else
            delete query['min_price'];
        if (price_max)
            query['max_price'] = price_max;
        else
            delete query['max_price'];
        if (tab)
            query['tab'] = tab;
        else
            delete query['tab'];
        if (offset)
            query['offset'] = offset;
        else
            delete query['offset'];
        if (verified === 'false')
            query['verified'] = 'false';
        else
            delete query['verified'];
        if (market)
            query['market'] = market;
        else
            delete query['market'];

        setSearchDropId(dropId);
        setSearchAuthor(author);
        setOrderBy(order);
        setOrderDir(dir);
        setMarket(market);
        setMinPrice(price_min);
        setMaxPrice(price_max);
        setOffset(offset);
        setSearchVerified(verified);

        return query;
    };

    const handleMinPriceChange = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            setVars(searchDropId, searchAuthor, orderBy, orderDir, val, maxPrice, searchVerified, market,0);

            if (maxPrice && parseInt(maxPrice) < parseInt(val)) {
                setMaxPrice(val);
            }
        }
    };

    const handleMaxPriceChange = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            setVars(searchDropId, searchAuthor, orderBy, orderDir, minPrice, val, searchVerified, market,0);

            if (maxPrice && parseInt(maxPrice) < parseInt(val)) {
                setMaxPrice(val);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!props['bulk'] || (ual['activeUser'] && ual['activeUser']['accountName'])) {
            const query = setVars(searchDropId, searchAuthor, orderBy, orderDir, minPrice, maxPrice, searchVerified, market,0);

            setQueryStringWithoutPageReloadPush(qs.stringify(query));
        }
    };

    const handleIdChange = (e) => {
        const val = e.target.value;
        setVars(val, searchAuthor, orderBy, orderDir, minPrice, maxPrice, searchVerified, market,0);
    };

    const onSelectAuthor = (e) => {
        setVars(searchDropId, e, orderBy, orderDir, minPrice, maxPrice, searchVerified, market, 0);
    };

    const onCheckVerified = () => {
        setVars(searchDropId, searchAuthor, orderBy, orderDir, minPrice, maxPrice, !searchVerified, market, 0);
    };

    const setupOrderDir = (dir) => {
        if (!isLoading) {
            const query = setVars(searchDropId, searchAuthor, orderBy, dir, minPrice, maxPrice, searchVerified, market, 0);
            setQueryStringWithoutPageReloadPush(qs.stringify(query));
        }
    };

    const onSelect = (e) => {
        let dir = getOrderDir(e.value, orderDir);

        setVars(searchDropId, searchAuthor, e.value, dir, minPrice, maxPrice, searchVerified, market, 0);
    };

    const onSelectMarket = (e) => {
        setVars(searchDropId, searchAuthor, orderBy, orderDir, minPrice, maxPrice, searchVerified, e.value, 0);
    };

    const dropDownOptions = [
      { value: 'date', label: t('search.date') },
      { value: 'drop_id', label: 'Drop ID' },
      { value: 'price', label: t('search.price') },
      { value: 'author', label: t('profile.collection') },
    ];

    const dropMarketDropdownOptions = [
      { value: '', label: ' - ' },
      { value: 'atomicdropsx', label: 'AtomicHub' },
      { value: 'neftyblocksd', label: 'NeftyBlocks' },
    ];

    const getOption = (order, dir) => {
        const option = Math.max(dropDownOptions.map(item => item.value).indexOf(order), 0);

        return dropDownOptions[option];
    };

    const defaultOption = getOption(orderBy, orderDir);

    const getMarketOption = (market) => {
        const option = Math.max(dropMarketDropdownOptions.map(item => item.value).indexOf(market), 0);

        return dropMarketDropdownOptions[option];
    };

    const defaultMarketOption = getMarketOption(market);

    return (
        <div className={cn(
            'w-full px-0 lg:px-20',
            'flex flex-col lg:flex-row',
        )}>
            {process.browser ? 
            <form
                className={cn(
                    'w-full lg:w-48 overflow-y-auto overflow-x-hidden p-4',
                    'rounded-tr-2xl rounded-br-2xl',
                    'min-h-50',
                    'py-4 px-0 lg:py-0',
                    {'search-settings-show': showMenu},
                    {'search-settings-hide': !showMenu},
                )}
                onSubmit={handleSubmit}
                onClick={handleToggle}
            >
                <CollectionDropdown searchAuthor={searchAuthor} searchVerified={searchVerified} selectAuthor={onSelectAuthor} checkVerified={onCheckVerified} searchItem={true}/>
                <div className="text-center inline-table h-fit-content" >
                    <div className={cn(
                        'w-40 inline-flex relative pl-2',
                        'mt-2 mr-auto mb-2 ml-auto',
                    )}>
                        <div className="left-1.5">{t('search.sort_by')}</div>
                        <Dropdown
                            options={dropDownOptions}
                            onChange={onSelect}
                            value={defaultOption}
                            placeholder={t('search.order_by')}
                            id="DropdownField14"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                        <div className="w-5 flex flex-wrap m-auto">
                            <button
                                className={cn(
                                    'bg-transparent h-4 w-4 cursor-pointer',
                                    'border-none hover:opacity-100 hover:border-ascButton-active',
                                    {'opacity-100': orderDir === 'ASC'},
                                    {'opacity-85': orderDir !== 'ASC'},
                                )}
                                onClick={() => {if (orderDir === 'DESC') setupOrderDir('ASC')} }
                            >
                                <div className={cn(
                                    'bg-transparent w-0 h-0 border-solid cursor-pointer',
                                    'border-t-0 border-r-4 border-b-4 border-l-4',
                                    {'opacity-100 cursor-auto border-ascButton-active': orderDir === 'ASC'},
                                    {'opacity-85 border-ascButton': orderDir !== 'ASC'},
                                )} />
                            </button>
                            <button
                                className={cn(
                                    'bg-transparent h-4 w-4 cursor-pointer',
                                    'border-none hover:opacity-100 hover:border-descButton-active',
                                    {'opacity-100': orderDir === 'DESC'},
                                    {'opacity-85': orderDir !== 'DESC'},
                                )}
                                onClick={() => {if (orderDir === 'ASC') setupOrderDir('DESC')} }
                            >
                                <div className={cn(
                                    'bg-transparent w-0 h-0 border-solid cursor-pointer',
                                    'border-t-4 border-r-4 border-l-4 border-b-0',
                                    {'opacity-100 cursor-auto border-descButton-active': orderDir === 'DESC'},
                                    {'opacity-85 border-descButton': orderDir !== 'DESC'},
                                )} />
                            </button>
                        </div>
                    </div>
                    <div className={cn(
                        'w-40 h-10 inline-block relative',
                        'mr-4 ml-4 mt-2 mb-1',
                    )}>
                        <div>{t('search.market')}</div>
                        <Dropdown
                            options={dropMarketDropdownOptions}
                            onChange={onSelectMarket}
                            value={defaultMarketOption}
                            placeholder={t('search.market')}
                            id="DropdownField15"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </div>
                    <div className={cn(
                        'w-40 h-10 inline-block relative',
                        'mr-4 ml-4 mt-2 mb-1',
                    )}>
                        <input
                            type="text"
                            name='name'
                            className={cn(
                                'flex relative h-5 w-32 text-xs leading-5 text-primary',
                                'rounded-none bg-transparent bg-none',
                                'outline-none top-0.5 m-auto',
                                'border-b border-solid border-primary',
                            )}
                            placeholder={"ID"}
                            onChange={handleIdChange}
                            value={searchDropId ? searchDropId : ''}
                            disabled={isLoading ? 'disabled' : ''}
                        />
                    </div>
                    <div className={cn(
                        'w-40 mx-1.5 relative mt-auto text-center inline-flex'
                    )}>
                        <div className={cn(
                            'w-32 inline-flex m-auto',
                            'border-b border-solid',
                            {'border-primary': !isLoading},
                            {'border-white opacity-80': isLoading},
                        )}>
                            <span className={cn(
                                'my-auto text-white',
                                'opacity-80 text-xs',
                            )}>
                                {t('search.price')}
                            </span>
                            <input
                                type="text"
                                className={cn(
                                    'h-10 w-12 m-auto text-primary text-center',
                                    'text-xs bg-transparent outline-none rounded-none',
                                    {'opacity-100': !isLoading},
                                    {'opacity-85': isLoading},
                                )}
                                name='min-price'
                                placeholder={t('search.min')}
                                value={minPrice ? minPrice : ''}
                                onChange={handleMinPriceChange}
                                disabled={ isLoading ? 'disabled' : '' }
                            />
                            <span className={cn(
                                'my-auto text-white',
                                'opacity-80 text-xs',
                            )}>-</span>
                            <input
                                type="text"
                                className={cn(
                                    'h-10 w-12 m-auto text-primary text-center',
                                    'text-xs bg-transparent outline-none rounded-none',
                                    {'opacity-100': !isLoading},
                                    {'opacity-85': isLoading},
                                )}
                                name='max-price'
                                placeholder={t('search.max')}
                                value={maxPrice ? maxPrice : ''}
                                onChange={handleMaxPriceChange}
                                disabled={ isLoading ? 'disabled' : '' }
                            />
                        </div>
                    </div>
                    <div className="mt-5">
                        <button
                            type="submit"
                            className={cn(
                                'h-7 min-w-30',
                                'bg-transparent cursor-pointer',
                                'border border-solid border-primary rounded',
                                'outline-none mt-2 mx-auto mb-auto',
                                { 'opacity-100 text-primary': !isLoading },
                                { 'hover:font-bold hover:shadow-md': !isLoading },
                                { 'opacity-85 text-white': isLoading },
                                { 'hover:font-normal shadow-none': isLoading },
                            )}
                            disabled={ isLoading ? 'disabled' : '' }
                        >
                                {t('search.find')}
                        </button>
                    </div>
                </div>
            </form> : '' }
            {isLoading || !data ? <LoadingIndicator/> : 
            <div className={cn(
                'px-2 w-full text-center mx-auto',
                {'search-results-show': showMenu},
                {'search-results-hide': !showMenu},
            )}>
                {getPagination('Top')}
                {
                    data.map(drop => {
                        return <Drop {...props} drop={drop} />
                    })
                }
                {getPagination('Bottom')}
            </div>}
        </div>
    );
};

export default DropsList;
