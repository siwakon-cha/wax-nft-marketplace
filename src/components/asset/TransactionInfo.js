import React from 'react';

import moment from 'moment';


function TransactionInfo(props) {
    const transaction = props['transaction'];
    const num = props['num'];

    const { timestamp, from, to, price, offer, transactionId, currency } = transaction;

    const utc = moment.utc(timestamp).toDate();
    const date = moment(utc).local().format('YYYY-MM-DD HH:mm:ss');


    return (
        <tr className={num % 2 === 0 ? 'bg-transactionInfo': 'bg-transparent'}>
            <td className="text-center">{ date }:</td>
            <td className="text-center">{ from }</td>
            <td className="text-center">{ to }</td>
            <td className="text-center">{ offer > 0 ? Math.round(offer * 100)/100  +  ' WAX' : '' }</td>
            <td className="text-center">{ price > 0 ? Math.round(price * 100)/100  + (currency === 'USD' ? ' USD' : ' WAX') : '' }</td>
            <td className="text-center"><a target="_blank" rel="noopener noreferrer" href={"https://wax.bloks.io/transaction/" + transactionId}>{transactionId}</a></td>
        </tr>
    );
}

export default TransactionInfo;
