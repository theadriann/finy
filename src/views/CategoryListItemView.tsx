// components

// models
import Transaction from "@src/models/Transaction";

// styles
import styles from "./CategoryListItemView.module.scss";

// utils
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { resolveTransaction } from "@src/utils/formatMoney";

// views
import MoneyViewer from "./MoneyViewer";
import Category from "@src/models/Category";
import Wallet from "@src/models/Wallet";

const CategoryListItemView: React.FC<{
    wallet: Wallet;
    category: Category;
    transactions: Transaction[];
}> = observer(({ wallet, category, transactions }) => {
    // -----------------------
    // define state
    // -----------------------

    const [money, setMoney] = React.useState<any>(undefined);

    // -----------------------
    // get data
    // -----------------------

    useEffect(() => {
        const updateMoney = async () => {
            let amount = 0;

            for (let transaction of transactions) {
                const resolved = await resolveTransaction(transaction, {
                    currency: wallet.currency,
                });

                if (resolved.signtxt === "plus") {
                    amount += Number(resolved.amount);
                } else {
                    amount -= Number(resolved.amount);
                }
            }

            setMoney(amount);
        };

        updateMoney();
    }, [transactions, wallet.currency]);

    // don't show anything if money not resolved
    if (money === undefined) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>{category.label}</div>
                    <div className={styles.category}>
                        {transactions.length} transactions
                    </div>
                </div>
                <div className={styles.moneyContainer}>
                    <MoneyViewer
                        amount={Math.abs(money)}
                        currency={wallet.currency}
                        newCurrency={wallet.currency}
                        flow={money > 0 ? "in" : "out"}
                        showSign={true}
                    />
                </div>
            </div>
        </div>
    );
});

export default CategoryListItemView;
