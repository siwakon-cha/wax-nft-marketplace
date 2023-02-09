import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import FtWallet from "../../components/fts/FtWallet";
import Page from "../../components/page/Page";
import cn from "classnames";
import AssetListHeader from "../../components/common/util/AssetListHeader";

const FungibleTokensPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    useEffect(() => {
    }, [userName]);

    const image = 'https://www.nfthive.io/nfthive-logo.png';
    const title = t('links.check_out_account');
    const description = t('links.inspect_asset_on_waxplorer');

    return (
        <Page
            id="FTPage"
            title={title}
            description={description}
            image={image}
        >
            <div className={cn('w-full h-auto mx-auto text-base')}>
                <AssetListHeader>
                    {t('overview.ft_assets')}
                </AssetListHeader>
                <FtWallet ual={ual} />
            </div>
        </Page>
    );
};

export default FungibleTokensPage;