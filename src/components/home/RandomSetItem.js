import React, {useEffect, useState} from 'react';

import LoadingIndicator from "../loadingindicator";

import {get} from "../helpers/Api";
import SetPreview from "../explorer/SetPreview";
import {useTranslation} from "react-i18next";

function RandomSetItem() {
    const {t} = useTranslation('common');

    const [set, setSet] = useState(null);

    useEffect(() => {
        get(`set-previews/*?limit=1&offset=${Math.floor(Math.random() * 10)}`, 'set-api').then(
            res => setSet(res[0]));
    }, []);

    return (
        <div>
            <h1>{t('collection.newest_sets')}</h1>
            {set ? <SetPreview key={set.author+'_'+0} set={set} /> : <LoadingIndicator /> }
        </div>
    );
}

export default RandomSetItem;
