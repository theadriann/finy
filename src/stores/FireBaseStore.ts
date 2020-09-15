// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";

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

    provider: any;
    userData: any;

    ui?: firebaseui.auth.AuthUI;
    db: firebase.database.Database;
    auth: firebase.auth.Auth;

    authOptions = {
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            signInSuccessWithAuthResult: (authResult: any) => {
                this.userData = authResult;

                return false;
            },
        },
    };

    constructor(store: RootStore, parent: RootStore) {
        makeAutoObservable(this);

        this.store = store;
        this.parent = parent;

        firebase.initializeApp(CONFIG);

        this.auth = firebase.auth();
        this.db = firebase.database();

        this.setupAuth();
        this.init();

        reaction(() => this.isLoggedIn, this.onLoggedInChange);
        this.onLoggedInChange();
    }

    logout() {
        return this.auth.signOut();
    }

    setupAuth() {
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        this.auth.onAuthStateChanged((userData) => {
            this.userData = userData;
        });
    }

    async init() {
        // this.ui = new firebaseui.auth.AuthUI(this.auth);
        // this.ui.start("#login-window", {
        //     signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        //     callbacks: {
        //         signInSuccessWithAuthResult: (authResult) => {
        //             this.userData = authResult;
        //             return false;
        //         },
        //         uiShown: () => (this.authLoaded = true),
        //     },
        //     signInFlow: "popup",
        // });
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
    // computed states
    // -----------------------

    get isLoggedIn() {
        return Boolean(this.userData);
    }

    // -----------------------
    // computed data
    // -----------------------

    get userDbRef() {
        return this.db.ref(`/users/${this.userData.uid}`);
    }
}
