// utils
import cuid from "cuid";

export default class BaseObject {
    //

    id: string = "";

    fromJSON(json: any) {
        this.id = json.id || cuid();
    }

    toJSON() {
        const { id } = this;

        return { id };
    }
}
