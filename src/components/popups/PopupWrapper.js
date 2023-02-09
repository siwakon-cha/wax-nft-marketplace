import React, {useContext, useEffect, useRef} from 'react';

import SellPopup from "./SellPopup";
import BulkSellPopup from "./BulkSellPopup";
import BulkEditPopup from "./BulkEditPopup";
import BidPopup from "./BidPopup";
import BuyPopup from "./BuyPopup";
import { Context } from "../waxplorer";
import {useTranslation} from "react-i18next";
import BulkTransferPopup from "./BulkTransferPopup";
import BundlePopup from "./BundlePopup";
import CollectionPopup from "./CollectionPopup";
import SharePopup from "./SharePopup";
import BulkBurnPopup from "./BulkBurnPopup";
import BulkStakePopup from "./BulkStakePopup";
import BulkUnstakePopup from "./BulkUnstakePopup";
import TransferPopup from "./TransferPopup";
import AuctionPopup from "./AuctionPopup";
import BulkCancelPopup from "./BulkCancelPopup";
import TransferWaxPopup from "./TransferWaxPopup";
import TradePopup from "./TradePopup";
import HandleTradePopup from "./HandleTradePopup";
import BulkBuyPopup from "./BulkBuyPopup";
import TubePopup from "./TubePopup";
import ClaimDropPopup from "./ClaimDropPopup";
import BulkDistributePopup from "./BulkDistributePopup";
import EditCollectionPopup from "./EditCollectionPopup";
import BuyMissingPopup from "./BuyMissingPopup";
import cn from "classnames";
import SetItemPopup from "./SetItemPopup";

function PopupWrapper(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const {t, i18n} = useTranslation('common');

    const [ state, dispatch ] = useContext(Context);

    const asset = state.asset;

    const drop = state.drop;
    const link = state.link;
    const sellPrice = state.sellPrice;
    const action = state.action;
    const callBack = state.callBack;
    const assets = state.assets;
    const receiver = state.receiver ? state.receiver.trim().toLowerCase() : '';
    const wax_balance = state.wax_balance;
    const offerId = state.offerId;
    const tradeOption = state.tradeOption;
    const tubeId = state.tubeId;
    const lowestMints = state.lowestMints;

    const editDescription = state.editDescription;
    const editName = state.editName;
    const editDisplayName = state.editDisplayName;
    const editUrl = state.editUrl;
    const editMarketFee = state.editMarketFee;
    const editImage = state.editImage;
    const newCollection = state.newCollection;

    const collectionName = state.collectionName;
    const image = state.image;

    function useOutsideAlerter(ref, callBack, action) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            const handleClickOutside = (event) => {
                if (action && ref.current && !ref.current.contains(event.target)) {
                    dispatch({ type: 'SET_ACTION', payload: '' });
                    callBack();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", (event) => handleClickOutside(event));
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [action]);
    }

    function OutsideAlerter(props) {
        const callBack = props['callBack'];
        const action = props['action'];

        const handleClickOutside = (event) => {
            if (action && event && event.target && event.target.id === 'OutsideAlerter') {
                dispatch({ type: 'SET_ACTION', payload: '' });
                callBack();
                event.preventDefault();
                event.stopPropagation();
            }
        }

        return action ? <div id={'OutsideAlerter'} className={cn(
            'absolute w-screen h-screen bg-transparent',
            'z-100 backdrop-filter backdrop-blur-sm'
        )} onClick={handleClickOutside}>{props.children}</div> : '';
    }

    const sellElement =
        <SellPopup
            
            asset={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={(wasSold, e=null, asset_id=null) => {
                callBack(wasSold);
                if (e) {
                    dispatch({ type: 'SET_ERROR', payload: {
                            error: e,
                            asset_id: asset_id
                    }});
                }
            }}
            offer={sellPrice}
        />;

    const auctionElement =
        <AuctionPopup
            
            asset={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={(wasSold, e=null, asset_id=null) => {
                callBack(wasSold);
                if (e) {
                    dispatch({ type: 'SET_ERROR', payload: {
                            error: e,
                            asset_id: asset_id
                    }});
                }
            }}
            offer={sellPrice}
        />;

    const bulkSellElement =
                <BulkSellPopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(sold) => {
                        callBack(sold);
                    }}
                    offer={sellPrice}
                />;

    const bulkDistributeElement =
                <BulkDistributePopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(distributed) => {
                        callBack(distributed);
                    }}
                />;

    const bulkBuyElement =
                <BulkBuyPopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(sold) => {
                        callBack(sold);
                    }}
                    offer={sellPrice}
                />;

    const bulkEditElement =
                <BulkEditPopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(sold) => {
                        callBack(sold);
                    }}
                    offer={sellPrice}
                />;

    const bulkTransferElement =
                <BulkTransferPopup
                    
                    assets={assets}
                    receiver={receiver}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_RECEIVER', payload: '' });
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        dispatch({ type: 'SET_RECEIVER', payload: '' });
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                    offer={sellPrice}
                />;

    const bulkCancelElement =
                <BulkCancelPopup
                    
                    assets={assets}
                    receiver={receiver}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                        }
                    }}
                    offer={sellPrice}
                />;

    const bulkBurnElement =
                <BulkBurnPopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const bulkStakeElement =
                <BulkStakePopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const bulkUnstakeElement =
                <BulkUnstakePopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const bundleElement =
                <BundlePopup
                    
                    assets={assets}
                    receiver={receiver}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasSold, e=null, asset_id=null) => {
                        callBack(wasSold);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                    offer={sellPrice}
                />;

    const bidElement =
                <BidPopup
                    
                    asset={asset}
                    ual={ual}
                    callBack={(placed) => {
                        callBack(placed);
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    offer={sellPrice}
                />;

    const buyElement =
                <BuyPopup
                    
                    asset={asset}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasBought, e=null, asset_id=null) => {
                        callBack(wasBought);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const buyMissingElement =
            <BuyMissingPopup
                
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' });
                }}
                callBack={(wasBought, e=null, asset_id=null) => {
                    callBack(wasBought);
                    if (e) {
                        dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                    }
                }}
            />;

    const claimDropElement =
                <ClaimDropPopup
                    
                    drop={drop}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasBought, e=null, asset_id=null) => {
                        callBack(wasBought);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const setItemElement =
        <SetItemPopup
            asset={asset}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
        />;

    const editCollectionElement =
                <EditCollectionPopup
                    
                    drop={drop}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                        dispatch({type: 'SET_EDIT_DESCRIPTION', payload: ''});
                        dispatch({type: 'SET_EDIT_NAME', payload: ''});
                        dispatch({type: 'SET_EDIT_URL', payload: ''});
                        dispatch({type: 'SET_EDIT_MARKET_FEE', payload: ''});
                        dispatch({type: 'SET_EDIT_IMAGE', payload: ''});
                        dispatch({type: 'SET_IMAGE', payload: ''});
                        dispatch({type: 'SET_COLLECTION_NAME', payload: ''});
                        dispatch({type: 'SET_EDIT_NEW', payload: ''});
                    }}
                    collectionName={collectionName}
                    editDescription={editDescription}
                    editName={editName}
                    editUrl={editUrl}
                    editMarketFee={editMarketFee}
                    editImage={editImage}
                    editDisplayName={editDisplayName}
                    newCollection={newCollection}
                    image={image}
                    callBack={(wasEdited, e=null, transactionId=null) => {
                        callBack(wasEdited, e, transactionId);
                    }}
                />;

    const transferElement =
                <TransferPopup
                    
                    asset={asset}
                    receiver={receiver}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_RECEIVER', payload: '' });
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasTransferred, receiver, e=null, asset_id=null) => {
                        callBack(wasTransferred, receiver);
                        dispatch({ type: 'SET_RECEIVER', payload: '' });
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                        }
                    }}
                />;

    const collectionElement =
                <CollectionPopup
                    
                    asset={asset}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasBought) => {
                        callBack(wasBought);
                    }}
                />;

    const shareElement =
                <SharePopup
                    
                    asset={asset}
                    link={link}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                />;

    const tradeElement =
                <TradePopup
                    
                    assets={assets}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(tradeInfo) => {
                        callBack(tradeInfo);
                    }}
                />;

    const transferWaxElement =
                <TransferWaxPopup
                    
                    wax_balance={wax_balance}
                    ual={ual}
                    callBack={(transferInfo) => {
                        callBack(transferInfo);
                    }}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                />;

    const handleTradeElement =
                <HandleTradePopup
                    
                    offerId={offerId}
                    tradeOption={tradeOption}
                    ual={ual}
                    callBack={(transferInfo) => {
                        callBack(transferInfo);
                    }}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                />;

    const tubeElement =
                <TubePopup
                    
                    assets={assets}
                    tubeId={tubeId}
                    lowestMints={lowestMints}
                    ual={ual}
                    callBack={(transferInfo) => {
                        callBack(transferInfo);
                    }}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                />;

    useEffect(() => {
    }, [action]);

    return (
        <div className="PopupWrapper">
            <OutsideAlerter
                callBack={callBack}
                action={action}
            >
                {action === 'transfer_wax' ? transferWaxElement : ''}
                {action === 'buy' ? buyElement : ''}
                {action === 'buy_missing' ? buyMissingElement : ''}
                {action === 'bid' ? bidElement : ''}
                {action === 'sell' ? sellElement : ''}
                {action === 'auction' ? auctionElement : ''}
                {action === 'bulk_sell' ? bulkSellElement : ''}
                {action === 'bulk_edit' ? bulkEditElement : ''}
                {action === 'bulk_transfer' ? bulkTransferElement : ''}
                {action === 'bulk_distribute' ? bulkDistributeElement : ''}
                {action === 'bulk_cancel' ? bulkCancelElement : ''}
                {action === 'bundle' ? bundleElement : ''}
                {action === 'view' ? collectionElement : ''}
                {action === 'share' ? shareElement : ''}
                {action === 'bulk_burn' ? bulkBurnElement : ''}
                {action === 'bulk_stake' ? bulkStakeElement : ''}
                {action === 'bulk_unstake' ? bulkUnstakeElement : ''}
                {action === 'bulk_buy' ? bulkBuyElement : ''}
                {action === 'transfer' ? transferElement : ''}
                {action === 'trade' ? tradeElement : ''}
                {action === 'setitem' ? setItemElement : ''}
                {action === 'handle_trade' ? handleTradeElement : ''}
                {action === 'tube' ? tubeElement : ''}
                {action === 'claimdrop' ? claimDropElement : ''}
                {action === 'editCollection' ? editCollectionElement : ''}
            </OutsideAlerter>
        </div>
    );
}

export default PopupWrapper;
