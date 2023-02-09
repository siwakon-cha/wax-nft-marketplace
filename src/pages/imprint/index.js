import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import Page from "../../components/page/Page";
import cn from "classnames";

const ImprintPage = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'];

    const userName = activeUser ? activeUser['accountName'] : null;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    useEffect(() => {
    }, [userName]);

    const pageTitle = t('navigation.home');
    const title = `${pageTitle} on NFTHive.io`;
    const description = t('links.explore_and_trade_nfts_on_the_wax_blockchain');

    return (
        <Page
            id="ImprintPage"
            description={description}
            title={title}
        >
            <div className={cn(
                'h-full w-full my-auto text-base'
            )}>
                <div className={cn(
                    'text-white m-auto w-1/2 block text-left justify-center'
                )}>
                    <h3>{t('footer.imprint')}</h3>
                    <div>Hive Digital UG</div>
                    <div>Schröderhof 6</div>
                    <div>21335 Lüneburg</div>
                    <div>Germany</div>
                    <br/>
                    <div>E-Mail: <a className='text-bluel' href="mailto:ben@hivebp.io">ben@hivebp.io</a> / <a className='text-bluel' href="mailto:nils@hivebp.io">nils@hivebp.io</a></div>
                    <div>Website: <a className='text-bluel' href="https://hivebp.io">https://hivebp.io</a></div>
                </div>
            </div>
        </Page>
    );
};

export default ImprintPage;
