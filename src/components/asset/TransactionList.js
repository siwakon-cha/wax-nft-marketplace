import React from 'react';

import TransactionInfo from "./TransactionInfo";
import {useTranslation} from "react-i18next";


function TransactionList(props) {
    const transactions = props['transactions'];
    const {t} = useTranslation('common');

    return  (
        <div className="HistoryContainer">
            <h3>{t('asset.transactions')}</h3>
            <div className="TransactionList">
                <table cellSpacing="0" cellPadding="0">
                    <tr>
                        <th>{t('asset.date')}</th>
                        <th>{t('asset.from')}</th>
                        <th>{t('asset.to')}</th>
                        <th>{t('asset.price')}</th>
                        <th>{t('asset.sold')}</th>
                        <th>{t('asset.transaction')}</th>
                    </tr>
                    {
                        transactions && transactions.map((transaction, index) => <TransactionInfo key={index} num={index} transaction={transaction} />)
                    }
                </table>
            </div>
        </div>
    );
}

export default TransactionList;
