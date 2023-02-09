import React from 'react';
import {useAsync} from "react-async";
import CountUp from 'react-countup';
import Link from "next/link";

import {get} from "../helpers/Api";
import {useTranslation} from "react-i18next";

const loadQuickStats = async () => {
    return await get(`load-quick-stats`, 'statistics');
};

const QuickStats = (props) => {
    const { data, error, isLoading }  = useAsync({ promiseFn: loadQuickStats });

    const {t} = useTranslation('common');
    
    return (
        <div className="QuickStats">
            <h1>{t('analytics.market_stats_24h')}</h1>
            {isLoading || !data ? ''
                :
                    <Link href={'/stats'}><div className={"QuickStatsContent NextLink"}>
                        <div className={'TopSalePrice'}>
                            <CountUp end={data['numSales']} suffix={` ${t('search.trades')}`} />
                        </div>
                        <div className={'TopSalePrice'}>
                            <CountUp end={data['volume']} suffix={'WAX'} /> /
                            <CountUp end={data['usdVolume']} prefix={'$'} suffix={` ${t('analytics.volume')}`} />
                        </div>
                    </div></Link>
            }
        </div>
    );
};

export default QuickStats;
