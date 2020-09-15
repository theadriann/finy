import { RootStore } from "./RootStore";

import SAI from "safe-area-insets";
import { action, computed, makeObservable, observable } from "mobx";

import AddWalletStore from "./ui/AddWalletStore";

interface Navigator {
    standalone?: boolean;
}

export default class UIStore {
    //

    store: RootStore;

    addWallet: AddWalletStore;

    saiListener: any = undefined;
    supportsSAI: boolean = false;

    constructor(store: RootStore) {
        this.store = store;

        this.addWallet = new AddWalletStore(this.store);

        const config: any = {
            saiListener: observable,
            supportsSAI: observable,
            applySAI: action,
            sai: computed,
            bottom: computed,
        };
        makeObservable(this, config);

        this.startSAI();
    }

    startSAI() {
        if (!this.saiListener) {
            this.saiListener = SAI.onChange(() => this.applySAI());
        }

        this.applySAI();
    }

    applySAI() {
        this.supportsSAI = SAI.support;
    }

    get sai() {
        return this.supportsSAI && SAI;
    }

    get bottom() {
        let navigator: Navigator = window.navigator as Navigator;
        let bottom = navigator.standalone ? 16 : 0;

        if (!this.supportsSAI) {
            return bottom;
        }

        return SAI.bottom || bottom;
    }
}
