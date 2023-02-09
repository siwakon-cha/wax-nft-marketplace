import React, {useEffect, useState} from 'react';

import {get} from "../../../components/helpers/Api";
import qs from 'qs';
import {useTranslation} from "react-i18next";
import {formatNumber, formatUSD} from "../../../components/helpers/FormatLinks";
import Page from "../../../components/page/Page";
import LoadingIndicator from "../../../components/loadingindicator";
import cn from "classnames";
import AssetImage from "../../../components/asset/AssetImage";
import AssetDetails from "../../../components/asset/AssetDetails";
import SaleDetails from "../../../components/sale/SaleDetails";
import PriceHistory from "../../../components/asset/PriceHistory";
import AssetList from "../../../components/assetlist";
import FullImageView from "../../../components/fullimageview/FullImageView";

const SalePage = (props) => {
    const sale = props.sale;

    const assets = sale.assets;

    const image = assets[0].image;

    const {t, i18n} = useTranslation('common');

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const [showImage, setShowImage] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [displayImage, setDisplayImage] = useState(image);

    useEffect(() => {
        setDisplayImage(image);
    }, [image]);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const toggleImage = () => {
        if (showImage) {
            setDisplayImage(image);
        }
        setShowImage(!showImage);
    };

    const preview = sale.preview ? sale.preview : sale.image ? sale.image : 'https://www.nfthive.io/nfthive-logo.png';

    const title = 'NFTHive.io Sale';
    const description = `Sold for ${formatUSD(sale.usdPrice)} / ${formatNumber(sale.price)} WAX`

    const scrollUp = () => {
        const element = document.getElementById("SalePage");
        element.scrollTo({left: 0, top: 0, behavior: "smooth"});
    };

    const page = (
        <Page
            id="SalePage"
            title={title}
            description={description}
            image={preview}
        >
            {
                isLoading ? <LoadingIndicator/> :
                    <div className={cn(
                        'flex flex-wrap'
                    )}>
                        <AssetImage
                            asset={assets[selectedAsset]}
                            toggleImage={toggleImage}
                            setDisplayImage={setDisplayImage}
                        />
                        <AssetDetails
                            asset={assets[selectedAsset]}
                            assetId={assets[selectedAsset].assetId}

                        />
                        <div className={cn('w-1/2 p-8')}/>
                        <SaleDetails
                            sale={sale}
                        />
                        <PriceHistory assetId={assets[selectedAsset].assetId} />
                    </div>
            }
            { isLoading ? '' : <div className="MoreSales">
                {assets.length > 1 ? <h3>{t('asset.assets_in_sale')}</h3> : '' }
                {assets.length > 1 ? <AssetList bundleView={true} ual={props['ual']} assets={assets} onSale={false} clickAsset={(num) => {scrollUp(); setSelectedAsset(num);} } selectedAsset={assets[selectedAsset].assetId}/> : '' }
            </div> }
        </Page>
    );

    if (showImage) {
        return (
            <div>
                {showImage ? <FullImageView
                    image={displayImage}
                    toggleFunc={toggleImage}
                /> : ''}
                {page}
            </div>
        )
    } else {
        return page;
    }
};

SalePage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const saleId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(
        0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const values = qs.parse(paths[2].replace(`${saleId}?`, ''));

    values['sale'] = await get("sale/" + saleId);

    values['saleId'] = saleId;

    return values;
};

export default SalePage;
