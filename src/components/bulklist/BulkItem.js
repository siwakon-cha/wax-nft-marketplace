import cn from "classnames";
import ErrorMessage from "../popups/ErrorMessage";
import {formatNumber, formatNumberS, formatRateNumber} from "../helpers/FormatLinks";
import React from "react";
import BulkItemBox from "./BulkItemBox";
import {useTranslation} from "react-i18next";

const BulkItem = ({asset, index, sellPrices, errorAssets, transactions, dismissError, searchSearch, transferItems,
                   distributeItems, changeReceivers, changePrice, checkItem, checkBundleItem}) => {
    const {
        mint, offer, author, rarity, aAssetId, average, backimg, lowest, image, standard,
        assetId, last_sold, num_sales, verified, mdata, aether_value, upliftium, authorImg,
        authorThumbnail, thumbnail
    } = asset;

    const sellActions = ['bulk_edit', 'bulk_sell', 'bulk_sell_dupes', 'bulk_sell_highest_duplicates'];

    const {t} = useTranslation('common');

    let video = '';
    const assetData = mdata ? JSON.parse(mdata) : null;
    if (assetData && Object.keys(assetData).includes('video')) {
        video = assetData['video'].includes('http') ?
            assetData['video'] :
            `https://ipfs.hivebp.io/ipfs/${assetData['video']}`;
    }

    if (thumbnail && thumbnail.includes('.mp4')) {
        video = thumbnail
    }

    const localId = asset.standard === 'atomicassets' ? aAssetId : assetId;

    const transactionId = transactions[localId];

    return (
        <div className={cn(
            'relative flex flex-wrap justify-evenly py-3 rounded w-full bg-paper mb-1',
            {'': sellPrices[localId]}
        )} key={localId}>
            {Object.keys(errorAssets).includes(''+localId) ?
                <div onClick={() => dismissError(localId)} className="BulkError">
                    <ErrorMessage layer={3} error = {errorAssets[''+localId]} />
                </div> : '' }
            <BulkItemBox contentHeight={'h-28'} titleHeight={'h-0'}>
                <div className={'flex h-28 w-full'}>{video ?
                    <video
                        className={'m-auto'}
                        width="70" height="70"
                        loop autoPlay={true}
                        muted={true}
                        playsInline={true}
                           poster={image && !image.includes('video:') ? image : backimg}>
                        <source src={video}/>
                        Your browser does not support the video tag.
                    </video> : <img className={'h-full m-auto'} src={thumbnail ? thumbnail : image}/> }
                </div>
            </BulkItemBox>
            <BulkItemBox title={t('asset.name')}>
                <div className={cn(
                    'text-sm md:text-md'
                )}>{asset.name}</div>
            </BulkItemBox>
            <BulkItemBox title={t('asset.mint')}>
                {mint ? `${'#'}${mint}` : ''}
            </BulkItemBox>
            <BulkItemBox title={'Collection'} titleHeight={'h-8'} contentHeight={'h-20'}>
                <div>
                    <a target="_blank" href={'/market?searchType=sales&order_by=offer_asc&collection=' + author}>
                        <div className={cn('flex flex-wrap')}>
                            {authorImg ? <div className={cn('flex w-10 h-10 m-auto p-1')}>
                                <img className={'m-auto'} src={authorThumbnail ? authorThumbnail : authorImg} />
                            </div> : '' }
                            <div className={cn('w-full flex justify-center')}>
                                <div className={cn(
                                    'text-sm'
                                )}>{author}</div>
                                {verified ? <div className={cn('h-5 w-5')}>
                                    <img className={'m-auto'} src="/verified.svg" />
                                </div> : ''}
                            </div>
                        </div>
                    </a>
                </div>
            </BulkItemBox>
            <BulkItemBox title={t('asset.rarity')}>
                <a target="_blank" href={
                    `/market?searchType=sales&order_by=offer_asc&collection=${author}&rarity=${rarity}`
                }>{rarity}</a>
            </BulkItemBox>
            {
                transactionId ? <div className={cn(
                    'flex w-1/12'
                )}>
                    <div className={cn('w-10 h-10 m-auto')}>
                        <img src="/check.svg"/>
                    </div>
                </div> : ''
            }
            {
                transactionId ?
                    <div className={cn(
                        'm-auto w-3/5 lg:w-2/5 text-center break-words'
                    )}>
                        <a className={cn(
                            'text-neutral ml-auto no-underline text-xs'
                        )} target="_blank" rel="noopener noreferrer" href={
                            "https://wax.bloks.io/transaction/" + transactionId}>tx: {transactionId}</a>
                    </div> : ''
            }
            {![
                'bulk_transfer_duplicates', 'bulk_transfer_lowest_mints', 'bulk_unstake', 'bulk_stake'
            ].includes(searchSearch) && !transactionId ?
                <BulkItemBox title={t('asset.num_sales')}>
                    {num_sales ? num_sales : ''}
                </BulkItemBox> : ''
            }
            {![
                'bulk_burn', 'bulk_distribute', 'bulk_transfer', 'bulk_transfer_duplicates',
                'bulk_transfer_lowest_mints', 'bulk_unstake', 'bulk_stake'
            ].includes(searchSearch) && !transactionId ?
                <BulkItemBox title={t('asset.average_sold')}>
                    {average ? `${formatNumber(average)} WAX` : '' }
                </BulkItemBox> : ''
            }
            {![
                'bulk_burn', 'bulk_distribute', 'bulk_transfer', 'bulk_transfer_duplicates',
                'bulk_transfer_lowest_mints', 'bulk_unstake', 'bulk_stake'
            ].includes(searchSearch) && !transactionId ?
                <BulkItemBox title={t('search.market')}>
                    { lowest ? `${formatNumber(lowest)} WAX` : ''}
                </BulkItemBox> : ''
            }
            {!['bulk_distribute', 'bulk_transfer_lowest_mints', 'bulk_unstake', 'bulk_stake'].includes(
                searchSearch) && !transactionId ?
                <BulkItemBox title={t('asset.last_sold')}>
                    { last_sold ? `${formatNumber(last_sold)} WAX` : '' }
                </BulkItemBox> : ''
            }
            {['bulk_buy', 'bulk_cancel'].includes(searchSearch) ?
                <BulkItemBox title={t('asset.price')}>
                    {offer ? `${formatNumber(offer)} WAX` : ''}
                </BulkItemBox> : ''
            }
            {
                aether_value && (['bulk_buy', 'bulk_stake', 'bulk_unstake'].includes(
                    searchSearch) || sellActions.includes(searchSearch)) ?
                    <BulkItemBox title={'Aether / h'}>
                        { aether_value ?
                                <div className={cn(
                                    'flex text-sm h-5 justify-center'
                                )}>
                                    {`${formatNumberS(aether_value / 10000.0)}`}
                                    <img src={'/aether_icon.png'} />
                                </div> : ''
                        }
                    </BulkItemBox> : ''
            }
            {
                upliftium && (['bulk_buy', 'bulk_stake', 'bulk_unstake'].includes(searchSearch) || sellActions.includes(
                    searchSearch)) ?
                    <BulkItemBox title={'Upliftium / h'}>
                        {upliftium ?
                            <div className="AetherValue">
                                {`${formatRateNumber(upliftium)}`}
                                <img src={'/upliftium.png'} />
                            </div> : ''}
                    </BulkItemBox> : ''
            }
            {![
                'bulk_transfer', 'bulk_buy', 'bulk_cancel', 'bulk_transfer_duplicates', 'bulk_transfer_lowest_mints',
                'bulk_bundle', 'bulk_bundle_lowest_mints', 'bulk_bundle_highest_mints', 'bulk_bundle_highest_duplicates',
                'bulk_burn', 'bulk_stake', 'bulk_unstake'
            ].includes(searchSearch) && !transactionId ?
                <BulkItemBox title={searchSearch === 'bulk_distribute' ? t('asset.receiver') : t('search.price')}>
                    <input
                        className={cn(
                            'border-b-2 border-primary bg-transparent text-primary w-full'
                        )}
                        tabIndex={index + 1}
                        placeholder={
                            searchSearch === 'bulk_edit' ?
                                offer : searchSearch === 'bulk_distribute'
                                    ? t('asset.receiver') : ('WAX')
                        }
                        type="text"
                        id={'sell-'+(localId)}
                        onChange={searchSearch === 'bulk_distribute' ? changeReceivers : changePrice}
                        value={searchSearch === 'bulk_distribute' ? (
                            distributeItems[localId] ? distributeItems[localId].receiver : ''
                        ) : (sellPrices[localId] ? sellPrices[localId].price : '') }
                    />
                    { searchSearch !== 'bulk_distribute' ?
                        <div className={cn(
                            'relative text-xs opacity-60 top-2 mx-auto text-center'
                        )}>
                            {asset.price ? `Bought for: ${formatNumber(asset.price)} WAX / $${
                                formatNumber(asset.usd_price)}` : ''}
                        </div> : ''
                    }
                </BulkItemBox> : (
                    transactionId ? '' :
                        <div className={cn('flex justify-center w-1/5 my-auto mx-2')} >
                            {
                                Object.keys(transferItems).includes(
                                    standard === 'atomicassets' ? ''+aAssetId : ''+assetId) ?
                                    <div className={cn(
                                        'relative flex justify-center t-4 h-8 w-8'
                                    )}>
                                        <img src="/check.svg" />
                                    </div>
                                    : <button className="BuyButton" onClick={
                                        ['bulk_transfer', 'bulk_distribute', 'bulk_transfer_duplicates',
                                         'bulk_transfer_lowest_mints', 'bulk_buy', 'bulk_cancel', 'bulk_stake',
                                         'bulk_unstake'].includes(searchSearch) ?
                                            () => checkItem(localId) :
                                            () => checkBundleItem(localId)
                                    }>
                                        {t('trade.add')}
                                    </button>
                            }
                        </div>
                )}
        </div>
    );
}

export default BulkItem;