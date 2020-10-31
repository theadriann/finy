// utils
import dayjs from "@src/utils/dayjs";
import { RootStore } from "../RootStore";
import { action, computed, makeObservable, observable } from "mobx";
import Transaction from "@src/models/Transaction";

import Payee from "@src/models/Payee";
import Category from "@src/models/Category";
import { Dayjs } from "dayjs";

type EditTransactionData = {
    payee: Payee | null;
    payeeInput: string;
    category: Category | null;
    categoryInput: string;
    date: Dayjs;
    amount: number;
    currency: string;
    outflow: boolean;
};

export default class EditTransactionStore {
    //

    active: boolean = false;

    transaction?: Transaction;
    data: EditTransactionData = {
        payee: null,
        payeeInput: "",
        categoryInput: "",
        category: null,
        amount: 0,
        currency: "RON",
        date: dayjs(),
        outflow: true,
    };

    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;

        const config: any = {
            active: observable,
            data: observable,
            transaction: observable,
            //
            //
            start: action,
            cancel: action,
            reset: action,
            loadData: action,
            //
            isValid: computed,
        };
        makeObservable(this, config);
    }

    start = (transaction: Transaction) => {
        this.loadData(transaction);

        //
        this.active = true;
    };

    loadData = (transaction: Transaction) => {
        this.transaction = transaction;

        // get all data
        const payee = this.store.data.payees.get(transaction.payeeId);
        const category = this.store.data.categories.get(transaction.categoryId);

        // set all data
        this.data.payee = payee || null;
        this.data.category = category || null;
        this.data.date = transaction.dayjsDate;
        this.data.amount = transaction.amount;
        this.data.currency = transaction.currency;
        this.data.outflow = transaction.flow === "out";
    };

    cancel = () => {
        this.reset();

        this.active = false;
    };

    reset() {
        this.transaction = undefined;
        this.data = {
            payee: null,
            payeeInput: "",
            categoryInput: "",
            category: null,
            amount: 0,
            currency: "RON",
            date: dayjs(),
            outflow: true,
        };
    }

    save = async () => {
        if (!this.isValid || !this.transaction) {
            return false;
        }

        // reverse current transaction
        await this.store.wallet.revertTransaction(this.transaction);

        // update transaction data
        this.transaction.date = this.data.date.unix();
        this.transaction.payeeId = this.data.payee!.id;
        this.transaction.categoryId = this.data.category!.id;
        this.transaction.amount = this.data.amount;
        this.transaction.currency = this.data.currency as Currency;
        this.transaction.flow = this.data.outflow ? "out" : "in";

        // update transaction db
        await this.store.data.updateTransaction(this.transaction);

        // process edited transaction
        await this.store.wallet.processAllTransactions();

        this.reset();
        this.active = false;
    };

    // -----------------------
    // event handling methods
    // -----------------------

    onPayeeSelect = (event: any, payee: Payee | string | null) => {
        if (!payee) {
            this.data.payee = null;
            this.data.payeeInput = "";
            return;
        }

        if (typeof payee === "string") {
            payee = this.store.data.createPayee({
                name: payee.replace("Add ", ""),
            });
        }

        this.data.payee = payee;
        this.data.payeeInput = payee.name;
    };

    onPayeeInputChange = (event: any, name: string) => {
        this.data.payeeInput = name;
    };

    onAmountChange = (event: any) => {
        this.data.amount = Number(event.target.value);
    };

    onCurrencyChange = (event: any, currency: any) => {
        this.data.currency = currency || "RON";
    };

    onDateChange = (newValue: any) => {
        this.data.date = newValue;
    };

    onCategoryChange = (event: any, category?: Category | null | string) => {
        if (!category) {
            this.data.categoryInput = "";
            this.data.category = null;
            return;
        }

        if (typeof category === "string") {
            category = this.store.data.createCategory({
                label: category.replace("Add ", ""),
            });
        }

        this.data.categoryInput = category.label;
        this.data.category = category;
    };

    onCategoryInputChange = (event: any, categoryName: any) => {
        this.data.categoryInput = categoryName;
    };

    onOutFlowChange = (e: any) => {
        this.data.outflow = e.target.checked;
    };

    // -----------------------
    // computed states
    // -----------------------

    get isValid() {
        if (
            !this.data.payee ||
            !this.data.date ||
            !this.data.category ||
            !this.data.currency ||
            typeof this.data.payee === "string"
        ) {
            return false;
        }

        return true;
    }
}
