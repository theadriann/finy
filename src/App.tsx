// styles
import styles from "./App.module.scss";

// stores
import { RootStoreProvider, useRootStore } from "@src/stores/RootStore";

// styles
import "./index.scss";

// utils
import React from "react";
import DayJSUtils from "@material-ui/pickers/adapter/dayjs";
import { Router } from "react-router";
import { Switch, Route } from "react-router-dom";
import { LocalizationProvider } from "@material-ui/pickers";
import { toJS } from "mobx";
import { observer } from "mobx-react";

// screens
import HomeScreen from "@src/screens/HomeScreen";
import AccountScreen from "@src/screens/AccountScreen";
import CategoriesScreen from "@src/screens/CategoriesScreen";
import StatisticsScreen from "@src/screens/StatisticsScreen";
import TransactionsScreen from "@src/screens/TransactionsScreen";

// views
import MenuView from "./views/Menu/MenuView";
import SkeletonView from "./views/SkeletonView";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useEffect } from "react";

const AppContent = observer(() => {
    //
    const store = useRootStore();

    useEffect(() => {
        store.init();
    }, []);

    if (!store.firebase.isLoggedIn) {
        return (
            <SkeletonView>
                <StyledFirebaseAuth
                    uiConfig={store.firebase.authOptions}
                    firebaseAuth={store.firebase.auth}
                />
            </SkeletonView>
        );
    }

    return (
        <LocalizationProvider dateAdapter={DayJSUtils}>
            <Router history={toJS(store.routing.history)}>
                <div className={styles.page}>
                    <Switch>
                        <Route path="/" component={HomeScreen} exact />
                        <Route
                            path="/categories"
                            component={CategoriesScreen}
                        />
                        <Route
                            path="/transactions"
                            component={TransactionsScreen}
                        />
                        <Route
                            path="/statistics"
                            component={StatisticsScreen}
                        />
                        <Route path="/account" component={AccountScreen} />
                    </Switch>
                </div>
                <MenuView />
            </Router>
        </LocalizationProvider>
    );
});

const App = () => {
    return (
        <RootStoreProvider>
            <AppContent />
        </RootStoreProvider>
    );
};

export default App;
