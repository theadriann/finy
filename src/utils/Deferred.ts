export default class Deferred {
    //

    _resolve?: Function;
    _reject?: Function;

    _settled = false;
    _promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    });

    // =======================
    // Core methods
    // =======================

    promise() {
        return this._promise;
    }

    resolve(value: any) {
        this._settled = true;

        if (this._resolve) {
            this._resolve(value);
        }
    }

    reject(reason?: any) {
        this._settled = true;

        if (this._reject) {
            this._reject(reason);
        }
    }

    then(...args: any) {
        return Promise.prototype.catch.apply(this._promise, args);
    }

    catch(...args: any) {
        return Promise.prototype.catch.apply(this._promise, args);
    }
}
