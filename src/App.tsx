// styles
import styles from "./App.module.scss";

// stores
import store from "@src/stores/RootStore";

// styles
import "./index.scss";

// utils
import React from "react";
import DayJSUtils from "@material-ui/pickers/adapter/dayjs";
import { Router } from "react-router";
import { Switch, Route } from "react-router-dom";
import { LocalizationProvider } from "@material-ui/pickers";
import { observer, Provider as MobxProvider } from "mobx-react";

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

@observer
class App extends React.Component {
    //

    render() {
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
            <MobxProvider store={store}>
                <LocalizationProvider dateAdapter={DayJSUtils}>
                    <Router history={store.routing.history}>
                        <div className={styles.page}>{this.renderRoutes()}</div>
                        <MenuView />
                    </Router>
                </LocalizationProvider>
            </MobxProvider>
        );
    }

    renderRoutes() {
        return (
            <Switch>
                <Route path="/" component={HomeScreen} exact />
                <Route path="/categories" component={CategoriesScreen} />
                <Route path="/transactions" component={TransactionsScreen} />
                <Route path="/statistics" component={StatisticsScreen} />
                <Route path="/account" component={AccountScreen} />
            </Switch>
        );
    }
}

export default App;
