import React from "react";
import moment from "moment";
import styles from "./TransactionsScreen.module.scss";
import { withSkeleton } from "@src/views/SkeletonView";
import { useRootStore } from "@src/stores/RootStore";
import { observer, useLocalStore } from "mobx-react";
import TransactionListItemView from "@src/views/TransactionListItemView";
import AddTransactionExperience from "@src/views/AddTransactionExperience";
import Tabs from "@src/components/Tabs";

import HeaderView from "@src/views/HeaderView";

interface TransactionsScreenProps extends GenericComponentProps {}

const TransactionsScreen: React.FC = observer((props) => {
    const localStore = useLocalStore(() => ({
        tabs: [
            { label: "Last Transactions", value: "latest" },
            { label: "Categories", value: "categories" },
        ],
        tabsValue: "latest",
        onTabsValueChange(value: string) {
            localStore.tabsValue = value;
        },
    }));

    const renderList = () => {
        switch (localStore.tabsValue) {
            case "categories":
                return <div>categories</div>;

            default:
                return <TransactionsList />;
        }
    };

    return (
        <div className={styles.container}>
            <HeaderView>
                <Tabs
                    value={localStore.tabsValue}
                    options={localStore.tabs}
                    className={styles.tabs}
                    onValueChange={localStore.onTabsValueChange}
                />
            </HeaderView>
            {/* <div className={styles.heroCard}>
                <h3>Add expenses</h3>
                <p>You can add any expenses.</p>
            </div> */}

            {renderList()}
            <AddTransactionExperience />
        </div>
    );
});

const TransactionsList: React.FC = observer(() => {
    const store = useRootStore();

    return (
        <>
            {store.transactions.groupedByDays.map((group) => (
                <GroupedTransactions key={group.date} group={group} />
            ))}
        </>
    );
});

const GroupedTransactions: React.FC<{ group: any }> = observer(({ group }) => {
    const momentdate = moment(group.date, "YYYY-MM-DD", true);

    return (
        <>
            <div className={styles.groupTitle}>
                {moment(momentdate).calendar()}
            </div>
            <div className={styles.groupContent}>
                {group.transactions.map((t: any) => (
                    <TransactionListItemView key={t.id} transaction={t} />
                ))}
            </div>
        </>
    );
});

export default withSkeleton(TransactionsScreen);
