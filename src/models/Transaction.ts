import dayjs from "@src/utils/dayjs";
import BaseObject from "./BaseObject";
import { makeObservable, observable } from "mobx";

export type TransactionJSON = {
    date?: string | number;

    flow?: "out" | "in";
    amount?: number;
    currency?: Currency;

    payeeId?: string;
    walletId?: string;
    categoryId?: string;
};

export default class Transaction extends BaseObject {
    //

    date: string | number = dayjs().unix();

    flow: "in" | "out" = "out";
    amount: number = 0;
    currency: Currency = "RON";

    payeeId: string = "";
    walletId: string = "";
    categoryId: string = "";

    _processed: boolean = false;

    constructor(json: any) {
        super();

        const observablesConfig: any = {
            date: observable,
            flow: observable,
            amount: observable,
            currency: observable,
            payeeId: observable,
            walletId: observable,
            categoryId: observable,
            _processed: observable,
        };

        makeObservable(this, observablesConfig);

        this.fromJSON(json);
    }

    get dayjsDate() {
        if (typeof this.date === "number") {
            return dayjs.unix(this.date);
        }

        return dayjs(this.date);
    }

    get unixDate() {
        return this.dayjsDate.unix();
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.date = json.date || dayjs().unix();

        this.flow = json.flow || "out";
        this.amount = json.amount || 0;
        this.currency = json.currency || "RON";

        this.payeeId = json.payeeId || "";
        this.walletId = json.walletId || "";
        this.categoryId = json.categoryId || "";

        this._processed = json._processed || false;
    }

    toJSON(): any {
        const {
            date,
            flow,
            amount,
            currency,
            payeeId,
            walletId,
            categoryId,
            _processed,
        } = this;

        return {
            ...super.toJSON(),
            date,
            flow,
            amount,
            currency,
            payeeId,
            walletId,
            categoryId,
            _processed,
        };
    }
}
