import LoadingIndicator from "../../components/loadingindicator";
import {useEffect, useState} from "react";
import get from "../../components/helpers/Api";
import cn from "classnames";
import SetsOverviewItem from "../../components/sets/SetsOverviewItem";
import qs from 'qs';
import Page from "../../components/page/Page";

const SetsOverviewPage = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const account = values['account'];

    const [sets, setSets] = useState(null);
    const [userSets, setUserSets] = useState(null);

    const parseSets = (res) => {
        setSets(res);
    };

    const parseUserSets = (res) => {
        setUserSets(res);
    };

    const getSets = async (account) => {
        if (account)
            await get(`sets-overview/${account}`, 'set-api').then(parseUserSets);
        else
            await get('sets-overview', 'set-api').then(parseSets);
    };

    useEffect(() => {
        getSets(account);
    }, [account]);

    return (
        <Page
            id={"SetsPage"}
            title={'Sets Overview on NFTHive.io'}
            description={'Check out these Sets on NFTHive.io'}
        >
            <div className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 m-auto'
            )}>
                {
                    userSets ? userSets.filter(set => set.started).map(set =>
                        <SetsOverviewItem
                            account={account}
                            set={set}
                        />
                    ) : sets ? sets.map(
                        set => <SetsOverviewItem
                            account={account}
                            set={set}
                        />
                    ) : <LoadingIndicator />
                }
            </div>
        </Page>
    );
};

export default SetsOverviewPage;
