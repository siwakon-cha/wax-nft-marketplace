import React from 'react';
import {useTranslation} from "react-i18next";
import {TelegramIcon, TwitterIcon} from "react-share";
import Link from 'next/link';
import cn from "classnames";

function Footer() {
    const {t, i18n} = useTranslation('common');

    return (
        <div className={cn(
            "Footer"
        )}>
            <div>{t('footer.powered_by')}</div>
            <div><a href="https://eos.barcelona/"><img src="/logo-eosbarcelona.png" /> EOS Barcelona</a></div>
            <div><a href="https://waxsweden.org/">WAX <img src="/logo_sw-eden.png" /></a></div>
            <div><a href="https://cryptolocally.com/en/wax/buy/">{t('footer.buy_wax')}<img src="/cryptolocally-logo.png" /></a></div>
            <div>{t('footer.copyright')} © 2021</div>
            <Link href={'/imprint'}>
                <div className="ImprintLink NextLink">
                    <div>
                        {t('footer.imprint')}
                        <img src="/people-outline.svg" alt="Imprint"/>
                    </div>
                </div>
            </Link>
            <div>{t('footer.version')}: {process.env.version}</div>
            <div className="TelegramLink"><a href="https://t.me/NFTHiveTalk">
                <TelegramIcon
                    bgStyle={{fillOpacity: 0}}
                    iconFillColor="#F6C30D"
                    size="22px"
                />
            </a></div>
            <div className="DiscordLink"><a href="https://discord.gg/y47qvSmaVu">
                <img src={'/discord.svg'} alt={'Discord'} />
            </a></div>
            <div className="TwitterLink"><a href="https://twitter.com/nfthiveio">
                <TwitterIcon
                    bgStyle={{fillOpacity: 0}}
                    iconFillColor="#F6C30D"
                    size="26px"
                />
            </a></div>
        </div>
    );
}

export default Footer;
