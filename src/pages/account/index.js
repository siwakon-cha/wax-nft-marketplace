import React, {useEffect, useState} from 'react';
import AssetListHeader from '../../components/common/util/AssetListHeader';
import qs from 'qs';
import {useTranslation} from "react-i18next";
import {get} from "../../components/helpers/Api";
import Page from "../../components/page/Page";
import Wallet from "../../components/wallet/Wallet";
import FtWallet from "../../components/wallet/FtWallet";
import UserComponent from "../../components/user/UserComponent";
import cn from "classnames";
import UserPicture from '../../components/user/UserPicture';

const AccountPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [userPicture, setUserPicture] = useState();

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    useEffect(() => {
        if (process.browser)
            get("user-picture/" + userName).then(result => setUserPicture(result['image']));
    }, [userName]);

    const title = t('links.check_out_account');
    const description = t('links.inspect_asset_on_waxplorer');

    return (
        <Page
            title={title}
            description={description}
            id={'AccountPage'}
        >
            <div className={cn('w-full h-auto mx-auto text-base')}>
                <h1 className={cn('w-full m-auto')}>{userName}</h1>
                <UserPicture userPicture={userPicture} />
                <AssetListHeader>
                    {t('general.wallet')}
                </AssetListHeader>
                <Wallet ual={ual} />
                <AssetListHeader>
                    {t('overview.ft_assets')}
                </AssetListHeader>
                <FtWallet ual={ual} />
                <UserComponent ual={ual} userName={userName}/>
            </div>
        </Page>
    );
};

AccountPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('wallet?', ''));
};

export default AccountPage;