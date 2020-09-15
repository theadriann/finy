import React from "react";

export const createContext = <T>(storeInstance: T) =>
    React.createContext<typeof storeInstance>(storeInstance);

export function useStore<T>(
    storeClass: new (...args: any[]) => T,
    storeContext: any
): T {
    const store: T = React.useContext(storeContext);

    if (!store) {
        throw new Error("useStore must be used within a StoreProvider.");
    }

    return store;
}
