import React, {createContext, useReducer} from 'react';
import Reducer from '../reducer';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import common_en from "../../translations/en/common";
import common_de from "../../translations/de/common";
import common_zh from "../../translations/zh/common";
import common_jp from "../../translations/jp/common";
import common_zh_hk from "../../translations/zh-hk/common";
import common_ko from "../../translations/ko/common";
import common_es from "../../translations/es/common";
import {getCookie, setCookie} from "../../components/helpers/cookies";
import qs from 'qs';

const initialState = {
    asset: null,
    sellPrice: null,
    action: null,
    callBack: null,
    error: null,
    switchedTab: true,
    scrolledDown: false,
    show_banner: true
};

let language = 'en';

if (process.browser) {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length -1));
    language = values['lang'] ? values['lang'] : null;

    if (language)
        setCookie('language', language);
    else {
        const cookie = getCookie('language');
        if (cookie)
            language = cookie;
    }
}

i18next.init({
    interpolation: { escapeValue: false },
    lng: language ? language : 'en',
    resources: {
        en: {
            common: common_en
        },
        de: {
            common: common_de
        },
        es: {
            common: common_es
        },
        jp: {
            common: common_jp
        },
        zh: {
            common: common_zh
        },
        zh_hk: {
            common: common_zh_hk
        },
        ko: {
            common: common_ko
        },
    },
});

const Waxplorer = ({children})  => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            <I18nextProvider i18n={i18next}>
                {children}
            </I18nextProvider>
        </Context.Provider>
    );
};

export const Context = createContext(initialState);
export default Waxplorer;
