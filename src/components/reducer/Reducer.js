const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ASSET':
            return {
                ...state,
                asset: action.payload
            };
        case 'SET_SEARCH_ASSET':
            return {
                ...state,
                searchAsset: action.payload
            };
        case 'SET_NOTIFICATION_TIMER':
            return {
                ...state,
                notificationTimer: action.payload
            };
        case 'SET_ASSETS':
            return {
                ...state,
                assets: action.payload
            };
        case 'SET_LINK':
            return {
                ...state,
                link: action.payload
            };
        case 'SET_BACKGROUND_IMAGE':
            return {
                ...state,
                background_image: action.payload
            };
        case 'SET_RECEIVER':
            return {
                ...state,
                receiver: action.payload
            };
        case 'SIDE_NAVIGATION_VISIBLE':
            return {
                ...state,
                side_navigation_visible: action.payload
            };
        case 'SHOW_BANNER':
            return {
                ...state,
                show_banner: action.payload
            };
        case 'SET_ACTION':
            return {
                ...state,
                action: action.payload
            };
        case 'SET_ACTION_SEARCH':
            return {
                ...state,
                actionSearch: action.payload
            };
        case 'SET_EDIT_DESCRIPTION':
            return {
                ...state,
                editDescription: action.payload
            };
        case 'SET_EDIT_NAME':
            return {
                ...state,
                editName: action.payload
            };
        case 'SET_EDIT_DISPLAY_NAME':
            return {
                ...state,
                editDisplayName: action.payload
            };
        case 'SET_EDIT_URL':
            return {
                ...state,
                editUrl: action.payload
            };
        case 'SET_EDIT_MARKET_FEE':
            return {
                ...state,
                editMarketFee: action.payload
            };
        case 'SET_EDIT_IMAGE':
            return {
                ...state,
                editImage: action.payload
            };
        case 'SET_EDIT_NEW':
            return {
                ...state,
                newCollection: action.payload
            };
        case 'SET_SEARCH_ID':
            return {
                ...state,
                searchId: action.payload
            };
        case 'SET_WAX_BALANCE':
            return {
                ...state,
                wax_balance: action.payload
            };
        case 'SET_OFFER_ID':
            return {
                ...state,
                offerId: action.payload
            };
        case 'SET_TRADE_OPTION':
            return {
                ...state,
                tradeOption: action.payload
            };
        case 'SET_SEARCH_TYPE':
            return {
                ...state,
                searchType: action.payload
            };
        case 'SET_COLLECTION':
            return {
                ...state,
                searchAuthor: action.payload
            };
        case 'SET_COLLECTION_NAME':
            return {
                ...state,
                collectionName: action.payload
            };
        case 'SET_IMAGE':
            return {
                ...state,
                image: action.payload
            };
        case 'SET_VERIFIED':
            return {
                ...state,
                searchVerified: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'SET_LAST_SHOWN_SET':
            return {
                ...state,
                lastShownSet: action.payload
            };
        case 'SET_SCROLLED_DOWN':
            return {
                ...state,
                scrolledDown: action.payload
            };
        case 'SET_SEARCH_TRIGGERED':
            return {
                ...state,
                searchTriggered: action.payload
            };
        case 'SET_LAST_SEARCH_PATH':
            return {
                ...state,
                last_search_path: action.payload
            };
        case 'SET_LAST_SEARCH_RESULT':
            return {
                ...state,
                last_search_result: action.payload
            };
        case 'SET_SWITCHED_TAB':
            return {
                ...state,
                switchedTab: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_CALLBACK':
            return {
                ...state,
                callBack: action.payload
            };
        case 'SET_SET_CATEGORIES':
            return {
                ...state,
                setCategories: action.payload
            };
        case 'SET_DROP':
            return {
                ...state,
                drop: action.payload
            };
        case 'SET_SELLPRICE':
            return {
                ...state,
                sellPrice: action.payload
            };
        case 'SET_TUBE_ID':
            return {
                ...state,
                tubeId: action.payload
            };
        case 'SET_LOWEST_MINTS':
            return {
                ...state,
                lowestMints: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;
