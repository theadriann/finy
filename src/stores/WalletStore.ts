// models
import Wallet from "@src/models/Wallet";
import Transaction from "@src/models/Transaction";

// utils
import { RootStore } from "./RootStore";
import { makeObservable, observable, computed, action, reaction } from "mobx";
import { resolveMoney } from "@src/utils/money";

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
            active: computed,
        };

        makeObservable(this, config);

        reaction(() => this.store.data.wallets.size, this.onWalletsChange);
        reaction(() => this.active.length, this.onWalletsChange);
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onWalletsChange = () => {
        const { data } = this.store;
        const { size } = data.wallets;

        if (!size && this.walletId) {
            return this.setWalletId("");
        } else if (
            this.active.length &&
            !data.wallets.get(this.walletId || "")
        ) {
            return this.setWallet(this.active[0]);
        }
    };

    // -----------------------
    // core methods
    // -----------------------

    toggleArchiveWallet(wallet: Wallet, value?: boolean | undefined) {
        wallet.archived = value === undefined ? !wallet.archived : value;

        // commit to db
        this.store.data.updateWallet(wallet);
    }

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
            .filter(transactionsStore.filter_notProcessed);

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

            wallet.amount += money.signedAmount;
            transaction._processed = true;
        }

        return this.store.data.saveData();
    }

    async revertTransaction(transaction: Transaction) {
        const wallet = this.store.data.getWallet(transaction.walletId);

        if (!wallet) {
            return null;
        }

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

        wallet.amount -= money.signedAmount;
        transaction._processed = true;

        return this.store.firebase.updateWallet(wallet.id, wallet.toJSON());
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

    get active(): Wallet[] {
        return this.store.data.wallets.arr.filter((wallet) => !wallet.archived);
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
