import React, {useContext, useEffect, useRef, useState} from 'react';

import { Context } from "../waxplorer";
import {useTranslation} from "react-i18next";

import SearchPopup from "./SearchPopup";
import cn from "classnames";

function PopupWrapperSearch(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const {t, i18n} = useTranslation('common');

    const [ state, dispatch ] = useContext(Context);

    const asset = state.searchAsset;
    const searchType = state.searchType;
    const actionSearch = state.actionSearch;
    const searchId = state.searchId;
    const callBack = state.callBack;

    const [ element, setElement ] = useState(null);

    function OutsideAlerter({callBack, searchId, children}) {
        const handleClickOutside = (event) => {
            if (searchId && event && event.target && event.target.id === 'OutsideAlerter') {
                dispatch({ type: 'SET_ACTION', payload: '' });
                callBack();
                event.preventDefault();
                event.stopPropagation();
            }
        }

        useEffect(() => {
        }, [searchId]);

        return searchId ? <div id={'OutsideAlerter'} className={cn(
            'absolute w-screen h-screen bg-transparent',
            'z-100 backdrop-filter backdrop-blur-sm'
        )} onClick={handleClickOutside} >{children}</div> : '';
    }

    useEffect(() => {
        if (searchId) {
            setElement(
                <div className="PopupWrapper">
                    <OutsideAlerter
                        callBack={() => {
                            dispatch({type: 'SET_ACTION_SEARCH', payload: ''})
                        }}
                        searchId={searchId}
                    >
                        <SearchPopup
                            
                            asset={asset}
                            searchId={searchId}
                            searchType={searchType}
                            ual={ual}
                            callBack={(no) => {
                                dispatch({type: 'SET_ACTION_SEARCH', payload: ''});
                            }}
                            closeCallBack={() => {
                                callBack();
                                dispatch({type: 'SET_ACTION_SEARCH', payload: ''});
                            }}
                        />
                    </OutsideAlerter>
                </div>
            );
        }
    }, [searchId]);

    return (
        <div className="PopupWrapper">
            {actionSearch === 'search' ? element : ''}
        </div>
    );
}

export default PopupWrapperSearch;
