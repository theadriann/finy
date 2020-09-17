// components
import SwipeableButtons from "@src/components/Swipeable/SwipeableButtons";
import { CgPen, CgTrash } from "react-icons/cg";
import { animated } from "react-spring";

// models
import Transaction from "@src/models/Transaction";

// styles
import styles from "./TransactionListItemView.module.scss";

// utils
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { resolveTransaction } from "@src/utils/formatMoney";
import { useRootStore } from "@src/stores/RootStore";

// views
import MoneyViewer from "./MoneyViewer";

const TransactionListItemView: React.FC<{
    transaction: Transaction;
}> = observer(({ transaction }) => {
    // -----------------------
    // define state
    // -----------------------

    const [money, setMoney] = React.useState<any>();

    // -----------------------
    // get data
    // -----------------------

    const { data: dataStore, ui } = useRootStore();
    const payee = dataStore.getPayee(transaction.payeeId);
    const wallet = dataStore.getWallet(transaction.walletId);
    const category = dataStore.getCategory(transaction.categoryId);

    useEffect(() => {
        if (!money) {
            const updateMoney = async () =>
                setMoney(
                    await resolveTransaction(transaction, { currency: "RON" })
                );

            updateMoney();
        }
    }, [transaction]);

    // don't show anything if money not resolved
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
        <SwipeableButtons
            buttons={[
                {
                    icon: <CgPen size={20} />,
                    label: "Edit",
                    position: "left",
                    onAction: () => console.log("will edit"),
                },
                {
                    icon: <CgTrash size={20} />,
                    label: "Delete",
                    position: "right",
                    className: "red",
                    onAction: () =>
                        ui.choiceModal
                            .open({
                                title: "Delete Transaction?",
                                description:
                                    "Are you sure you want to delete this transaction?",
                                buttons: [
                                    { label: "Delete", value: "delete" },
                                    { label: "Cancel", value: "cancel" },
                                ],
                            })
                            .then((value) => {
                                value === "delete" &&
                                    dataStore.deleteTransaction(transaction);
                            }),
                },
            ]}
            className={styles.container}
        >
            {(animatedProps: any) => (
                <animated.div className={styles.content} style={animatedProps}>
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
                </animated.div>
            )}
        </SwipeableButtons>
    );
});

export default TransactionListItemView;
