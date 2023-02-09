import React, {useState} from 'react';

import {formatNumber, getAssetLink} from "../helpers/FormatLinks";
import moment from 'moment';
import Link from 'next/link';
import {useTranslation} from "react-i18next";

function Notification(props) {
    const type = props['notification']['type'];
    const assetId = props['notification']['assetId'];
    const timestamp = props['notification']['timestamp'];
    const price = props['notification']['price'];
    const image = props['notification']['image'];
    const prevImg = props['notification']['previmg'];
    const read = props['notification']['read'];
    const offerId = props['notification']['offerId'];
    const listingId = props['notification']['listingId'];
    const {t} = useTranslation('common');

    const utc = moment.utc(timestamp).toDate();
    const date = moment(utc).local().format('YYYY-MM-DD HH:mm:ss');

    let notificationText = '';

    let info = '';

    if (type === 'buy') {
        notificationText = t('navigation.your_asset_was_bought');
        info = t('navigation.price');
    } else if (type === 'bid') {
        notificationText = t('navigation.you_received_a_new_bid');
        info = t('asset.bid_noun');
    } else if (type === 'offer') {
        notificationText = t('navigation.you_received_a_new_trade_offer');
        info = t('asset.offer_id');
    }

    const [displayImg, setDisplayImg] = useState(prevImg ? prevImg : image);

    const replaceImage = () => {
        if (displayImg !== image) {
            setDisplayImg(image);
        }
    };

    return (
        <div className="Notification">
            <div className="NotificationMessage">
                {notificationText}
            </div>
            <div className='NotificationAsset'>
                <div className="NotificationImage">
                    {displayImg.includes('video:') ?
                        <video width="60" height="60" loop controls autoPlay={true} muted={true} poster={image ? image : ''}>
                            <source src={`https://ipfs.hivebp.io/ipfs/${displayImg.replace('video:', '')}`} />
                            Your browser does not support the video tag.
                        </video>
                    : <img src={displayImg} onError={replaceImage} /> }
                </div>
                <table>
                    <tbody>
                        {type === 'offer' ? <tr><td>{t('trade.offer_id')}:</td><td><Link className='NextLink' href={
                                '/trade?tab=received-offers'}><div>{offerId}</div></Link></td>
                        </tr> : <tr><td>{t('navigation.asset_id')}:</td><td>
                            {getAssetLink(assetId, null, null, null, listingId ? price : null, listingId)}
                        </td></tr> }
                        <tr><td>{t('navigation.date')}:</td><td>{date}</td></tr>
                        {type === 'offer' ? '' : <tr><td>{info}:</td><td>{formatNumber(price)} WAX</td></tr>}
                    </tbody>
                </table>
                <div className="NotificationInfo">
                    { read ? '' : t('general.new')}
                </div>
            </div>
        </div>
    );
}

export default Notification;
