import React, {useContext, useState} from 'react';

import {useTranslation} from "react-i18next";

import {Context} from "../../components/waxplorer";
import {useQuery} from "react-query";
import {get} from "../../components/helpers/Api";
import cn from "classnames";
import qs from 'qs';
import EditCollectionComponent from "../../components/editor/EditCollectionComponent";
import {getImage, setQueryStringWithoutPageReloadPush} from "../../components/helpers/FormatLinks";
import EditReleaseComponent from "../../components/editor/EditReleaseComponent";
import Page from "../../components/page/Page";

const EditorPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const { isLoading, error, data } = useQuery(
        `collections-${userName}`,
        process.browser ? () => get(`authorized-collections/${userName}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const collections = data;

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [selectedCollection, setSelectedCollection] = useState( null);
    const [selectedRelease, setSelectedRelease] = useState( null);

    const [ state, dispatch ] = useContext(Context);

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById("EditCollectionPage");
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    const handleScroll = e => {
        let element = e.target;

        if (element.className === 'Page') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
        }
    };

    const image = getImage('', null, t);

    const editCollection = (collection) => {
        setQueryStringWithoutPageReloadPush(qs.stringify(
            {'collection': collection.collectionName ? collection.collectionName : 'new'}));
        setSelectedCollection(collection);
    };

    const setRelease = (release) => {
        setQueryStringWithoutPageReloadPush(qs.stringify(
            {'collection': release.collectionName, 'release': release.releaseName ? release.releaseName : 'new'}));
        setSelectedRelease(release);
    };
    const title = t('links.nft_hive_editor_page');
    const description = t('links.manage_your_wax_collection_and_create_nfts');

    return (
        <Page
            id="EditCollectionPage"
            title={title}
            description={description}
            image={image}
        >
            { selectedRelease ? <EditReleaseComponent {...props} collection={selectedCollection} release={
                selectedRelease} /> : (selectedCollection ? <EditCollectionComponent {...props} collection={
                    selectedCollection} setRelease={setRelease} editCollection={editCollection} /> :
                <div className={cn('AssetList pt-12 bg-bluet2 h-auto')}>
                     <div className={'CollectionRelease'}>
                         <div className={"ReleaseContent"} onClick={() => editCollection({
                             'name': '',
                             'collectionName': '',
                             'image': '',
                             'marketFee': '',
                             'telegram': '',
                             'url': '',
                             'description': '',
                             'newCollection': true
                         })}>
                             <div className={"ReleaseHeader"}>+</div>
                             <div className={"ReleaseCount"}>{t('collection.new_collection')}</div>
                         </div>
                     </div>
                     {collections ? collections.map(collection => <div className={'CollectionRelease'}>
                        <div className={"ReleaseContent"} onClick={() => editCollection(collection)}>
                             <div className={"ReleaseHeader"}>{collection.collectionName}</div>
                             <div className={"ReleaseImage"}><img src={collection.image} /></div>
                             <div className={"ReleaseCount"}>{t('collection.x_assets', {x: collection.assets})}</div>
                             <div className={"ReleaseCount"}>{t('collection.x_templates', {x: collection.templates})}</div>
                         </div>
                     </div>) : ''}
                </div> )
            }
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}><img src = "/up-arrow.svg" /></div> : '' }
        </Page>
    );
};

export default EditorPage;
