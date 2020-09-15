// models
import Wallet from "@src/models/Wallet";

// utils
import { RootStore } from "./RootStore";
import { makeObservable, observable, computed, action, reaction } from "mobx";
import { resolveMoney } from "@src/utils/formatMoney";

export default class WalletStore {
    //

    store: RootStore;
    walletId?: string;

    constructor(store: RootStore) {
        this.store = store;

        const config: any = {
            walletId: observable,
            //
            setWallet: action,
            setWalletId: action,
            onWalletsChange: action,
            processTransactions: action,
            //
            wallet: computed,
            invalid: computed,
            noWallets: computed,
        };

        makeObservable(this, config);

        reaction(() => this.store.data.wallets.size, this.onWalletsChange);
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onWalletsChange = () => {
        const { data } = this.store;
        const { size } = data.wallets;

        if (!size && this.walletId) {
            return this.setWalletId("");
        } else if (size && !data.wallets.get(this.walletId || "")) {
            return this.setWallet(data.wallets.arr[0]);
        }
    };

    // -----------------------
    // core methods
    // -----------------------

    setWalletId(walletId: string) {
        this.walletId = walletId;
    }

    setWallet(wallet: Wallet) {
        this.walletId = wallet.id;
    }

    async processTransactions(wallet = this.wallet) {
        if (!wallet) {
            return null;
        }

        const transactionsStore = this.store.transactions;
        const transactions = transactionsStore
            .getByWalletId(wallet.id)
            .filter(transactionsStore.notProcessedFilter);

        for (let transaction of transactions) {
            //
            const money = await resolveMoney(
                {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    date: transaction.date,
                    flow: transaction.flow,
                },
                { currency: wallet.currency }
            );

            wallet.amount += money.absoluteAmount;
            transaction._processed = true;
        }

        return this.store.data.saveData();
    }

    async processAllTransactions() {
        for (let wallet of this.store.data.wallets.arr) {
            await this.processTransactions(wallet);
        }
    }

    // -----------------------
    // computed data
    // -----------------------

    get noWallets() {
        return this.store.data.wallets.size === 0;
    }

    get wallet(): Wallet | undefined {
        return this.store.data.wallets.get(this.walletId || "");
    }

    get invalid() {
        return new Wallet({
            id: "zzzz",
            title: "No Wallet Selected",
            amount: 0,
            currency: "RON",
        });
    }
}
