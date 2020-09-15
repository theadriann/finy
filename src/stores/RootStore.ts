// utils
import { makeAutoObservable } from "mobx";

// stores
import UIStore from "./UIStore";
import DataStore from "./DataStore";
import WalletStore from "./WalletStore";
import RoutingStore from "./RoutingStore";
import FireBaseStore from "./FireBaseStore";
import TransactionsStore from "./TransactionsStore";

import { createContext, useStore } from "./utils";

export class RootStore {
    //

    ui: UIStore;
    data: DataStore;
    wallet: WalletStore;
    routing: RoutingStore;
    firebase: FireBaseStore;
    transactions: TransactionsStore;

    constructor() {
        makeAutoObservable(this);

        this.ui = new UIStore(this);
        this.data = new DataStore(this, this);
        this.wallet = new WalletStore(this);
        this.routing = new RoutingStore(this);
        this.transactions = new TransactionsStore(this);
        this.firebase = new FireBaseStore(this, this);

        this.init();
    }

    init() {
        this.data.loadData();
    }
}

const rootStore = new RootStore();
const storeContext = createContext(rootStore);

declare global {
    interface Window {
        rootStore: any;
        firebase: any;
    }
}

window.rootStore = rootStore;

export const useRootStore = (): RootStore => useStore(RootStore, storeContext);
export default rootStore;
