import _ from "lodash";
import { RootStore } from "./RootStore";
import Transaction from "@src/models/Transaction";
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

    // -----------------------
    // filters
    // -----------------------

    notProcessedFilter = (transaction: Transaction) => !transaction._processed;

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
                return t.momentDate.format("YYYY-MM-DD");
            }),
            (transactions: Transaction[], date: string) => ({
                date,
                transactions,
            })
        );
    }
}
