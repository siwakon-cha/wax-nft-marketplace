import ShareButton from "../sharebutton/ShareButton";
import React, {useContext} from "react";
import {Context} from "../waxplorer";
import {swapTransaction, stakeSimpleAssets, stakeAtomicAssets} from "../helpers/WaxApi";
import cn from "classnames";
import {useTranslation} from "react-i18next";


function MoreOptions(props) {
    const showMenu = props['showMenu'];
    const asset = props['asset'];
    const {t} = useTranslation('common');
    const rplanet = props['rplanet'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [ state, dispatch ] = useContext(Context);
    const newOwner = props['newOwner'] ? props['newOwner'] : asset['owner'];

    const handleSell = props['handleSell'];
    const handleTransfer = props['handleTransfer'];
    const handleSwap = props['handleSwap'];
    const handleStake = props['handleStake'];
    const staked = props['staked'];
    const transferred = props['transferred'];
    const sold = props['sold'];
    const setSold = props['setSold'];
    const setError = props['setError'];
    const setIsLoading = props['setSold'];

    const {sender, standard, orderId, assetId, offer, author, unpackUrl, category, templateId} = asset;

    const auction = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleSell(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'auction' });
    };

    const transfer = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleTransfer(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'transfer' });
    };

    const stake = async () => {
        let { assetId, aAssetId, standard } = asset;

        setError(null);
        setIsLoading(true);

        let result;
        try {
            switch (standard) {
                case 'simpleassets':
                    result = stakeSimpleAssets(activeUser, [assetId]);
                break;

                case 'atomicassets':
                    result = stakeAtomicAssets(activeUser, [aAssetId]);
                break;
            }
            handleStake(true);
        } catch (e) {
            console.log(e);
            setSold(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const doSwap = async () => {
        const {assetId, aAssetId, standard} = asset;
        setError(null);
        setIsLoading(true);

        const data = {
            from: userName,
            to: 'atomicbridge',
            memo: 'swap'
        };

        if (standard === 'atomicassets')
            data['asset_ids'] = [aAssetId];
        else
            data['assetids'] = [assetId];

        try {
            await swapTransaction(activeUser, standard, data);
            handleSwap(true);
        } catch (e) {
            console.log(e);
            handleSwap(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const tradable = false && newOwner !== userName && standard === 'atomicassets' && !staked && !transferred && !sold &&
        sender !== userName && assetId;

    const stakable = !staked && ((rplanet && rplanet.includes(author) && category !== 'packs' && category !== 'blocks')
            || (author === 'ilovekolobok' && category === 'prize')
            || (author === 'gpk.topps' && standard === 'simpleassets')
            || (author === 'a.rplanet' && category === 'packs')) && ['atomicassets', 'simpleassets'].includes(standard)
    && newOwner === userName;

    const auctionable = standard === 'atomicassets' && newOwner === userName && !sold && assetId;

    const unpackable = unpackUrl && newOwner === userName && assetId;

    const swappable = author === 'gpk.topps' && ['series1', 'series2', 'exotic'].includes(category) && [
        'simpleassets', 'atomicassetes'].includes(standard) && newOwner === userName;

    const transferrable = !sold && !transferred && newOwner === userName && assetId;

    const moreOptionsBtnClassName = cn(
        'flex justify-start w-24 transition delay-200 width',
        'h-4 rounded text-white cursor-pointer outline-none',
        'text-xs font-bold my-2'
    );

    return (
        <div className={cn(
            'absolute h-auto p-2 z-10 w-40 right-0 top-0 flex-wrap',
            'bg-gradient-to-bl from-blue to-brown rounded-2xl',
            {'opacity-100 none z-0 transition delay-200 opacity': showMenu},
            {'opacity-0 block z-10 hidden transition delay-200 opacity': !showMenu},
        )} onMouseLeave={() => {}}>
            {tradable && false ? <a href={`/trade?user=${userName}&partner=${sender}&asset_id=${assetId}&tab=new-trade`}>
                <div className={moreOptionsBtnClassName}>
                    <div className={cn('w-4 h-4 mx-2')}>
                        <img className={cn('w-4 h-4')} src="/trade.svg" alt="trade" />
                    </div>
                    <div>{t('trade.send_offer')}</div>
                </div>
            </a> : ''}
            <ShareButton type={'asset'} link={'https://nfthive.io' + (assetId ? (offer ? '/listing/' : '/asset/') + assetId + (orderId ? `?sale_id=${orderId}` : '') : '/template/' + templateId)} />
            {transferrable ?
            <div className={moreOptionsBtnClassName} onClick={transfer}>
                <div className={cn('w-4 h-4 mx-2')}>
                    <img className={cn('w-4 h-4')} src="/diagonal-arrow-right-up-outline.svg" alt={t('asset.transfer')}/>
                </div>
                <div>{t('asset.transfer')}</div>
            </div> : ''}
            {stakable ?
            <div className={moreOptionsBtnClassName} onClick={stake}>
                <div className={cn('w-4 h-4 mx-2')}>
                    <img className={cn('w-4 h-4')} src="/aether_icon.png" alt={t('asset.stake_to_rplanetio')}/>
                </div>
                <div>{t('asset.stake')}</div>
            </div> : ''}
            {swappable ?
            <div className={moreOptionsBtnClassName} onClick={doSwap}>
                <div className={cn('w-4 h-4 mx-2')}>
                    <img className={cn('w-4 h-4')} src={standard === 'atomicassets' ? '/simpleassets.svg' : '/atomic.png'} alt={t('profile.swap')}/>
                </div>
                <div>{t('profile.swap')}</div>
            </div> : ''}
            {auctionable ?
            <div className={moreOptionsBtnClassName} onClick={auction}>
                <div className={cn('w-4 h-4 mx-2')}>
                    <img className={cn('w-4 h-4')} src="/pricetags-outline.svg" alt={t('popups.auction')} />
                </div>
                <div>{t('popups.auction')}</div>
            </div> : ''}
            {unpackable ?
            <a target="_blank" href={unpackUrl}>
                <div className={moreOptionsBtnClassName}>
                    <div className={cn('w-4 h-4 mx-2')}>
                        <img className={cn('w-4 h-4')} src={'/cube-outline.svg'} alt={t('asset.unpack')}/>
                    </div>
                    <div>{t('asset.unpack')}</div>
                </div>
            </a> : '' }
        </div>
    );
}

export default MoreOptions;
