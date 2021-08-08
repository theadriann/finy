// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

import { RootStore } from "./RootStore";
import { makeAutoObservable, reaction } from "mobx";

const FIREBASE_CONFIG = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export default class FireBaseStore {
    //

    store: RootStore;
    parent: RootStore;

    provider: any = null;
    userData: any = null;

    db: firebase.database.Database;
    auth: firebase.auth.Auth;

    authOptions = {
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            signInSuccessWithAuthResult: (authResult: any) => {
                this.setUserData(authResult);

                return false;
            },
        },
    };

    constructor(store: RootStore, parent: RootStore) {
        this.store = store;
        this.parent = parent;

        firebase.initializeApp(FIREBASE_CONFIG);

        this.auth = firebase.auth();
        this.db = firebase.database();

        reaction(() => this.isLoggedIn, this.onLoggedInChange);
        this.onLoggedInChange();

        makeAutoObservable(this);
    }

    init() {
        this.setupAuth();
    }

    setUserData = (data: any) => {
        this.userData = data?.user;
    };

    logout() {
        return this.auth.signOut();
    }

    setupAuth() {
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        this.auth.onAuthStateChanged((userData) => {
            if (userData) {
                this.setUserData({ user: { ...userData } });
            }
        });
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onLoggedInChange = () => {
        if (!this.isLoggedIn) {
            return null;
        }

        this.fetchBuiltInData();
        // this.fetchUserData();
        this.syncUserData();
    };

    // -----------------------
    // data methods
    // -----------------------

    async fetchBuiltInData() {
        const snapshot = await this.db.ref("builtin").once("value");
        const data = snapshot.val();

        if (!data) {
            return;
        }

        this.store.data.loadCategories(data.categories);
    }

    async fetchUserData() {
        const snapshot = await this.userDbRef.once("value");
        const data = snapshot.val();

        this.store.data.loadData(data);
    }

    async syncUserData() {
        this.userDbRef.on("value", (snapshot) => {
            this.store.data.loadData(snapshot.val());
        });
    }

    saveUserData(json: any) {
        return this.userDbRef.update(json);
    }

    // -----------------------
    // update methods
    // -----------------------

    updatePayee(key: string, value: any) {
        this.updateData(`/payees/${key}`, value);
    }

    updateWallet(key: string, value: any) {
        this.updateData(`/wallets/${key}`, value);
    }

    updateCategory(key: string, value: any) {
        this.updateData(`/categories/${key}`, value);
    }

    updateTransaction(key: string, value: any) {
        this.updateData(`/transactions/${key}`, value);
    }

    async updateData(path: string, value: any) {
        this.db.ref(`${this.userDbPath}/${path}`).update(value);
    }

    // -----------------------
    // delete methods
    // -----------------------

    deletePayee(key: string) {
        this.deleteData(`/payees/${key}`);
    }

    deleteWallet(key: string) {
        this.deleteData(`/wallets/${key}`);
    }

    deleteCategory(key: string) {
        this.deleteData(`/categories/${key}`);
    }

    deleteTransaction(key: string) {
        this.deleteData(`/transactions/${key}`);
    }

    async deleteData(path: string) {
        this.db.ref(`${this.userDbPath}/${path}`).remove();
    }

    // -----------------------
    // computed states
    // -----------------------

    get isLoggedIn() {
        return this.userData && this.userData.uid;
    }

    // -----------------------
    // computed data
    // -----------------------

    get userDbPath() {
        return `/users/${this.userData.uid}`;
    }

    get userDbRef() {
        return this.db.ref(`/users/${this.userData.uid}`);
    }
}
