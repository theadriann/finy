// models
import Transaction from "@src/models/Transaction";
import MapCollection from "@src/models/MapCollection";

// utils
import React from "react";
import { observer } from "mobx-react";

// views
import TransactionListItemView from "./TransactionListItemView";

const TransactionsListView: React.FC<{
    transactions: MapCollection<Transaction>;
}> = observer(({ transactions }) => {
    if (!transactions) {
        return null;
    }

    return (
        <div>
            <h2>transactions</h2>
            {transactions.arr.map((t, k) => (
                <TransactionListItemView key={k} transaction={t} />
            ))}
        </div>
    );
});

export default TransactionsListView;
