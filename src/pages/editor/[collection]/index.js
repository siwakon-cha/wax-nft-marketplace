import React from 'react';
import {useTranslation} from "react-i18next";
import EditCollectionComponent from "../../../components/editor/EditCollectionComponent";
import {getImage} from "../../../components/helpers/FormatLinks";
import Page from "../../../components/page/Page";
import {get} from "../../../components/helpers/Api";
import qs from 'qs';

const EditorCollectionPage = (props) => {
    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const image = getImage('', null, t);
    const title = t('links.nft_hive_editor_page');
    const description = t('links.manage_your_wax_collection_and_create_nfts');

    return (
        <Page
            id="EditCollectionPage"
            image={image}
            title={title}
            description={description}
        >
            <EditCollectionComponent {...props} />
        </Page>
    );
};

EditorCollectionPage.getInitialProps = async (ctx) => {
    const c = ctx.query.collection;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));

    values['collection'] = await get("get-collection/" + c);

    return values;
};

export default EditorCollectionPage;
