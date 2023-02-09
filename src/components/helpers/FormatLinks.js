import React from "react";

import Link from 'next/link';
import moment from 'moment';
import cn from "classnames";


export const getAssetLink = (assetId, name=null, number=null, variant=null, offer=null, orderId=null) => {
    return (
        <Link className='NextLink' href={(offer ? '/listing/' : '/asset/') + assetId + (orderId ? `?listing_id=${orderId}` : '')}>
            <div>{name ? (variant && number ? `${name}` : name) : assetId}</div>
        </Link>
    );
};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const getPopupClassname = () => {
    return cn(
        'relative z-40 w-4/5 justify-center h-auto max-h-4/5 lg:w-1/2 shadow-xl',
        'backdrop-blur-xl text-sm text-neutral p-8',
        'bg-paperd rounded-2xl m-auto top-10 lg:top-1/4'
    );
}

export const setQueryStringWithoutPageReload = qsValue => {
    const newurl = window.location.protocol + '//' +
        window.location.host +
        window.location.pathname + '?' +
        qsValue;
    const newPath =
        window.location.pathname + '?' +
        qsValue;

    const oldState = window.history.state;
    oldState.path = newPath;
    oldState.url = newurl;

    window.history.replaceState(oldState, '', newPath);
};

export const setQueryStringWithoutPageReloadPush = qsValue => {
    const newurl = window.location.protocol + '//' +
        window.location.host +
        window.location.pathname + '?' +
        qsValue;
    const newPath =
        window.location.pathname + '?' +
        qsValue;

    const oldState = window.history.state;

    oldState.path = newPath;
    oldState.url = newurl;
    oldState.as = newPath;

    window.history.pushState(oldState, '', newPath);
};

export const setQueryStringWithoutPageReloadPushPath = (qsValue, path) => {
    const newurl = window.location.protocol + '//' +
        window.location.host + '/' +
        path + '?' +
        qsValue;
    const newPath =
        window.location.host + '/' +
        path + '?' +
        qsValue;

    const oldState = window.history.state;

    oldState.path = newurl;
    oldState.url = newurl;
    oldState.as = newurl;

    window.history.pushState(oldState, '', newPath);
};

export const getOwnerLink = (owner) => {
    return (<Link href={`/user/${owner}`}><div className='NextLink'>{owner}</div></Link>);
};

export const getAuthorLink = (author) => {
    return (<Link href={`/collection/${author}`}><div className='NextLink'>{author}</div></Link>);
};

export const getVariantLink = (author, category, variant) => {
    return (<Link href={`/market?searchType=sales&order_by=offer_asc&collection=${author}&category=${category}&variant=${variant}`}><div className='NextLink'>{variant}</div></Link>);
};

export const getSearchName = (t, values, props) => {
    let search = t('search.sales');

    if (process.browser) {
        if (values['search_type'] && 'cheapest' === values['search_type'])
            search = 'Cheapest Sales per Asset';
        else if (values['search_type'] && 'cheapest_missing' === values['search_type'])
            search = t('search.cheapest_missing_assets');
        else if (values['search_type'] && ['sales', 'below_average'].includes(values['search_type']))
            search = t('search.sales');
        else if (values['search_type'] && values['search_type'] === 'staked')
            search = t(`search.staked_assets`);
        else if (values['search_type'])
            search = t(`search.${values['search_type']}`);
        if (values['tab'] === 'packs')
            search = t('overview.packs');
        else if (values['tab'] === 'auctions')
            search = t('search.auctions')
    } else {
        if (props.search_type && 'cheapest' === props.search_type)
            search = 'Cheapest Sales per Asset';
        else if (props.search_type && 'cheapest_missing' === props.search_type)
            search = t('search.cheapest_missing_assets');
        else if (props.search_type && ['sales', 'below_average'].includes(props.search_type))
            search = t('search.sales');
        else if (props.search_type && props.search_type === 'staked')
            search = t(`search.staked_assets`);
        else if (props.search_type)
            search = t(`search.${props.search_type}`);
        if (props.tab === 'packs')
            search = t('overview.packs');
        else if (props.tab === 'auctions')
            search = t('search.auctions')
    }

    return search;
};

export const formatCollectionAuthor = (author) => {
    if (author === 'gpk.topps') {
        return 'GPK';
    } else if (author === 'officialhero') {
        return 'Blockchain Heroes';
    } else if (author === 'mlb.topps') {
        return 'Topps MLB';
    } else if (author === 'kogsofficial') {
        return 'KOGs';
    } else if (author === 'darkcountryh') {
        return 'Dark Country';
    } else if (author === 'shatner') {
        return 'William Shatner';
    } else if (author === 'pepe') {
        return 'GoPepe';
    } else if (author === 'bitcoinorign') {
        return 'Bitcoin Origins'
    } else if (author === 'mutants.r2') {
        return 'Mutant Warriors'
    } else if (author === 'ultrahorrors') {
        return 'The Horrors'
    } else if (author === 'exitlimbowax') {
        return 'Exit Limbo'
    }
    return formatAuthor(author)
};

export const formatAuthor = (author) => {
    return author ? author.charAt(0).toUpperCase() + author.slice(1) : author;
};

export const createCollectionOption = (name) => {
    if (!name) return name;
    if (isAuthorCategory(name)) {
        name = formatCollectionAuthor(name);
    }

    return (
        <div className={name.length > 15 ? "CollectionDropdownOption Small" : "CollectionDropdownOption"}>
            {name}
        </div>);
};

export const createCollectionImageOption = (name, image) => {
    return (
        <div className="CollectionDropdownOption">
            <div className="CollectionDropdownImage"><img src={image} /></div>
            <div>{name}</div>
        </div>
    );
};


export const createAuthors = (data, search = '') => {
    const authors = [];

    (data['authors'] ? data['authors'] : data).filter(author => data['verified'][author]).forEach(
        element => {
            if (!authors.find(a => a.value === element))
                if (!search || element.toLowerCase().includes(search.toLowerCase()) || (data['names'][element] && data['names'][element].toLowerCase().includes(
                    search.toLowerCase())))
                    authors.push({
                        value: element,
                        title: data['names'][element] ? data['names'][element] : element,
                        label: element,
                        image: data['images'] && data['images'][element] ? data['images'][element] : ''
                    })
        }
    );

    (data['authors'] ? data['authors'] : data).filter(author => !data['verified'][author]).forEach(
        element => {
            if (!authors.find(a => a.value === element))
                if (!search || element.toLowerCase().includes(search.toLowerCase()) || (data['names'][element] && data['names'][element].toLowerCase().includes(
                    search.toLowerCase())))
                    authors.push({
                        value: element,
                        title: data['names'][element] ? data['names'][element] : element,
                        label: element,
                        image: data['images'] && data['images'][element] ? data['images'][element] : ''
                    })
        }
    );

    return authors;
};

export const isAuthorCategory = (author) => {
    return ['art', 'photography', 'games', 'cards', 'stickers'].includes(author);
};

export const createArtists = (data, author='Artist') => {
    const authors = [];

    authors.push({ value: '', label: author });
    data.forEach(
        element => {
            if (!authors.map(author => author['value']).includes(element['author'])) authors.push(
                {
                    value: element['author'],
                    label: element['image'] ? createCollectionImageOption(element['author'], element['image']) : createCollectionOption(element['author'])
                }
            )
        }
    );

    return authors;
};

export const getImage = (author, category = null, t=null) => {
    if (author === 'tmnt.funko' && category === 'sets')
        return 'https://www.nfthive.io/funko.jpg'

    const category_images = {
        'officialheropacks': 'https://www.nfthive.io/nfthive-logo.png',
        'alien.worldspacks': 'https://www.nfthive.io/nfthive-logo-aw.png',
        'darkcountryhreheropack': 'https://www.nfthive.io/nfthive-logo.png',
        'darkcountryhheropack': 'https://www.nfthive.io/nfthive-logo.png',
        'kogsofficialpacks': 'https://www.nfthive.io/nfthive-logo.png'
    };

    const author_images = {
        'alien.worlds': 'https://www.nfthive.io/nfthive-logo-aw.png',
        'officialhero': 'https://www.nfthive.io/nfthive-logo.png',
        'darkcountryh': 'https://www.nfthive.io/nfthive-logo.png',
        'kogsofficial': 'https://www.nfthive.io/KOGS_Logo.jpg',
        'atari': 'https://www.nfthive.io/nfthive-logo.png',
        'pepe': 'https://www.nfthive.io/nfthive-logo.png',
        'tribalbooks': 'https://www.nfthive.io/nfthive-logo.png',
        'mutants.r2': 'https://www.nfthive.io/nfthive-logo.png',
        'crptomonkeys': 'https://www.nfthive.io/nfthive-logo.png',
        'bitcoinorign': 'https://www.nfthive.io/nfthive-logo-btco.png',
        'gpk.topps': 'https://www.nfthive.io/nfthive-logo-gpk.png',
        'mlb.topps': 'https://www.nfthive.io/nfthive-logo-mlb.png',
        'nimoy': 'https://www.nfthive.io/nfthive-logo-nimoy.png',
        'gdz.topps': 'https://www.nfthive.io/nfthive-logo-godzilla.png',
        'stf.capcom': 'https://www.nfthive.io/nfthive-logo-sf.png',
    };

    if (!author && t && category === t('overview.packs') ) {
        return 'https://www.nfthive.io/nfthive-logo.png'
    }

    if (category && category_images[author+category])
        return category_images[author+category];

    if (author_images[author])
        return author_images[author];

    return "https://www.nfthive.io/nfthive-logo.png";
};


export const createSearchArtists = (data, author='Artist') => {
    const authors = [];

    authors.push({ value: '', label: author });
    data.forEach(
        element => {
            if (element['artist'] && !authors.map(author => author['value']).includes(element['artist'])) {
                authors.push({
                    value: element['artist'],
                    label: element['image'] ? createCollectionImageOption(element['artist'], element['image']) : createCollectionOption(element['artist'])
                })
            }
        }
    );

    return authors;
};

export const createDropdownOptions = (options, name) => {
    const allOptions = [];
    const addedOptions = [];

    if (!options || !options.length)
        return null;

    allOptions.push({ value: '', label: name.charAt(0).toUpperCase() + name.slice(1) });

    options.forEach(
        element => {
            if (!addedOptions.includes(element)) {
                allOptions.push({value: element, label: ''+element});
                addedOptions.push(element)
            }
        }
    );

    return allOptions;
};

export const createCategories = (categories, category='Category') => {
    const categoriesOptions = [];
    const addedCategories = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['category']) {
                if (!addedCategories.includes(element['category'])) {
                    categoriesOptions.push(
                        {value: element['category'], label: element['category']});
                    addedCategories.push(element['category'])
                }
            }
        }
    );

    return categoriesOptions;
};

export const createRarities = (categories, rarity='Rarity') => {
    const categoriesOptions = [];
    const addedRarities = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['rarity']) {
                if (!addedRarities.includes(element['rarity'])) {
                    categoriesOptions.push(
                        {value: element['rarity'], label: element['rarity']});
                    addedRarities.push(element['rarity'])
                }
            }
        }
    );

    return categoriesOptions;
};

export const createVariants = (categories, variant='Variant') => {
    const categoriesOptions = [];
    const addedVariants = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['variant']) {
                if (!addedVariants.includes(element['variant'])) {
                    categoriesOptions.push(
                        {value: element['variant'], label: element['variant']});
                    addedVariants.push(element['variant'])
                }
            }
        }
    );

    return categoriesOptions;
};

export const createColors = (categories, color='Color') => {
    const categoriesOptions = [];
    const addedColors = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['color']) {
                if (!addedColors.includes(element['color'])) {
                    categoriesOptions.push(
                        {value: element['color'], label: element['color']});
                    addedColors.push(element['color'])
                }
            }
        }
    );

    return categoriesOptions;
};

export const createAttributes = (categories, key, labelName) => {
    const categoriesOptions = [];
    const addedBorder = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element[key] === 0 || element[key]) {
                if (!addedBorder.includes(element[key])) {
                    categoriesOptions.push(
                        {value: ''+element[key], label: ''+element[key]});
                    addedBorder.push(element[key])
                }
            }
        }
    );

    return categoriesOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
};

export const createBorders = (categories, border='Border') => {
    const categoriesOptions = [];
    const addedBorder = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['border'] === 0 || element['border']) {
                if (!addedBorder.includes(element['border'])) {
                    categoriesOptions.push(
                        {value: ''+element['border'], label: ''+element['border']});
                    addedBorder.push(element['border'])
                }
            }
        }
    );

    return categoriesOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
};

export const createTypes = (categories, type='Type') => {
    const categoriesOptions = [];
    const addedBorder = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.forEach(
        element => {
            if (element['type']) {
                if (!addedBorder.includes(element['type'])) {
                    categoriesOptions.push(
                        {value: element['type'], label: element['type']});
                    addedBorder.push(element['type'])
                }
            }
        }
    );

    return categoriesOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
};

export const createNames = (categories, name='Name') => {
    const categoriesOptions = [];
    const addedBorder = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: 'All' });

    categories.sort((a,b) => ('' + a.name).localeCompare(b.name)).forEach(
        element => {
            if (element['name']) {
                if (!addedBorder.includes(element['name'])) {
                    categoriesOptions.push(
                        {value: element['name'], label: element['name']});
                    addedBorder.push(element['name'])
                }
            }
        }
    );

    return categoriesOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
};

export const formatMintInfo = (mint, total, burned, t) => {
    let mintInfo = '';

    if (mint) {
        mintInfo = (
            <div className={"MintContainer"}><div className={"MintInfo"}>#{mint}</div></div>
        );
    }

    return mintInfo;
};


export const getVariantName = (t, author, category) => {
    if (author === 'stf.capcom' || author === 'robotech')
        return 'Power Score';

    if (author === 'girlpinupart')
        return t('search.artist');

    if (author === 'bitcoinorign')
        return 'Moment';

    if (author === 'alien.worlds') {
        if (category === 'land.worlds' || category === 'Alien Worlds Land')
            return 'Planet';
        else if (!category)
            return 'Shine / Planet';
        else
            return 'Shine';
    }

    if (author === 'armiesxpower') {
        return 'Mission';
    }

    if (author === 'upliftworld') {
        return 'World';
    }

    if (author === 'kogsofficial') {
        return 'Series'
    }

    if (author === 'darkcountryh') {
        if (category === 'heroes') {
            return t('search.bagspace');
        }
        if (category === 'cards') {
            return t('search.type');
        }

        return `${t('search.type')}/${t('search.bagspace')}`
    }

    if (author === 'cardinalland') {
        return 'Continent';
    }

    if (author === 'greenrabbit') {
        return 'Class';
    }

    return t('asset.variant');
};


export const getNumberName = (t, author) => {
    let numberTerm = t('asset.number');
    if (author === 'ilovekolobok') {
        numberTerm = 'Gen'
    }
    return numberTerm;
};

export const getColorName = (t, author, category) => {
    if (author === 'darkcountryh') {
        if (category === 'heroes') {
            return t('search.energy');
        }
        if (category === 'cards' || category === 'cultists') {
            return t('search.race');
        }

        return `${t('search.race')}/${t('search.energy')}`
    } else if (author === 'armiesxpower') {
        return 'Frame';
    } else if (author === 'mlb.topps') {
        return 'Team'
    } else if (author === 'alien.worlds') {
        return t('search.element');
    } else if (author === 'hiddengemsss') {
        return 'Shape';
    } else if (author === 'battleminers') {
        return 'Energy';
    }

    return t('search.color');
};


export const getRarityName = (t, author, category) => {
    if (author === 'armiesxpower') {
        return 'Condition';
    }

    return t('search.rarity');
};


export const getBorderName = (t, author, category) => {
    if (author === 'armiesxpower') {
        return 'Tier';
    } else if (author === 'darkcountryh' && category && category.includes('heroes')) {
        return 'Reforge Level';
    } else if (author === 'darkcountryh' && !category) {
        return 'Lvl/Slots';
    } else if (author === 'darkcountryh') {
        return 'Slots'
    } else if (author === 'hiddengemsss') {
        return 'Translucent'
    } else if (author === 'battleminers') {
        return 'Power';
    }

    return t('search.border');
};


export const getTypeName = (t, author, category) => {
    if (author === 'darkcountryh') {
        if (category === 'heroes') {
            return t('search.health');
        }
        if (category === 'cards') {
            return t('search.type');
        }

        return `${t('search.type')}/${t('search.health')}`
    }

    if (author === 'alien.worlds') {
        switch (category) {
            case 'tool.worlds': return t('search.type');
            case 'arms.worlds': return t('search.class');
            case 'faces.worlds': return t('search.race');
            case 'crew.worlds': return t('search.type');
            case 'land.worlds': return t('search.type');
        }
    } else if (author === 'bratz') {
        return t('asset.character');
    } else if (author === 'battleminers') {
        return 'Level';
    }

    return t('search.type');
};


export const getAttributeName = (t, author, category, index) => {
    if (author === 'alien.worlds') {
        switch (category) {
            case 'tool.worlds': return ['Charge Time', 'POW Reduction', 'Trilium Mining Power', 'NFT Luck'][index];
            case 'arms.worlds': return ['Attack', 'Defense', '', ''][index];
            case 'faces.worlds': return ['', '', '', ''][index];
            case 'crew.worlds': return ['Attack', 'Defense', 'Move Cost', ''][index];
            case 'land.worlds': return ['Charge Time', 'POW Reduction', 'Trilium Mining Power', 'NFT Luck'][index];
        }
        return ['Charge/Attack', 'POW/Defense', 'Power/Move Cost', 'NFT Luck'][index];
    } else if (author === 'darkcountryh') {
        return ['Attack', 'Health', 'Mana', ''][index];
    } else if (author === 'kogsofficial') {
        return ['Foil', 'Gold', '', ''][index];
    } else if (author === 'upliftworld') {
        return ['Location X', 'Location Y', '', ''][index];
    } else if (author === 'ultrahorrors') {
        return ['Subset', '', '', ''][index];
    } else if (author === 'battleminers') {
        return ['Resource Mining', 'NFT Mining', '', ''][index];
    }

    if (index === 3)
        return 'Video';

    return '';
};

const getHash = (s) => {
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

export const openSearchPopup = (searchType, asset, dispatch, callback) => {
    dispatch({ type: 'SET_SEARCH_ID', payload: getHash(moment.now().toString()) });
    dispatch({ type: 'SET_SEARCH_ASSET', payload: asset });
    dispatch({ type: 'SET_SEARCH_TYPE', payload: searchType });
    dispatch({ type: 'SET_CALLBACK', payload: callback ? callback : () => {} });
    dispatch({ type: 'SET_ACTION_SEARCH', payload: 'search' });
};

export const formatNumber = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `${parseInt(`${Math.round(number/10000000.0)}`)/10.0}B`;
    else if (Math.abs(number) >= 1000000)
        return `${parseInt(`${Math.round(number/100000.0)}`)/10.0}M`;
    else if (Math.abs(number) >= 10000)
        return `${parseInt(`${Math.round(number/100.0)}`)/10.0}K`;
    else return Math.round(value * 100) / 100;
};

export const formatRateNumber = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `${Math.round(parseInt(`${Math.round(number/10000000.0)}`)/10.0)}B`;
    else if (Math.abs(number) >= 1000000)
        return `${Math.round(parseInt(`${Math.round(number/100000.0)}`)/10.0)}M`;
    else if (Math.abs(number) >= 10000)
        return `${Math.round(parseInt(`${Math.round(number/100.0)}`)/10.0)}K`;
    else if (Math.abs(number) >= 100)
        return parseInt(`${Math.round(value * 100) / 100}`);
    else return Math.round(value * 100) / 100;
};

export const formatUSD = (usd) => {
    return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export const formatWAX = (wax) => {
    return `${wax.toLocaleString(undefined, { maximumFractionDigits: 8, minimumFractionDigits: 0 })} WAX`;
}

export const formatUSDM = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `$${parseInt(`${Math.round(number/10000000.0)}`)/10.0}B`;
    else if (Math.abs(number) >= 1000000)
        return `$${parseInt(`${Math.round(number/100000.0)}`)/10.0}M`;
    else if (Math.abs(number) >= 10000)
        return `$${parseInt(`${Math.round(number/100.0)}`)/10.0}K`;
    else return `$${number.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export const formatDate = (timestamp) => {
    const utc = moment.utc(timestamp).toDate();
    return moment(utc).local().format('YYYY-MM-DD HH:mm:ss');
};

export const formatNumberS = (value) => {
    return Math.round(value * 10000) / 10000.0;
};

export const formatNumber1K = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `${parseInt(`${Math.round(number/10000000.0)}`)/10.0}B`;
    else if (Math.abs(number) >= 1000000)
        return `${parseInt(`${Math.round(number/100000.0)}`)/10.0}M`;
    else if (Math.abs(number) >= 1000)
        return `${parseInt(`${Math.round(number/100.0)}`)/10.0}K`;
    else return Math.round(value);
};

export const formatPercentage = (value) => {
    const number = Math.round(parseFloat(value) * 10000) / 100;
    return `${formatNumber1K(number)}%`;
};

export const formatTransaction = (tx) => {
    return tx.substring(0, 20) + '...';
};

export const formatGrowth = (value, usd=0, includeWAX=false) => {
    const number = parseInt(value);
    if (number > 0)
        return (
            <div className="Growth">
                <div><svg class="Glyph ArrowUp" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 7v6H7V7H4l4-4 4 4z" fill-rule="evenodd"></path>
                </svg></div>
                <div>{includeWAX ? `${formatNumber(value)} WAX` : formatNumber(value)}{usd?<span className="usd-s">/${formatNumber(usd)}</span>:''}</div>
            </div>
        );
    if (number < 1000000)
        return (
            <div className="Growth">
                <div><svg className="Glyph ArrowDown" width="16" height="16" viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9h3l-4 4-4-4h3V3h2z" fill-rule="evenodd"></path>
                </svg></div>
                <div>{includeWAX ? `${formatNumber(value)} WAX` : formatNumber(value)}{usd?<span className="usd-s">/${formatNumber(usd)}</span>:''}</div>
            </div>
        );
    else
        return '-';
};

export const formatMarket = (market) => {
    if (market === 'simplemarket') {
        return "Simplemarket";
    } else if (market === 'waxinventory') {
        return "WAX Inventory";
    } else if (market === 'morevgocom11') {
        return "More VGO";
    } else if (market === 'market.myth' || market === 'gpk.myth' || market === 'ws.myth' || market === 'myth') {
        return "Myth.Market";
    } else if (market === 'alcornftswap' || (market === 'alcordexmain')) {
        return "alcor.exchange";
    } else if (market === 'market.place') {
        return "Collectables.io";
    } else if (market === 'gpk.market') {
        return "GPK.Auction";
    } else if (market === 'wax.stash') {
        return "waxstash.com";
    } else if (market === 'nft.cow') {
        return "nftcow.com";
    } else if (market === 'atomicmarket') {
        return "Atomichub.io";
    } else if (market === 'waxplorercom' || market === 'nft.hive') {
        return "NFTHive.io";
    } else if (market === 'cryptoslamio') {
        return "Cryptoslam.io"
    } else if (market === 'waxarena3dk1') {
        return "waxarena.net"
    } else if (market === 'primarydrops') {
        return "Primary Sales"
    } else if (market === 'neftyblocksd') {
        return "NeftyBlocks.com"
    } else if (market === 'wdny.io') {
        return "wdny.io"
    } else if (market === 'atomicdropsx') {
        return "Atomichub.io Drops"
    }

    return market;
};

export const getWaxStashAuthor = (author) => {
    if (author === 'dopestickers') {
        return 'boxmaze';
    } else if (author === 'cryptotwerpz') {
        return 'twerpz';
    }

    return 'gpk';
};

export const getPriceLink = (asset, t = null, newOwner = null, activeUser = null) => {
    const {
        price,
        totalRevenue,
        offer,
        assetId,
        owner,
        receiver,
        name,
        orderId,
        author,
        sender,
        market,
        isAuction,
        bidder,
        buyer
    } = asset;

    if (price)
        return (<div className="MarketLink Sold"><div>{t('asset.sold_to_buyer_on_market', {
            'buyer': buyer ? buyer : receiver ? receiver : owner, 'market': formatMarket(market)})}</div></div>);
    if (totalRevenue)
        return (<div className="MarketLink Revenue"><div>Revenue: <b>{
            Math.round(totalRevenue * 100)/100
        }</b> WAX</div></div>);
    if (offer) {
        let link = '';
        const marketElement = isAuction && bidder ? <div>{t('search.highest_bidder')}:</div> : <div>{sender !== activeUser || (!market && !owner) ? t('search.seller') : t('search.market')}</div>;

        const displayName = bidder ? bidder : (sender !== activeUser || (!market && !owner) ? sender : formatMarket(market ? market : owner));

        if (owner === 'simplemarket') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={"https://wax.simplemarket.io/products/asset/" + assetId}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (market === 'waxarena3dk1') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={"https://waxarena.net/card/" + assetId}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'waxplorercom') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={"https://nfthive.io/asset/" + assetId}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'waxinventory') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={"https://waxinventory.com/app/nft/" + assetId}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'morevgocom11') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={"https://morevgo.com/market/?search="+name}><div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'market.myth') {
            if (author === 'gpk.topps') {
                link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://gpk.market/asset/${assetId}?referral=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
            } else if (author === 'shatner') {
                link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://shatner.market/asset/${assetId}?referral=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
            }
        } else if (owner === 'alcornftswap') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://wax.alcor.exchange/nft-market/order/${orderId}`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'market.place') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://collectables.io/listing/${orderId}?ref=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'gpk.market') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://gpk.auction/auction/${assetId}`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'wax.stash') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://waxstash.com/${getWaxStashAuthor(author)}?assetid=${assetId}&refer=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'nft.cow') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://nftcow.com/#/`}><div>Moo</div><div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'atomicmarket') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://nfthive.io/sale/${assetId}`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'alcordexmain') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://wax.alcor.exchange/markets/${name}-packs.topps`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'gpk.myth') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://gpk.market/packs/${name}?referral=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        } else if (owner === 'ws.myth') {
            link = (<a className="MarketLink Available" target="_blank" rel="noopener noreferrer" href={`https://shatner.market/packs/${name}?referral=waxplorerref`}>{marketElement}<div><div className="Arrow">»</div>{displayName}</div></a>)
        }
        return (link);
    } else {
        return (
        <a target="_blank" className="MarketLink Available" href={`/profile?account=${owner}&collection=${author}&tab=inventory`}>
            <div>{t('search.owner')}:</div>
            <div><div className="Arrow">»</div>
            <div>{newOwner ? newOwner : owner}</div></div>
        </a>);
    }
};

export default getPriceLink;
