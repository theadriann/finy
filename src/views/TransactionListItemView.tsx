// models
import Transaction from "@src/models/Transaction";

// styles
import styles from "./TransactionListItemView.module.scss";

// utils
import React from "react";
import { observer } from "mobx-react";
import { resolveTransaction } from "@src/utils/formatMoney";
import { useRootStore } from "@src/stores/RootStore";

// views
import MoneyViewer from "./MoneyViewer";

const TransactionListItemView: React.FC<{
    transaction: Transaction;
}> = observer(({ transaction }) => {
    const [money, setMoney] = React.useState<any>();
    const dataStore = useRootStore().data;
    const payee = dataStore.getPayee(transaction.payeeId);
    const wallet = dataStore.getWallet(transaction.walletId);
    const category = dataStore.getCategory(transaction.categoryId);

    const updateMoney = async () =>
        setMoney(await resolveTransaction(transaction, { currency: "RON" }));

    React.useEffect(() => {
        if (!money) {
            updateMoney();
        }
    });

    if (!money) {
        return null;
    }

    const renderOriginalMoney = () =>
        wallet.currency !== transaction.currency && (
            <MoneyViewer
                flow={transaction.flow}
                amount={transaction.amount}
                currency={transaction.currency}
                showSign={true}
                className={styles.originalMoney}
            />
        );

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>{payee.name}</div>
                <div className={styles.category}>{category.label}</div>
            </div>
            <div className={styles.moneyContainer}>
                <MoneyViewer
                    flow={transaction.flow}
                    amount={transaction.amount}
                    currency={transaction.currency}
                    newCurrency={wallet.currency}
                    showSign={true}
                />
                {renderOriginalMoney()}
            </div>
        </div>
    );
});

export default TransactionListItemView;
