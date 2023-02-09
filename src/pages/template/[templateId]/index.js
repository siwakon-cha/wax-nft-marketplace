import React, {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import {get} from "../../../components/helpers/Api";

import {useTranslation} from "react-i18next";
import qs from "qs";

import TemplateDetails from "../../../components/template/TemplateDetails";
import {Context} from "../../../components/waxplorer";
import {useQuery} from "react-query";
import LoadingIndicator from "../../../components/loadingindicator";
import AssetImage from "../../../components/template/AssetImage";
import Page from "../../../components/page/Page";
import FullImageView from "../../../components/fullimageview/FullImageView";
import cn from 'classnames'

const TemplatePage = (props) => {
    const miniTemplate = props.miniTemplate;

    const { isLoading, error, data } = useQuery(
        `template-${miniTemplate['templateId']}`,
        process.browser ? () => get(`template/${miniTemplate['templateId']}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const template = data ? data : {
        author: null, name: null, image: null, category: null, idata: null, verified: null, authorImg: {
            name: null, image: null}
    };

    const router = useRouter();
    const templateId = router ? qs.parse(router.query)['templateId'] : miniTemplate['templateId'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const [ state, dispatch ] = useContext(Context);

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [count, setCount] = useState('Loading...');
    const [burned, setBurned] = useState('');
    const [showImage, setShowImage] = useState(false);

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];

    const {
        author,
        category,
        idata,
        verified,
        total
    } = template;

    let {
        authorImg
    } = template;

    const assetData = idata ? JSON.parse(idata) : null;

    let video = '';
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ? assetData['video'] : `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    }

    let name = template['name'] ? template['name'] : '';

    if (!name) {
        name = assetData ? assetData['name'] : '';
    }

    let image = template ? template['image'] : '';

    if (!image && assetData) {
        image = `https://ipfs.hivebp.io/ipfs/${assetData['img'] ? assetData['img'] : assetData['image']}`;
    }

    const [displayImage, setDisplayImage] = useState(image);

    useEffect(() => {
        setDisplayImage(image);
        dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: miniTemplate.collectionImage });
          Promise.all([
              get('template-count/' + templateId).then((result) => {
                  setCount(result['cnt']); setBurned(result['numburned'])
              }),
          ])
    }, [templateId, image]);

    const toggleImage = () => {
        if (showImage) {
            setDisplayImage(image);
        }
        setShowImage(!showImage);
    };

    const templateName = `${miniTemplate.name} by ${miniTemplate.collectionName}`;

    const preview = miniTemplate.preview ? miniTemplate.preview : miniTemplate.image ? miniTemplate.image : 'https://www.nfthive.io/nfthive-logo.png';

    const title = t('links.check_out_asset_name', {asset_name: templateName});
    const description = t('links.inspect_asset_on_waxplorer');

    if (isLoading || !template) {
        return (
            <Page
                id="TemplatePage"
                title={title}
                description={description}
                image={preview}
            >
                <LoadingIndicator/>
            </Page>
        );
    }

    const assetCount = count ? count : total;

    const formattedTemplate = {
        name: name,
        author: author,
        category: category,
        authorImg: authorImg,
        verified: verified,
        image: image,
        mdata: idata
    };

    const page = (
        <Page
            id="TemplatePage"
            title={title}
            description={description}
            image={image}
        >

            {isLoading ? <LoadingIndicator/> :
            <div className={cn(
                'w-full h-auto flex flex-col lg:flex-row',
                'justify-center items-center'
            )}>
                <AssetImage
                    asset={formattedTemplate}
                    toggleImage={toggleImage}
                    setDisplayImage={setDisplayImage}
                />
                <TemplateDetails
                    template={formattedTemplate}
                    templateId={templateId}

                    assetCount={assetCount}
                    burnedCount={burned}
                />
            </div> }
            <div className="w-auto h-40 relative text-center top-4">
                <div className="h-20 m-auto">
                    <a target="_blank" className="text-yellow-600" href={`https://wax.atomichub.io/explorer/template/${author}/${templateId}`}>{
                        t('asset.view_on', {market:'AtomicHub'})}
                    </a>
                </div>
            </div>
        </Page>
    );

    if (showImage) {
        return (<div>
            {showImage ? <FullImageView
                image={image}
                toggleFunc={toggleImage}
            /> : ''}
            {page}
        </div>)
    } else {
        return page;
    }
};

TemplatePage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');
    const templateId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const miniTemplate = await get("template-minimal/" + templateId);

    const values = qs.parse(paths[2].replace(`${templateId}?`, ''));
    values['miniTemplate'] = miniTemplate;

    return values;
};

export default TemplatePage;
