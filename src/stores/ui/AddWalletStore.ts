// utils
import { RootStore } from "../RootStore";
import { action, computed, makeObservable, observable } from "mobx";

type AddWalletData = {
    title: string;
    amount: number;
    currency: Currency;
};

export default class AddWalletStore {
    //

    data: AddWalletData;
    active: boolean = false;

    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;

        this.data = {
            title: "",
            amount: 0,
            currency: "RON",
        };

        const config: any = {
            data: observable,
            active: observable,
            //
            onTitleChange: action,
            onAmountChange: action,
            onCurrencyChange: action,
            //
            isValid: computed,
        };
        makeObservable(this, config);
    }

    reset() {
        this.data = {
            title: "",
            amount: 0,
            currency: "RON",
        };
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onTitleChange = (event: any) => {
        this.data.title = event.target.value;
    };

    onAmountChange = (event: any) => {
        this.data.amount = Number(event.target.value);
    };

    onCurrencyChange = (event: any, currency: any) => {
        this.data.currency = currency || "RON";
    };

    onCreateClick = () => {
        if (!this.isValid) {
            return false;
        }

        // add to data store
        const newWallet = this.store.data.addWallet({
            title: this.data.title,
            amount: this.data.amount,
            currency: this.data.currency,
        });

        // set new wallet
        this.store.wallet.setWallet(newWallet);

        // save data
        this.store.data.saveData();

        // reset current form
        this.reset();

        // close modal
        this.active = false;
    };

    // -----------------------
    // computed states
    // -----------------------

    get isValid() {
        if (!this.data.title || !this.data.currency) {
            return false;
        }

        return true;
    }
}
