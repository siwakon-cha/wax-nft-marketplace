import React from 'react';
import {get} from "../../../components/helpers/Api";
import qs from 'qs';
import Drop from "../../../components/drops/Drop";
import {useQuery} from "react-query";
import LoadingIndicator from "../../../components/loadingindicator";
import {useTranslation} from "react-i18next";
import Page from "../../../components/page/Page";

const DropPage = (props) => {
    const miniDrop = props['miniDrop'];

    const searchDropId = miniDrop.dropId;

    const { isLoading, error, data } = useQuery(
        `drops?drop_id=${searchDropId ? searchDropId : ''}`,
        process.browser ? () => get(`drops?drop_id=${searchDropId ? searchDropId : ''}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const {t, i18n} = useTranslation('common');

    let name = miniDrop.name;

    if (!name) {
        const data = JSON.parse(miniDrop.idata);
        name = Object.keys(data).includes('name') ? data['name'] : null;
    }

    const preview = miniDrop.preview ? miniDrop.preview : miniDrop.image ? miniDrop.image : 'https://www.nfthive.io/nfthive-logo.png';
    const title = t('links.check_out_asset_name', {asset_name: name});
    const description = t('links.inspect_asset_on_waxplorer');

    return (
        <Page
            id={"DropPage"}
            image={preview}
            title={title}
            description={description}
        >
            {isLoading || !data ? <LoadingIndicator/> : <Drop {...props} drop={data[0]} />}
        </Page>
    );
};

DropPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');
    const assetId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const miniDrop = await get("drop-minimal/" + assetId);

    const values = qs.parse(paths[2].replace(`${assetId}?`, ''));
    values['miniDrop'] = miniDrop;

    return values;
};

export default DropPage;
