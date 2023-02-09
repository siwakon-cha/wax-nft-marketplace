import React, {useContext, useEffect, useRef, useState} from 'react';

import {get, post} from "../helpers/Api";
import LoadingIndicator from '../loadingindicator/LoadingIndicator';
import Notification from './Notification'
import {Context} from "../waxplorer";
import {formatNumber} from "../helpers/FormatLinks";
import cn from "classnames";
import {useTranslation} from "react-i18next";


function Notifications(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;
    const [numNewNotifications, setNumNewNotifications] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation('common');

    const [balance, setBalance] = useState(null);

    const processNumNewNotifications = (result) => {
        if (result)
            setNumNewNotifications(result['num']);
    };

    const processNotifications = (result) => {
        setIsLoading(false);
        if (result)
            setNotifications(result);
    };

    const getNumNewNotifications = (user) => {
        if (user) {
            get(`num-new-notifications/${user}`).then(
                processNumNewNotifications
            );
        }
    };

    const [ state, dispatch ] = useContext(Context);

    useEffect(() => {
        if (userName && !state.notificationTimer)
            dispatch({ type: 'SET_NOTIFICATION_TIMER', payload: setInterval(
                () => getNumNewNotifications(userName), 60000) });
    }, [userName]);

    const parseWaxBalance = (res) => {
        if (res && res.status === 200) {
            let wax = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    wax += parseFloat(row['balance'].replace(' WAX', ''))
                });

            setBalance(wax);
        }
    };

    const getWaxBalance = async (name) => {
        const body = {
            'code': 'eosio.token',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1,
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';

        post(url, body).then(res => parseWaxBalance(res));
    };

    useEffect(() => {
    }, [numNewNotifications]);

    useEffect(() => {
        if (!balance)
            getWaxBalance(userName);
    }, [userName]);

    const openNotifications = () => {
        if (userName) {
            setShowNotifications(true);
            setNumNewNotifications(0);
            setIsLoading(true);
            get(`notifications/${userName}`).then(
                processNotifications
            );
        }
    };

    const closeNotifications = () => {
        setShowNotifications(false);
    };

    function useOutsideAlerter(ref, showNotifications, callBack) {
      useEffect(() => {
        function handleClickOutside(event) {
          if (showNotifications && ref.current && !ref.current.contains(event.target) && (!event.target['id'] || !['NotificationsContainer'].includes(event.target['id']))) {
              event.preventDefault();
              event.stopPropagation();
              callBack();
          }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [ref, showNotifications]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, showNotifications, closeNotifications);

    return (
        <div className={state.side_navigation_visible ? "NavigationItem Small" : "NavigationItem"} onClick={openNotifications}>
            <div className={cn(
                'relative flex cursor-pointer',
                {'': numNewNotifications},
                {'opacity-60': !showNotifications},
                {'opacity-100': showNotifications}
            )}>
                <img className={cn('w-6 h-6 my-auto mr-3')} src={ numNewNotifications ? "/notification.svg" : "/notification-none.svg" } alt="Notifications" title={t('navigation.notifications')} />
                { numNewNotifications ?  <div className={cn(
                    'absolute top-4 -left-4 flex justify-center h-5 w-5 bg-paper backdrop-filter backdrop-blur-xl',
                    'border border-primary rounded-xl overflow-x-hidden m-auto leading-4 px-0.5 pt-0.25 pb-0.75',
                    {'text-xs': numNewNotifications >= 10}
                )}>{numNewNotifications}</div> : '' }
            </div>
            <div ref={wrapperRef} className={showNotifications ? "NotificationsContainer show" : "NotificationsContainer" } id={"NotificationsContainer"}>
                {
                    isLoading ? <LoadingIndicator /> : notifications.map(notification =>
                        <Notification
                            key={notification['assetId']+notification['timestamp']}
                            
                            notification={notification}
                        />
                    )
                }
            </div>
            <div className={cn('relative w-full text-neutral')}>
                <div className={cn('text-sm')}>
                    {userName}
                </div>
                {balance &&
                    <div className={cn('text-xs opacity-60')}>
                        {formatNumber(balance)} WAX
                    </div>
                }
            </div>
        </div>
    );
}

export default Notifications;
