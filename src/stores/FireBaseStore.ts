// Firebase App (the core Firebase SDK) is always required and must be listed first
import { default as firebase } from "firebase/app";
import { default as firebaseui } from "firebaseui";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

import { RootStore } from "./RootStore";
import { makeAutoObservable, reaction } from "mobx";

const CONFIG = {
    apiKey: "AIzaSyCwpBWHIARRc9V_ei5rVaPXD_du4Ai_BlQ",
    authDomain: "theadriann-financify.firebaseapp.com",
    databaseURL: "https://theadriann-financify.firebaseio.com",
    projectId: "theadriann-financify",
    storageBucket: "theadriann-financify.appspot.com",
    messagingSenderId: "762664579066",
    appId: "1:762664579066:web:740f8236dc02f35183be43",
    measurementId: "G-Q6ZW47TH09",
};

export default class FireBaseStore {
    //

    store: RootStore;
    parent: RootStore;

    provider: any = null;
    userData: any = null;

    ui?: firebaseui.auth.AuthUI;
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

        firebase.initializeApp(CONFIG);

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
            this.setUserData({ user: { ...userData } });
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
        return this.userData;
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
