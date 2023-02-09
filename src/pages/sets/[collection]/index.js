import React, {useContext, useEffect, useState} from 'react';

import qs from "qs";
import SetsComponent from "../../../components/sets/SetsComponent";
import {Context} from "../../../components/waxplorer";
import {
    formatAuthor,
    formatCollectionAuthor, getImage
} from "../../../components/helpers/FormatLinks";
import {useTranslation} from "react-i18next";
import Page from "../../../components/page/Page";
import {get} from "../../../components/helpers/Api";;

const SetsPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : '';

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const collection = props['collection']['collectionName'];

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const getInitialAccount = (values, username, props) => {
        if (values)
            return values['account'] ? values['account'] : (values['owner'] ? values['owner'] : (
                userName ? userName : props.account ? props.account : props.owner ? props.owner : ''));
        else
            return props.account ? props.account : props.owner;
    };

    let values = null;
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));
    const [account, setAccount] = useState(getInitialAccount(values, userName, props));

    if (!values)
        values = [];

    const author = process.browser ? (values['collection'] ? values['collection'] : 'gpk.topps') : props.collection['collectionName'];
    const category = process.browser ? values['category'] ? values['category'] : (author === 'gpk.topps' ? 'series1' : '') : props.category;
    const artist = process.browser ? (values['artist'] ? values['artist'] : null) : (props.artist ? props.artist : null);
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const [state, dispatch] = useContext(Context);
    const [searchUser, setSearchUser] = useState(account);

    const searchTriggered = state && state.searchTriggered ? state.searchTriggered : false;

    useEffect(() => {
        if (process.browser)
            getAssets();
    }, [searchTriggered]);

    const getAssets = async() => {
        dispatch({ type: 'SET_SCROLLED_DOWN', payload: false });
    };

    const handleScroll = e => {
        let element = e.target;

        if (element.className === 'SetsPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true });
            }
        }
    };

    const scrollUp = () => {
        const element = document.getElementsByClassName("SetsPage")[0];
        element.scrollTo({left: 0, top: 435, behavior: "smooth"});
    };

    const handleUserNameChange = (e) => {
        const val = e.target.value;
        setSearchUser(val);
    };

    const handleUserChange = () => {
        if (userName) {
            setAccount(userName);
            setSearchUser(userName);
        }
    };

    const getCollectionName = (author, category, artist) => {
        const authorName = formatCollectionAuthor(author);
        if (artist) {
            return `${authorName} Collection by ${artist}`
        } else if (category && category !== author) {
            category = formatAuthor(category);
            return `${authorName} ${category} Collection`
        } else {
            return `${authorName} Collection`
        }
    };

    const getPageName = (author, category, artist) => {
        return getCollectionName(author, category, artist);
    };

    const page = getPageName(author, category, artist);

    const image = getImage(author, 'set-api');

    const switchAccount = (account) => {
        setAccount(account);
    };

    const title = t('links.check_out_accounts_page_on_waxplorer', {account: account ? account : 'User', page: page});
    const description = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    return (
        <Page
            id="SetsPage"
            title={title}
            description={description}
            image={image}
        >
            <div className="TopInfoContainer">
                <div className="UserStatsContainer">
                    <div className="SettingsElement">
                        <input
                            type="text"
                            name='account'
                            placeholder={'Account'}
                            value={searchUser}
                            onChange={handleUserNameChange}
                        />
                        { userName && searchUser !== userName ? <div className="AutoFillButton" onClick={
                            handleUserChange}><img src="/person-outline.svg" /></div> : '' }
                    </div>
                    <div className="SettingsElement">
                        <button onClick={() => { switchAccount(searchUser) } } className="SwitchButton">{t('profile.switch')}</button>
                    </div>
                </div>
            </div>
            <div className={'relative'}>
                <SetsComponent ual={ual} account={account} collection={collection}/>
            </div>
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}>
                <img src = "/up-arrow.svg" />
            </div> : '' }
        </Page>
    );
};
SetsPage.getInitialProps = async (ctx) => {
    const c = ctx.query.collection;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));

    values['collection'] = await get("get-collection/" + c);

    return values;
};

export default SetsPage;
