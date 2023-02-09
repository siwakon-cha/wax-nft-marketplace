import React, {useContext, useState} from 'react';
import {useTranslation} from "react-i18next";
import AssetListHeader from '../common/util/AssetListHeader';
import {Context} from "../waxplorer";
import {useQuery} from "react-query";
import {get} from "../helpers/Api";
import cn from "classnames";

const EditCollectionComponent = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const [collection, setCollection] = useState(props.collection);

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const setRelease = props['setRelease'];

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const {name, collectionName, image, marketFee, telegram, url, description, newCollection} = collection;

    const [readyForNewRelease, setReadyForNewRelease] = useState(collectionName !== '');

    const [editDescription, setEditDescription] = useState(description);
    const [editName, setEditName] = useState(collectionName);
    const [editDisplayName, setEditDisplayName] = useState(name);
    const [editUrl, setEditUrl] = useState(url);
    const [editImage, setEditImage] = useState(image.replace('https://ipfs.hivebp.io/ipfs/', ''));
    const [editMarketFee, setEditMarketFee] = useState(marketFee);
    const [editingRelease, setEditingRelease] = useState(false);
    const [editReleaseName, setEditReleaseName] = useState('');

    const [hasChanges, setHasChanges] = useState(false);

    const { isLoading, error, data } = useQuery(
        `collection-${collectionName}`,
        process.browser ? () => get(`collection-details/${collectionName}`) : () => {
            return {isLoading: true, error: null, data: null}});

    const [ state, dispatch ] = useContext(Context);

    const authorized = data ? data['authorized'] : null;
    const [edit, setEdit] = useState('');

    const categories = data ? data['categories'] : null;

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
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                    if (val && parseInt(val) > 15) {
                        setEditMarketFee(15);
                    } else {
                        setEditMarketFee(val);
                    }
                }
                changed = !val || parseInt(val) !== parseInt(marketFee);
                break;
            case 'description':
                setEditDescription(e.target.value);
                changed = e.target.value !== description;
                break;
            case 'url':
                setEditUrl(e.target.value);
                changed = e.target.value !== url;
                break;
            case 'name':
                if (e.target.value)
                    setEditName(e.target.value.substr(0, 12));
                else
                    setEditName('');
                changed = e.target.value !== collectionName;
                break;
            case 'display_name':
                setEditDisplayName(e.target.value);
                changed = e.target.value !== name;
                break;
            case 'image':
                setEditImage(e.target.value);
                changed = e.target.value !== image.replace(
                    'https://ipfs.hivebp.io/ipfs/', '');
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
            setCollection({
                marketFee: editMarketFee,
                name: editDisplayName,
                collectionName: editName,
                image: editImage,
                telegram: null,
                url: editUrl,
                description: editDescription,
                newCollection: false,
            })
        }
    };

    const saveCollection = () => {
        let edited = false;
        if (editDescription) {
            dispatch({type: 'SET_EDIT_DESCRIPTION', payload: editDescription ? editDescription : 'edit:Empty'});
            edited = true;
        }
        if (editName) {
            dispatch({type: 'SET_EDIT_NAME', payload: editName ? editName : 'edit:Empty'});
            edited = true;
        }
        if (editName) {
            dispatch({type: 'SET_EDIT_DISPLAY_NAME', payload: editDisplayName ? editDisplayName : 'edit:Empty'});
            edited = true;
        }
        if (editUrl) {
            dispatch({type: 'SET_EDIT_URL', payload: editUrl ? editUrl : 'edit:Empty'});
            edited = true;
        }
        if (editMarketFee) {
            dispatch({type: 'SET_EDIT_MARKET_FEE', payload: editMarketFee ? editMarketFee : 0});
            edited = true;
        }
        if (editImage) {
            dispatch({type: 'SET_EDIT_IMAGE', payload: editImage ? editImage : 'edit:Empty'});
            edited = true;
        }
        if (edited) {
            dispatch({type: 'SET_IMAGE', payload: image});
            dispatch({type: 'SET_COLLECTION_NAME', payload: collectionName});
            dispatch({type: 'SET_CALLBACK', payload: handleEdit});
            dispatch({type: 'SET_EDIT_NEW', payload: newCollection});
            dispatch({type: 'SET_ACTION', payload: 'editCollection'});
        }
        setEdit('');
    };

    const reset = () => {
        setEdit('');
        setEditImage(image.replace('https://ipfs.hivebp.io/ipfs/', ''));
        setEditName(name);
        setEditUrl(url);
        setEditDescription(description);
        setEditMarketFee(marketFee);
        setHasChanges(false);
    };

    const selectRelease = (release) => {
        setRelease(release);
        const element = document.getElementById("ReleaseView");
        element.scrollTo({left: 0, top: 0, behavior: "smooth"});
    };

    return (
        <div>
            <AssetListHeader className = 'cursor-pointer'>
                {t('profile.collection')}
            </AssetListHeader>
            <div className={cn('block lg:flex')}>
                <div className="relative block w-64 text-xs text-white h-64 my-auto mx-5%">
                    <img className="max-w-xs max-h-xs m-auto" src={editImage ? `https://ipfs.hivebp.io/ipfs/${editImage}` : '/image-outline.svg'} alt="none" />
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">IPFS Hash</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'image' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'image')}
                                type="text" value={editImage}
                                placeholder={t('collection.image')}
                            /> : editImage}
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('image')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-left w-2/5 text-white my-4 mx-5%">
                    { !collectionName ?
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.name')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'name' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'name')}
                                type="text"
                                value={editName}
                                placeholder={t('collection.name') + ' (12 characters)'}
                            /> : (editName ? editName : t('collection.name')) }
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('name')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div> : '' }
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.display_name')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'display_name' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'display_name')}
                                type="text"
                                value={editDisplayName}
                                placeholder={t('collection.display_name')}
                            /> : (editDisplayName ? editDisplayName : t('collection.display_name')) }
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('display_name')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.description')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'description' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'description')}
                                type="text" value={editDescription}
                                placeholder={t('collection.description')}
                            /> : (editDescription ? editDescription : t('collection.description')) }
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('description')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.url')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'url' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'url')}
                                type="text" value={editUrl}
                                placeholder={t('collection.url')}
                            /> : (editUrl ? editUrl : t('collection.url')) }
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('url')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div>
                    <div className={"relative h-12 mt-8"}>
                        <div className="-top-3">{t('collection.market_fee')}</div>
                        <div className="mx-auto mt-auto mb-2.5 lg:mb-auto leading-6 font-bold text-white flex h-auto">{edit === 'market_fee' ?
                            <input
                                className={"flex h-6 w-half text-yellow-600 rounded-none relative border-solid border-b border-primary text-xs bg-none outline-none top-px"}
                                onChange={(e) => onChange(e, 'market_fee')}
                                type="text" value={editMarketFee}
                                placeholder={t('collection.market_fee') + ' (0% - 15%)'}
                            /> : (editMarketFee ? editMarketFee : t('collection.market_fee')) }
                            <div className={'h-6 leading-6 text-left cursor-pointer'} onClick={() => changeEditMode('market_fee')}>
                                <img src={'/edit.svg'} className="h-5 w-5 m-xs" />
                            </div>
                        </div>
                    </div>
                    { (!collectionName || (authorized && authorized.includes(userName))) && hasChanges ? <div onClick={saveCollection} className={"w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent text-center mt-4 mr-auto mb-0 ml-0 outline-none border-xs border-solid border-primary"}>{t('collection.save_collection')}</div> : '' }
                    { (!collectionName || (authorized && authorized.includes(userName))) && hasChanges && collectionName ? <div onClick={reset} className={"w-24 h-6 leading-6 text-yellow-600 cursor-pointer rounded text-xs font-bold bg-transparent text-center mt-4 mr-auto mb-0 ml-0 outline-none border-xs border-solid border-primary"}>{t('collection.reset')}</div> : '' }
                </div>
            </div>
            <AssetListHeader className='cursor-pointer'>
                {t('collection.releases')}
            </AssetListHeader>
            <div className={"AssetList h-fit-content pt-12 bg-blue2"} id={"ReleaseView"}>
                { readyForNewRelease && !hasChanges ? <div className={'text-center flex break-words p-1 w-56 h-48 rounded-lg relative text-xs mt-4 mb-8 mx-4 min-w-54 bg-collection shadow-collection backdrop-blur-xs'}>
                    <div className={"m-auto text-white"} onClick={() => selectRelease({
                        'collectionName': collectionName,
                        'releaseName': ''
                    })}>
                        <div className={"text-2xl leading-8 text-yellow-600"}>+</div>
                        <div>{t('collection.new_release')}</div>
                    </div>
                </div> : '' }
                {categories ? categories.map(category => <div className={'text-center flex break-words p-1 w-56 h-48 rounded-lg relative text-xs mt-4 mb-8 mx-4 min-w-54 bg-collection shadow-collection backdrop-blur-xs'}>
                    <div className={"m-auto text-white"}>
                        <div className={"text-2xl leading-8 text-yellow-600"}>{category.category}</div>
                        <div>{t('collection.x_assets', {x: category.assets})}</div>
                        <div>{t('collection.x_templates', {x: category.templates})}</div>
                    </div>
                </div>) : ''}
            </div>
        </div>
    );
};

export default EditCollectionComponent;
