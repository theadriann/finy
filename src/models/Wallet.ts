import BaseObject from "./BaseObject";
import { makeObservable, observable } from "mobx";

export type WalletJSON = {
    id?: string;
    title?: string;
    amount?: number;
    currency?: Currency;

    archived?: boolean;
};

export default class Wallet extends BaseObject {
    //

    id: string = "";
    title: string = "";
    amount: number = 0;
    currency: Currency = "RON";

    archived: boolean = false;

    constructor(json: WalletJSON) {
        super();

        const observablesConfig: any = {
            title: observable,
            amount: observable,
            currency: observable,
        };

        makeObservable(this, observablesConfig);

        this.fromJSON(json);
    }

    fromJSON(json: WalletJSON) {
        super.fromJSON(json);

        this.title = json.title || "";
        this.amount = json.amount || 0;
        this.currency = json.currency || "RON";

        this.archived = json.archived || false;
    }

    toJSON(): any {
        const { title, amount, currency, archived } = this;

        return { ...super.toJSON(), title, amount, currency, archived };
    }
}
