import React, {useContext, useState} from 'react';
import AssetListHeader from "../common/util/AssetListHeader";
import {useTranslation} from "react-i18next";
import cn from "classnames";
import {Context} from "../waxplorer";
import {useQuery} from "react-query";
import {get} from "../helpers/Api";

const EditReleaseComponent = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const [collection, setCollection] = useState(props.collection);

    const release = props['release'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const setRelease = props['setRelease'];

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const {name, collectionName, image, marketFee, telegram, url, description, newCollection} = collection;

    const {releaseName} = release;

    const [readyForNewRelease, setReadyForNewRelease] = useState(collectionName !== '');

    const [editReleaseName, setEditReleaseName] = useState(releaseName);

    const [hasChanges, setHasChanges] = useState(false);

    const { isLoading, error, data } = useQuery(`collection-${collectionName}`, () => get(
        `collection-details/${collectionName}`));

    const [ state, dispatch ] = useContext(Context);

    const authorized = data ? data['authorized'] : null;
    const [edit, setEdit] = useState('');
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const [showCollection, setShowCollection] = useState(false);

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

    const templates = data ? data['templates'] : null;

    const changeEditMode = (mode) => {
        if (edit === mode) {
            setEdit('');
        } else {
            setEdit(mode);
        }
    };

    const onChange = (e, field) => {
        let changed = false;

        switch(field) {
            case 'market_fee':
                break;
            case 'description':
                break;
            case 'url':
                break;
            case 'name':
                break;
            case 'display_name':
                break;
            case 'image':
                break;
            case 'release_name':
                if (e.target.value)
                    setEditReleaseName(e.target.value.substr(0, 12));
                else
                    setEditReleaseName('');
                break;
        }

        setHasChanges(changed)
    };

    const handleEdit = (wasEdited, error, transactionId) => {
        if (wasEdited) {
            setReadyForNewRelease(true);
            setHasChanges(false);
            setRelease({
                'releaseName': editReleaseName
            })
        }
    };

    const createRelease = () => {
        setRelease({
            'releaseName': editReleaseName
        })
    };

    const cancelRelease = () => {
        setEdit('');
        setEditReleaseName('');
    };

    const saveRelease = () => {
        let edited = false;
        if (edited) {
        }
        setEdit('');
    };

    const reset = () => {
        setEdit('');
        setHasChanges(false);
    };


    const toggleShowCollection = () => {
        setShowCollection(!showCollection);
    };

    return (
        <div onScroll={e => handleScroll(e)}>
            <AssetListHeader className='cursor-pointer' onClick={toggleShowCollection}>
                {t('profile.collection')} - {collectionName}
            </AssetListHeader>
            <div className={cn('block lg:flex', showCollection ? '' : 'hidden')}>
                <div className="relative block w-64 text-xs text-white h-64 my-auto mx-5%">
                    <img className="max-w-xs max-h-xs m-auto" src={image ? image : '/image-outline.svg'} alt="none" />
                </div>
                <div className="text-left w-2/5 text-white my-4 mx-5%">
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.name')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">
                            {collectionName}
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.display_name')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">
                            {name}
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.description')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">
                            {description}
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.url')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">
                            {url}
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.market_fee')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">
                            {marketFee}
                        </div>
                    </div>
                </div>
            </div>
            <AssetListHeader className='cursor-pointer'>
                {t('collection.release')}{editReleaseName ? ` - ${editReleaseName}` : ''}
            </AssetListHeader>
            <div className={"AssetList h-fit-content pt-12 bg-blue2"}>
                <div className={cn('block lg:flex')}>
                    <div className="relative block w-64 text-xs text-white h-64 my-auto mx-5%">
                        { !releaseName ?
                        <div className={"relative h-12 mt-8"}>
                            <div className="-top-3">{t('collection.name')}</div>
                            <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'name' ?
                                <input
                                    className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                    onChange={(e) => onChange(e, 'name')}
                                    type="text"
                                    value={editReleaseName}
                                    placeholder={t('collection.name') + ' (12 characters)'}
                                /> : (editReleaseName ? editReleaseName : t('collection.name')) }
                                <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('name')}>
                                    <img className="max-w-xs max-h-xs m-auto" src={'/edit.svg'} className="h-5 w-5 m-xs" />
                                </div>
                            </div>
                        </div> : releaseName }
                    </div>
                    <div className="text-left w-2/5 text-white my-4 mx-5%">
                        <div className={"relative h-12 mt-8"}>
                            <div className="-top-3">{t('collection.name')}</div>
                            <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'name' ?
                                <input
                                    className={"flex h-6 w-full text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                    onChange={(e) => onChange(e, 'name')}
                                    type="text"
                                    value={editReleaseName}
                                    placeholder={t('collection.name') + ' (12 characters)'}
                                /> : (editReleaseName ? editReleaseName : t('collection.name')) }
                                <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('name')}>
                                    <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                                </div>
                            </div>
                        </div>
                    { (!collectionName || (authorized && authorized.includes(userName))) && hasChanges ? <div onClick={saveRelease} className={"w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent text-center mt-4 mr-auto mb-0 ml-0 outline-none border-xs border-solid border-primary"}>{t('collection.save_collection')}</div> : '' }
                    { (!collectionName || (authorized && authorized.includes(userName))) && hasChanges && collectionName ? <div onClick={reset} className={"w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent text-center mt-4 mr-auto mb-0 ml-0 outline-none border-xs border-solid border-primary"}>{t('collection.reset')}</div> : '' }
                    </div>
                </div>
            </div>
            {templates ? templates.map(template => <div className={'text-center flex break-words p-1 w-56 h-48 rounded-lg relative text-xs mt-4 mb-8 mx-4 min-w-54 bg-collection shadow-collection backdrop-blur-xs'}>
                <div className={"m-auto text-white"}>
                </div>
             </div>) : ''}
            {showScrollUpIcon ? <div className="absolute right-15 bottom-10 lg:right-17.5 lg:bottom-17.5" onClick={scrollUp}><img className="w-10 h-10" src = "/up-arrow.svg" /></div> : '' }
        </div>
    );
};

export default EditReleaseComponent;
