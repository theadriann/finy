// utils
import _ from "lodash";
import dayjs from "@src/utils/dayjs";
import React from "react";
import { withSkeleton } from "@src/views/SkeletonView";
import { useRootStore } from "@src/stores/RootStore";
import { observer, useLocalStore } from "mobx-react";

// components
import Tabs from "@src/components/Tabs";
import MonthsCarousel from "@src/components/MonthsCarousel";

// views
import HeaderView from "@src/views/HeaderView";
import CategoriesListView from "@src/views/CategoriesListView";
import TransactionListItemView from "@src/views/TransactionListItemView";
import AddTransactionExperience from "@src/views/AddTransactionExperience";

import styles from "./TransactionsScreen.module.scss";

interface TransactionsScreenProps extends GenericComponentProps {}

const TransactionsScreen: React.FC = observer((props) => {
    const store = useRootStore();

    return (
        <div className={styles.container}>
            <HeaderView />
            <div className={styles.content}>
                <TransactionsList />
            </div>
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
    const dayjsdate = dayjs(group.date, "YYYY-MM-DD").locale("en");

    return (
        <>
            <div className={styles.groupTitle}>
                {dayjsdate.calendar(undefined)}
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
