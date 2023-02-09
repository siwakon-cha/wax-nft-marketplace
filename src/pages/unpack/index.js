import React, {useEffect, useState} from 'react';

import qs from 'qs';
import {setQueryStringWithoutPageReload} from "../../components/helpers/FormatLinks";
import Page from "../../components/page/Page";
import Content from "../../components/common/layout/Content";
import {Tab, Tabs} from "react-bootstrap";
import cn from "classnames";
import TabItem from "../../components/tabitem/TabItem";
import MyPacksList from "../../components/packs/MyPacksList";
import UnclaimedPacksList from "../../components/packs/UnclaimedPacksList";

const UnpackPage = (props) => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));

    const keys = ['mypacks', 'unclaimed'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'] && ual['activeUser']['accountName'];
    const loggedOut = activeUser === null;

    const [tabKey, setTabKey] = useState(process.browser ? (
        values['tab'] && keys.includes(values['tab']) ? values['tab'] : 'mypacks'
    ) : (props.tab && keys.includes(props.tab) ? props.tab : 'mypacks'));

    const initTabs = async(key, user, loggedOut, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values;

            delete query['order_dir'];
            delete query['search_type'];
            delete query['order_by'];
            query['tab'] = key;
            if (user)
                query['user'] = user;
            else
                delete query['user'];
            delete query['offer_type'];

            if (!initial)
                setQueryStringWithoutPageReload(qs.stringify(query));
            setTabKey(key);
        }
    };

    useEffect(() => {
        initTabs(tabKey, activeUser, loggedOut, true);
    }, [tabKey, activeUser, loggedOut]);

    const login = () => {

    };

    return (
        <Page
            id={"UnpackPage"}
            title={'NFTHive.io Unpack'}
            description={'Unpack your WAX Packs on NFTHive.io'}
        >
            <Content headline="Packs">
                <div className="container mx-auto">
                    {loggedOut ? <div onClick={login}>
                        Login
                    </div> : <Tabs
                        className={cn(
                            'border-tabs',
                            'flex h-12 my-10 rounded-md',
                            'text-sm lg:text-base text-neutral',
                            'border border-paper'
                        )}
                        defaultActiveKey={tabKey}
                        id="collection-switch"
                        onSelect={(k) => initTabs(k)}
                    >
                        <Tab
                            eventKey="mypacks"
                            title={
                                <TabItem target={'mypacks'} tabKey={tabKey} title={'My Packs'} />
                            }
                        >
                            {tabKey === 'mypacks' &&
                            <MyPacksList user={activeUser} {...props} />
                            }
                        </Tab>
                        <Tab
                            eventKey="unclaimed"
                            title={
                                <TabItem
                                    user={activeUser}
                                    target={'unclaimed'}
                                    tabKey={tabKey}
                                    title={'Unclaimed Packs'}
                                />
                            }
                        >
                            {
                                tabKey === 'unclaimed' &&
                                    <UnclaimedPacksList user={activeUser} {...props} />
                            }
                        </Tab>
                    </Tabs>}
                </div>
            </Content>
        </Page>
    );
};

UnpackPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace( '?', ''));
};

export default UnpackPage;
