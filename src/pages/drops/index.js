import React from 'react';
import Page from "../../components/page/Page";
import DropsList from "../../components/drops/DropsList";
import qs from 'qs';
import {useTranslation} from "react-i18next";

const DropsPage = (props) => {
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    return (
        <Page
            id={"DropsPage"}
            title={t('links.check_out_drops')}
            description={t('links.inspect_asset_on_waxplorer')}
        >
            <DropsList {...props}/>
        </Page>
    );
};

DropsPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('drops?', ''));
};

export default DropsPage;
