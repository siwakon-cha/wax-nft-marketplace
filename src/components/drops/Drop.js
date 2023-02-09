import React, {useContext, useState} from 'react';
import {useTranslation} from "react-i18next";

import {formatNumber, getAuthorLink} from "../helpers/FormatLinks";
import {Context} from "../waxplorer";
import Link from '../common/util/input/Link';
import cn from 'classnames';

const Drop = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const drop = props['drop'];

    const [claimed, setClaimed] = useState(false);

    let { name } = drop;

    const {author, numClaimed, maxClaimable, verified, category, image, offer, dropId, idata, contract} = drop;

    if (!name) {
        const data = JSON.parse(idata);
        name = Object.keys(data).includes('name') ? data['name'] : null;
    }

    const activeUser = ual['activeUser'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    const [ state, dispatch ] = useContext(Context);

    if (!process.browser && language)
        i18n.changeLanguage(language);

    return (
        <div className={cn(
            'flex flex-col md:flex-row',
            'justify-center items-center',
            'mb-16'
        )}>
            <div className={cn(
                'w-full px-10',
                'flex flex-col items-center',
            )}>
                <img src={image} />
            </div>
            <div className={cn(
                'w-full px-10',
                'flex flex-col items-center',
            )}>
                <div className="text-left text-white mb-8 text-lg-asset font-light">{name}</div>
                <table className="w-full mb-auto mt-auto">
                    <tr>
                        <td className="text-left w-asset-td">ID:</td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter"><Link href={`/drop/${dropId}`}>{dropId}</Link></td>
                    </tr>
                    <tr>
                        <td className="text-left w-asset-td">{t('asset.name')}:</td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter">{name}</td>
                    </tr>
                    <tr>
                        <td className="text-left w-asset-td">{t('profile.collection')}:</td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter">
                            <div className="inline-flex">
                                {verified ? <div className="mr-1" ><img src="/verified.svg" className="w-4 h-4" /></div> : ''}
                                <div>{getAuthorLink(author)}</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left w-asset-td">{t('asset.category')}:</td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter">{category}</td>
                    </tr>
                    <tr>
                        <td className="text-left w-asset-td"><b>{t('asset.bought')}:</b></td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter">{`${numClaimed}/${maxClaimable > 0 ? maxClaimable : ''}`}</td>
                    </tr>
                    <tr>
                        <td className="text-left w-asset-td"><b>{t('asset.price')}:</b></td>
                        <td className="text-right overflow-x-auto leading-5 max-w-filter">{formatNumber(offer)} WAX</td>
                    </tr>
                </table>
                {
                    claimed ? <div className="absolute w-full m-auto block h-auto -top-8">
                        <img src="/check.svg" className="max-h-10 max-w-10 m-auto" />
                    </div> :
                        contract === 'atomicdropsx' ? <a target="_blank" href={`https://wax.atomichub.io/drops/${dropId}`}>{t('asset.view_on', {market:'AtomicHub'})}</a>
                            : <a target="_blank" href={`https://neftyblocks.com/c/${author}/drops/${dropId}`}>{t('asset.view_on', {market:'NeftyBlocks'})}</a>
                }
            </div>
        </div>

    );
};

export default Drop;
