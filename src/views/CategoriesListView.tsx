// models
import Category from "@src/models/Category";

// utils
import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

// views
import CategoryListItemView from "./CategoryListItemView";

type CategoriesListViewProps = {
    walletId?: string;
};

const CategoriesListView: React.FC<CategoriesListViewProps> = observer(
    (props) => {
        const store = useRootStore();
        const { filter_thisMonth } = store.transactions;

        let wallet = store.wallet.wallet;
        let transactions = store.transactions.latest;

        if (props.walletId) {
            wallet = store.data.getWallet(props.walletId);
            transactions = store.transactions.getByWalletId(props.walletId);
        }

        // filter only this month
        transactions = transactions.filter(filter_thisMonth, transactions);

        const categories = store.data.categories.arr;

        if (!wallet) {
            return null;
        }

        const renderCategory = (category: Category) => {
            const tAll = store.transactions.getByCategoryId(
                category.id,
                transactions
            );

            return (
                <CategoryListItemView
                    key={category.id}
                    wallet={wallet!}
                    category={category}
                    transactions={tAll}
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
