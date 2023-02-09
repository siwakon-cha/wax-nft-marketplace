import React, {useEffect} from 'react';

import {useTranslation} from "react-i18next";

import FixedSearchComponent from "../searchitems/FixedSearchComponent";
import AssetListHeader from "../common/util/AssetListHeader";
import Link from 'next/link';
import UserStats from "./UserStats";
import TradeGraph from "./TradeGraph";
import TradeHistory from "./TradeHistory";
import LoadingIndicator from "../loadingindicator";
import UserSetList from "./UserSetList";
import cn from "classnames";

const UserComponent = (props) => {
    const userName = props['userName'];
    const ual = props['ual'];

    const {t} = useTranslation('common');

    useEffect(() => {
    }, [userName]);

    const bgBlue = cn('pt-12 bg-bluet2 h-auto');

    return !userName ? <LoadingIndicator/> : (
        <div className={cn('w-full')}>
            <AssetListHeader>
                {t('general.stats')}
            </AssetListHeader>
            <UserStats userName={userName} />
            <AssetListHeader>
                {t('collection.sets')}
            </AssetListHeader>
            <UserSetList userName={userName}/>
            <Link href={`/market?owner=${userName}&order_by=date_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.latest_listings')}
                    </AssetListHeader>
                </div>
            </Link>
            <FixedSearchComponent
                {...props}
                className={bgBlue}
                searchSettings={{
                    'search_type': {value: 'sales'},
                    'owner': {value: userName, fixed: true},
                    'order_by': {value: 'date_desc'},
                    'limit': {value: 10, fixed: true}
                }}
                userName={userName}
            />
            <Link href={`/explorer?tab=assets&owner=${userName}&order_by=date_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('collection.newest_assets')}
                    </AssetListHeader>
                </div>
            </Link>
            <FixedSearchComponent
                {...props}
                className={bgBlue}
                searchSettings={{
                    'search_type': {value: 'assets'},
                    'owner': {value: userName, fixed: true},
                    'order_by': {value: 'date_desc'},
                    'limit': {value: 10, fixed: true}
                }}
                userName={userName}
            />
            <Link href={`/explorer?tab=assets&owner=${userName}&order_by=offer_desc`}>
                <div>
                    <AssetListHeader classNames='NextLink' imgSrc='/frontpage/SVG/lupe.svg'>
                        {t('profile.top_assets')}
                    </AssetListHeader>
                </div>
            </Link>
            <FixedSearchComponent
                {...props}
                className={bgBlue}
                searchSettings={{
                    'search_type': {value: 'assets'},
                    'owner': {value: userName, fixed: true},
                    'order_by': {value: 'offer_asc'},
                    'limit': {value: 10, fixed: true}
                }}
                userName={userName}
            />
            <AssetListHeader>
                {t('analytics.trading_history_graph')}
            </AssetListHeader>
            <TradeGraph userName={userName}/>
            <AssetListHeader>
                {t('analytics.trading_history')}
            </AssetListHeader>
            <TradeHistory ual={ual} user={userName}/>
        </div>
    );
};

export default UserComponent;
