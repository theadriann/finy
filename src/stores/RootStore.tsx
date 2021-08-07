// stores
import UIStore from "./UIStore";
import DataStore from "./DataStore";
import WalletStore from "./WalletStore";
import RoutingStore from "./RoutingStore";
import FireBaseStore from "./FireBaseStore";
import TransactionsStore from "./TransactionsStore";

// utils
import React from "react";
import { createContext, useContext } from "react";

export class RootStore {
    //

    ui: UIStore;
    data: DataStore;
    wallet: WalletStore;
    routing: RoutingStore;
    firebase: FireBaseStore;
    transactions: TransactionsStore;

    constructor() {
        this.ui = new UIStore(this);
        this.data = new DataStore(this, this);
        this.wallet = new WalletStore(this);
        this.routing = new RoutingStore(this);
        this.transactions = new TransactionsStore(this);
        this.firebase = new FireBaseStore(this, this);
    }

    init() {
        this.data.loadData();
        this.firebase.init();
    }
}

const rootStore = new RootStore();
export const RootStoreContext = createContext(rootStore);

export const RootStoreProvider = ({ children }: any) => (
    <RootStoreContext.Provider value={rootStore}>
        {children}
    </RootStoreContext.Provider>
);

declare global {
    interface Window {
        rootStore: any;
        firebase: any;
    }
}

window.rootStore = rootStore;

export const useRootStore = (): RootStore => useContext(RootStoreContext);

export default rootStore;
