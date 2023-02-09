import React from 'react';
import Link from "next/link";
import {useTranslation} from "react-i18next";

const HiveConstruct = (props) => {
    const { images } = props;

    const {t} = useTranslation('common');

    return (
        <div className="HiveConstruct">
            <div className={"ImageRow"}>
            {images.slice(0, 5).map((image, index) =>
                <div className={`HiveImage${index}`}><Link href={`/collection/${image['collection']}`}><img className={"NextLink"} src={image['image']} /></Link></div>
            )}
            </div>
            <div className={"FrontpageLinks"}>
                <Link href={"/market"}><div className={"FrontpageButton NextLink"}>
                    <img className={"ButtonIcon Right"} src={"/frontpage/SVG/wabe_icon.svg"} />
                    <img className={"ButtonIcon Right Inner"}  src={"/shopping-cart-outline.svg"} />
                    <div>{t('search.market')}</div>
                </div></Link>
                <Link href={"/explorer"}><div className={"FrontpageButton NextLink"}>
                    <img className={"ButtonIcon Left"} src={"/frontpage/SVG/wabe_icon.svg"} />
                    <img className={"ButtonIcon Left Inner"} src={"/details.svg"} />
                    <div>{t('navigation.explorer')}</div>
                </div></Link>
            </div>
            <div className={"ImageRow"}>
            {images.slice(5, 10).map((image, index) =>
                <div className={`HiveImage${index}`}><Link href={`/collection/${image['collection']}`}><img className={"NextLink"} src={image['image']} /></Link></div>
            )}
            </div>
        </div>
    );
};

export default HiveConstruct;
