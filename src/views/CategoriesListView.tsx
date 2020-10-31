// models
import Category from "@src/models/Category";

// utils
import React from "react";
import dayjs from "@src/utils/dayjs";
import { observer } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

// views
import CategoryListItemView from "./CategoryListItemView";

type CategoriesListViewProps = {
    walletId?: string;
    monthDate?: dayjs.Dayjs;
};

const CategoriesListView: React.FC<CategoriesListViewProps> = observer(
    (props) => {
        const store = useRootStore();
        const { filter_thisMonth, filter_thatMonth } = store.transactions;

        // get default data from stores
        let wallet = store.wallet.wallet;
        let transactions = store.transactions.latest;
        let filter = filter_thisMonth;

        // change wallet if provided
        if (props.walletId) {
            wallet = store.data.getWallet(props.walletId);
            transactions = store.transactions.getByWalletId(props.walletId);
        }

        // change filter if provided
        if (props.monthDate) {
            filter = filter_thatMonth(props.monthDate);
        }

        // apply filter
        transactions = transactions.filter(filter, transactions);

        // get all categories
        const categories = store.data.categories.arr;

        if (!wallet) {
            return null;
        }

        const renderCategory = (category: Category) => {
            const categoryTransactions = store.transactions.getByCategoryId(
                category.id,
                transactions
            );

            return (
                <CategoryListItemView
                    key={category.id}
                    wallet={wallet!}
                    category={category}
                    transactions={categoryTransactions}
                />
            );
        };

        const renderCategories = () => {
            return categories.map(renderCategory);
        };

        return <div>{renderCategories()}</div>;
    }
);

export default CategoriesListView;
