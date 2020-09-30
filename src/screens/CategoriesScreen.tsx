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

import styles from "./CategoriesScreen.module.scss";

interface CategoriesScreenProps extends GenericComponentProps {}

const CategoriesScreen: React.FC = observer((props) => {
    const localStore = useLocalStore(() => ({
        activeCategoryDate: dayjs(),
        onActiveCategoryDateChange(month: dayjs.Dayjs) {
            localStore.activeCategoryDate = month;
        },
    }));

    const store = useRootStore();

    const startDate = _.last(store.transactions.latest)?.dayjsDate || dayjs();
    const endDate = dayjs();

    return (
        <div className={styles.container}>
            <HeaderView>
                <MonthsCarousel
                    startDate={startDate}
                    endDate={endDate}
                    selectedDate={localStore.activeCategoryDate}
                    onDateChange={localStore.onActiveCategoryDateChange}
                />
            </HeaderView>
            <div className={styles.content}>
                <CategoriesListView monthDate={localStore.activeCategoryDate} />
            </div>
        </div>
    );
});

export default withSkeleton(CategoriesScreen);
