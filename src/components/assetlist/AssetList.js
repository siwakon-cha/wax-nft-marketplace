import React from 'react';

import AssetPreview from "../assetpreview/AssetPreview";
import LoadingIndicator from "../loadingindicator";
import {useQuery} from "react-query";
import {get} from "../helpers/Api";
import TemplatePreview from "../assetpreview/TemplatePreview";
import cn from "classnames";


function AssetList(props) {
    const assets = props['assets'];
    const onSale = props['onSale'];
    const name = props['name'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const type = props['type'];
    const search = props['search'];
    const clickAsset = props['clickAsset'];
    const selectedAsset = props['selectedAsset'];
    const isLoading = props['isLoading'];
    const onAdd = props['onAdd'];
    const id = props['id'];
    const selectedAssets = props['selectedAssets'];
    const bundleView = props['bundleView'];

    const { data } = useQuery(`get-rplanet-authors`, () => get(`get-rplanet-authors`));

    return (
        isLoading ? <LoadingIndicator/> :
        <div className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 justify-between text-center',
            'mx-4'
        )} id={id ? id : ''}>
            {
                search === 'templates' ? assets.map((template, index) => <TemplatePreview index={index} key={name+'_'+index} template={template} ual={ual} />) : assets.filter(asset => !selectedAssets || !selectedAssets.includes(asset.assetId.toString())).map((asset, index) => onSale ? <AssetPreview bundleView={bundleView} rplanet={data} index={index} onAdd={onAdd} type={type} key={name+'_'+index} asset={asset} ual={ual} /> : <div onClick={() => clickAsset(index)}><AssetPreview bundleView={bundleView} index={index} onAdd={onAdd} type={type} key={name+'_'+index} asset={asset} ual={ual} selectedAsset={selectedAsset} /></div>)
            }
        </div>
    );
}

export default AssetList;
