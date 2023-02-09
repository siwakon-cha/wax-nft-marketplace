import {formatMarket, formatUSD, formatWAX} from "../helpers/FormatLinks";

import React from "react";
import cn from "classnames";

const SaleDetails = (props) => {
    const sale = props.sale;

    const {usdPrice, price, seller, buyer, market} = sale;

    const tdClassFirst = cn('text-left w-1/3');
    const tdClassLast = cn('text-right w-2/3 overflow-x-auto');
    const tableClass = cn('w-full my-auto');

    return (
        <div className={cn(
            'relative w-1/2 p-8 m-auto text-sm text-neutral'
        )}>
            <h2>Sale Details</h2>
            <table className={tableClass}>
                <tr>
                    <td className={tdClassFirst}>Buyer:</td>
                    <td className={tdClassLast}>{buyer}</td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>Seller:</td>
                    <td className={tdClassLast}>{seller}</td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>Market:</td>
                    <td className={tdClassLast}>{formatMarket(market)}</td>
                </tr>
                <tr>
                    <td className={tdClassFirst}>Price:</td>
                    <td className={tdClassLast}>{formatUSD(usdPrice)} / {formatWAX(price)}</td>
                </tr>
            </table>
        </div>
    );
};

export default SaleDetails;
