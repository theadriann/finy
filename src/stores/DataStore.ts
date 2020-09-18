// models
import Payee from "@src/models/Payee";
import Wallet from "@src/models/Wallet";
import Category from "@src/models/Category";
import Transaction from "@src/models/Transaction";
import MapCollection from "@src/models/MapCollection";

// utils
import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

import type {
    PayeeJSON,
    WalletJSON,
    CategoryJSON,
    TransactionJSON,
} from "@src/models/types";

class DataStore {
    //

    store: RootStore;
    parent: RootStore;

    payees: MapCollection<Payee> = new MapCollection<Payee>();
    wallets: MapCollection<Wallet> = new MapCollection<Wallet>();
    categories: MapCollection<Category> = new MapCollection<Category>();
    transactions: MapCollection<Transaction> = new MapCollection<Transaction>();

    constructor(store: RootStore, parent: RootStore) {
        this.store = store;
        this.parent = parent;

        makeAutoObservable(this);
    }

    _addTransaction(details: TransactionJSON): Transaction {
        const transaction = new Transaction(details);

        this.transactions.add(transaction);

        return transaction;
    }

    addTransaction = (details: TransactionJSON): Transaction =>
        this._addTransaction(details);

    addCategory(json: CategoryJSON): Category {
        return this.categories.add(new Category(json));
    }

    addPayee(json: PayeeJSON): Payee {
        return this.payees.add(new Payee(json));
    }

    addWallet(json: WalletJSON): Wallet {
        return this.wallets.add(new Wallet(json));
    }

    createTransaction(details: TransactionJSON): Transaction {
        const transaction = this.addTransaction(details);
        this.saveData();

        return transaction;
    }

    createCategory(details: CategoryJSON): Category {
        const category = this.addCategory(details);
        this.saveData();

        return category;
    }

    createPayee(details: PayeeJSON): Payee {
        const payee = this.addPayee(details);
        this.saveData();

        return payee;
    }

    getCategory(id: string): Category {
        return (
            this.categories.get(id) ||
            new Category({ label: "Invalid Category " })
        );
    }

    getPayee(id: string): Payee {
        return this.payees.get(id) || new Payee({ name: "no payee " });
    }

    getWallet(id: string): Wallet {
        return (
            this.wallets.get(id) ||
            new Wallet({ title: "no wallet", currency: "RON" })
        );
    }

    // -----------------------
    // delete methods
    // -----------------------

    async _deleteTransaction(transaction: Transaction) {
        // remove from map
        await this.transactions.delete(transaction.id);

        // delete from db
        this.store.firebase.deleteTransaction(transaction.id);
    }

    async deleteTransaction(transaction: Transaction) {
        // revert tranasction inside wallet
        await this.store.wallet.revertTransaction(transaction);

        // delete transaction
        this._deleteTransaction(transaction);
    }

    async _deleteWallet(wallet: Wallet) {
        // remove from map
        await this.wallets.delete(wallet.id);

        // delete from db
        this.store.firebase.deleteWallet(wallet.id);
    }

    async deleteWallet(wallet: Wallet) {
        // delete transactions
        const transactions = this.store.transactions.getByWalletId(wallet.id);

        for (let transaction of transactions) {
            this._deleteTransaction(transaction);
        }

        // delete wallet object
        this._deleteWallet(wallet);
    }

    // -----------------------
    // event handling methods
    // -----------------------

    // -----------------------
    // save data methods
    // -----------------------

    saveData() {
        const json: any = {};

        json.payees = this.payees.toJSON();
        json.wallets = this.wallets.toJSON();
        json.categories = this.categories.toJSON();
        json.transactions = this.transactions.toJSON();

        return this.store.firebase.saveUserData(json);
    }

    // -----------------------
    // update data methods
    // -----------------------

    updateWallet(wallet: Wallet) {
        return this.store.firebase.updateWallet(wallet.id, wallet.toJSON());
    }

    // -----------------------
    // load data methods
    // -----------------------

    loadData(data: any = {}) {
        this.payees.clear();
        this.wallets.clear();
        this.categories.clear();
        this.transactions.clear();

        this.loadPayees(data.payees);
        this.loadWallets(data.wallets);
        this.loadCategories(data.categories);
        this.loadTranscations(data.transactions);
    }

    loadPayees(payees: any) {
        if (!payees) {
            return;
        }

        _.forEach(payees, (json: any) => this.addPayee(json));
    }

    loadWallets(wallets: any) {
        if (!wallets) {
            return;
        }

        _.forEach(wallets, (json: WalletJSON) => this.addWallet(json));
    }

    loadCategories(categories: any) {
        if (!categories) {
            return;
        }

        _.forEach(categories, (json: any) => this.addCategory(json));
    }

    loadTranscations(transactions: any) {
        if (!transactions) {
            return;
        }

        _.forEach(transactions, (json: any) => this.addTransaction(json));
    }
}

export default DataStore;
