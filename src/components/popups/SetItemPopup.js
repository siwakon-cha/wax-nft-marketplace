import cn from "classnames";
import {
    formatNumberS,
    getAttributeName,
    getAuthorLink,
    getBorderName,
    getColorName,
    getRarityName,
    getTypeName,
    getVariantName,
    openSearchPopup,
    setQueryStringWithoutPageReload,
    setQueryStringWithoutPageReloadPush,
    setQueryStringWithoutPageReloadPushPath
} from "../helpers/FormatLinks";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import Popup from "./Popup";
import {Context} from "../waxplorer";
import Button from "../common/util/input/Button";
import VideoElement from "../videoelement/VideoElement";
import qs from "qs";
import Link from "../common/util/input/Link";

const SetItemPopup = ({asset, closeCallBack, callBack}) => {
    const {number, total, category, variant, rarity, author, name, border, color, attr7, attr8, attr9,
        attr10, type, assets, fullImage, rarity_score} = asset;

    const {t} = useTranslation('common');

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    const [ state, dispatch ] = useContext(Context);

    const count = assets ? assets.filter(asset => asset.asset_id).length : 0;

    const minMint = assets ? assets.map(asset => asset.mint).sort()[0] : null;

    const getStatus = (asset) => {
        if (asset.status === 'for_sale')
            return 'active_sales';
        else if (asset.status === 'staked') {
            return 'staked'
        } else if (asset.status === 'choobed') {
            return 'choobed'
        } else {
            return 'assets'
        }
    };

    const getLinkStr = (tab, search) => {
        const query = {
            'term': escape(name),
            'collection': author,
            'order_by': 'date_desc',
            'rarity': rarity ? rarity : '',
            'variant': variant ? variant : '',
            'border': border ? border : '',
            'type': type ? type : '',
            'attr7': attr7 ? attr7 : '',
            'attr8': attr8 ? attr8 : '',
            'attr9': attr9 ? attr9 : '',
            'attr10': attr10 ? attr10 : '',
            'exact_search': 'true',
            'tab': tab === 'inventory' ? (getStatus(asset) === 'active_sales' ? 'sales' : 'inventory') : 'sales',
            'search_type': search ? search : getStatus(asset)
        };

        return qs.stringify(query);
    };

    return (
        <Popup
            title={'Collection Item'}
            cancel={cancel}
        >
            <div className={cn(
                'w-auto my-2'
            )}>
                <h4>{name}</h4>
                <div className={'flex my-10 w-full'}>
                    <div className={'flex m-auto w-1/2 h-full'}>
                        { fullImage && (fullImage.includes('video:')) ?
                            <VideoElement
                                video={fullImage.includes('video:') ? fullImage.replace('video:',
                                    'https://ipfs.hivebp.io/ipfs/') : fullImage}
                            /> :
                            <div className={cn('m-auto')}>
                                <img src={fullImage} />
                            </div>
                        }
                        <img className={'m-auto'} src={fullImage}/>
                    </div>
                    <table>
                        <tbody>
                        {number && <tr>
                            <td><b>{t('asset.number')}:</b></td>
                            <td>{number}</td>
                        </tr> }
                        <tr>
                            <td><b>{t('asset.owned')}:</b></td>
                            <td>{count}</td>
                        </tr>
                        <tr>
                            <td><b>{t('asset.min_mint')}:</b></td>
                            <td>
                                {minMint}
                            </td>
                        </tr>
                        <tr>
                            <td><b>{t('profile.collection')}:</b></td>
                            <td>{getAuthorLink(author)}</td>
                        </tr>
                        <tr>
                            <td><b>{t('asset.category')}:</b></td>
                            <td>{category}</td>
                        </tr>
                        {variant && <tr>
                            <td><b>{getVariantName(t, author, category)}:</b></td>
                            <td>{variant}</td>
                        </tr> }
                        {rarity && <tr>
                            <td><b>{getRarityName(t, author, category)}:</b></td>
                            <td>{rarity}</td>
                        </tr> }
                        {color && <tr>
                            <td><b>{getColorName(t, author, t('search.color'))}:</b></td>
                            <td>{color}</td>
                        </tr> }
                        {border && <tr>
                            <td><b>{getBorderName(t, author, category)}:</b></td>
                            <td>{border}</td>
                        </tr> }
                        {type && <tr>
                            <td><b>{getTypeName(t, author, t('search.type'))}:</b></td>
                            <td>{type}</td>
                        </tr> }
                        {attr7 && <tr>
                            <td><b>{getAttributeName(t, author, category, 0)}:</b></td>
                            <td>{attr7}</td>
                        </tr> }
                        {attr8 && <tr>
                            <td><b>{getAttributeName(t, author, category,  1)}:</b></td>
                            <td>{attr8}</td>
                        </tr> }
                        {attr9 && <tr>
                            <td><b>{getAttributeName(t, author, category, 2)}:</b></td>
                            <td>{attr9}</td>
                        </tr> }
                        {attr10 && <tr>
                            <td><b>{getAttributeName(t, author, category, 3)}:</b></td>
                            <td>{attr10}</td>
                        </tr> }
                        { (total || total === 0) && <tr>
                            <td><b>{t('profile.total')}:</b></td>
                            <td>{total}</td>
                        </tr> }
                        { (rarity_score || rarity_score === 0) && <tr>
                            <td><b>{t('ranking.rarity_score')}:</b></td>
                            <td>{formatNumberS(rarity_score)}</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={'flex w-1/2 justify-center m-auto'}>
                <Link
                    href={'/inventory?'+getLinkStr('inventory')}
                >
                <div className={cn(
                    'w-24 h-6 text-primary rounded border border-primary outline-none text-sm align-middle font-normal',
                    'mt-4 mb-0 mx-4 bg-transparent cursor-pointer hover:font-bold'
                )} onClick={cancel}>{'Inventory'}</div>
                </Link>
                <Link
                    href={'/market?'+getLinkStr('sales', 'sales')}
                >
                    <div
                        className={cn(
                            'w-24 h-6 text-primary rounded border border-primary outline-none text-sm align-middle font-normal',
                            'mt-4 mb-0 mx-4 bg-transparent cursor-pointer hover:font-bold'
                        )}
                        onClick={cancel}>{'Market'}
                    </div>
                </Link>
            </div>
        </Popup>
    );
};

export default SetItemPopup;