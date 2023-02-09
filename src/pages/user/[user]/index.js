import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import cn from "classnames";
import UserComponent from "../../../components/user/UserComponent";
import Page from "../../../components/page/Page";
import qs from 'qs';
import {get} from "../../../components/helpers/Api";
import UserPicture from '../../../components/user/UserPicture';

const UserPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const userName = props['user'];

    const userPicture = props['userPicture'];

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    useEffect(() => {
    }, [userName]);

    const image = userPicture;

    const title = t('links.check_out_asset_name', {asset_name: userName});
    const description = t('links.inspect_asset_on_waxplorer');

    return (
        <Page
            id="AccountPage"
            title={title}
            description={description}
            image={image}
        >
            <h1 className={cn('w-full m-auto')}>{userName}</h1>
            <UserPicture userPicture={userPicture} />
            <div className={cn('w-full h-auto mx-auto text-base')}>
                <UserComponent ual={ual} userName={userName}/>
            </div>
        </Page>
    );
};

UserPage.getInitialProps = async (ctx) => {
    const c = ctx.query.user;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));
    const userPicture = await get("user-picture/" + c);

    values['user'] = c;
    values['userPicture'] = userPicture['image'];

    return values;
};

export default UserPage;
