// utils
import { RootStore } from "../RootStore";
import { action, computed, makeObservable, observable } from "mobx";
import Deferred from "@src/utils/Deferred";

type ChoiceModalButton = {
    label: string;
    value: string;
};

type ChoiceModalOptions = {
    title?: string;
    buttons?: ChoiceModalButton[];
    description?: any;
};

export default class ChoiceModalStore {
    //

    store: RootStore;

    active: boolean = false;
    options: ChoiceModalOptions = {};

    deferred?: Deferred;

    constructor(store: RootStore) {
        this.store = store;

        this.reset();

        const config: any = { active: observable, options: observable };
        makeObservable(this, config);
    }

    open(options: ChoiceModalOptions) {
        if (this.deferred) {
            this.close();
        }

        this.active = true;
        this.options = options;
        this.deferred = new Deferred();

        return this.deferred.promise();
    }

    close() {
        if (this.deferred) {
            this.deferred.reject();
            this.reset();
        }

        this.active = false;
    }

    reset() {
        this.deferred = undefined;

        this.options = {
            title: "Are you sure?",
            buttons: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ],
        };
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onChoiceTaken = (event: any, choice: string) => {
        this.deferred?.resolve(choice);
        this.deferred = undefined;

        this.close();
    };

    // -----------------------
    // computed states
    // -----------------------
}
