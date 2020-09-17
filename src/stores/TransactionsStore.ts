// models
import Transaction from "@src/models/Transaction";

// utils
import _ from "lodash";
import dayjs from "@src/utils/dayjs";
import { RootStore } from "./RootStore";
import { makeObservable, computed } from "mobx";

export default class TransactionsStore {
    //

    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;

        const config: any = {
            latest: computed,
            byWallet: computed,
            transactions: computed,
            groupedByDays: computed,
        };
        makeObservable(this, config);
    }

    // -----------------------
    // core methods
    // -----------------------

    getByWalletId(walletId: string) {
        return this.transactions.arr.filter((t) => t.walletId === walletId);
    }

    getByCategoryId(
        categoryId: string,
        arr: Transaction[] = this.transactions.arr
    ) {
        return arr.filter((t) => t.categoryId === categoryId);
    }

    // -----------------------
    // filters
    // -----------------------

    filter_notProcessed = (transaction: Transaction) => !transaction._processed;

    filter_thatMonth = (date: dayjs.Dayjs) => (transaction: Transaction) =>
        transaction.dayjsDate.isAfter(date.startOf("month")) &&
        transaction.dayjsDate.isBefore(date.endOf("month"));

    filter_thisMonth = this.filter_thatMonth(dayjs());

    // -----------------------
    // computed data
    // -----------------------

    get transactions() {
        return this.store.data.transactions;
    }

    get byWallet() {
        const { wallet } = this.store.wallet;

        if (!wallet) {
            return [];
        }

        return this.transactions.arr.filter((t) => t.walletId === wallet.id);
    }

    get latest() {
        return _.orderBy(this.byWallet, "unixDate", "desc");
    }

    get groupedByDays() {
        return _.map(
            _.groupBy(this.latest, (t: Transaction) => {
                return t.dayjsDate.format("YYYY-MM-DD");
            }),
            (transactions: Transaction[], date: string) => ({
                date,
                transactions,
            })
        );
    }
}
