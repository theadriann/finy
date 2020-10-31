import { RootStore } from "./RootStore";

import SAI from "safe-area-insets";
import { action, computed, makeObservable, observable } from "mobx";

import AddWalletStore from "./ui/AddWalletStore";
import ChoiceModalStore from "./ui/ChoiceModalStore";
import EditTransactionStore from "./ui/EditTransactionStore";

interface Navigator {
    standalone?: boolean;
}

export default class UIStore {
    //

    store: RootStore;

    addWallet: AddWalletStore;
    editTransaction: EditTransactionStore;
    choiceModal: ChoiceModalStore;

    saiListener: any = undefined;
    supportsSAI: boolean = false;

    constructor(store: RootStore) {
        this.store = store;

        this.addWallet = new AddWalletStore(this.store);
        this.editTransaction = new EditTransactionStore(this.store);
        this.choiceModal = new ChoiceModalStore(this.store);

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
