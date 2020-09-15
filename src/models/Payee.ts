import BaseObject from "./BaseObject";

export type PayeeJSON = {
    id?: string;
    name: string;
};

export default class Payee extends BaseObject {
    //

    id: string = "";
    name: string = "";

    constructor(json: any) {
        super();

        this.fromJSON(json);
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.name = json.name || "";
    }

    toJSON(): any {
        const { name } = this;

        return { ...super.toJSON(), name };
    }
}
