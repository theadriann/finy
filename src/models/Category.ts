import BaseObject from "./BaseObject";

export type CategoryJSON = {
    id?: string;
    label: string;
};

export default class Category extends BaseObject {
    //

    id: string = "";
    label: string = "";

    constructor(json: any) {
        super();

        this.fromJSON(json);
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.label = json.label || "";
    }

    toJSON(): any {
        const { label } = this;

        return { ...super.toJSON(), label };
    }
}
