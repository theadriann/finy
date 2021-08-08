// utils
import { createHashHistory } from "history";
import { action, observable, makeObservable } from "mobx";
import { RootStore } from "./RootStore";

const history = createHashHistory();

export default class RoutingStore {
    //

    history?: any;
    location?: any;

    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;

        this.history = history;
        this.location = history.location;

        const mobxConfig: any = {
            location: observable,
            onHistoryChange: action,
        };

        makeObservable(this, mobxConfig);

        history.listen(this.onHistoryChange);
    }

    isOn = (location: string) => {
        return this.location.pathname === location;
    };

    onHistoryChange = (location: any) => {
        this.location = location;
    };
}
