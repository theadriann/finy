import { makeAutoObservable } from "mobx";

interface BaseObject {
    id: string;
    toJSON: Function;
}

export default class MapCollection<T extends BaseObject> {
    //

    map: Map<string, T> = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    add(value: T) {
        this.map.set(value.id, value);

        return value;
    }

    get(key: string) {
        return this.map.get(key);
    }

    set(key: string, value: T) {
        this.map.set(key, value);
    }

    has(key: string) {
        return this.map.has(key);
    }

    delete(key: string) {
        this.map.delete(key);
    }

    clear() {
        this.map.clear();
    }

    toJSON() {
        return this.arr.reduce((prev: any, curr: T) => {
            prev[curr.id] = curr.toJSON();

            return prev;
        }, {});
    }

    // -----------------------
    // computed data
    // -----------------------

    get arr() {
        return [...this.map.values()];
    }

    get size() {
        return this.map.size;
    }
}
