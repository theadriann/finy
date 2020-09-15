// styles
import "./index.scss";

// utils
import * as React from "react";
import { render } from "react-dom";
import moment from "moment";
import "mobx-react/batchingForReactDom";

import App from "./App";

moment.updateLocale("en", {
    calendar: {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        lastWeek: "[Last] dddd",
        nextWeek: "[Next] dddd",
        sameElse: "L",
    },
});

render(<App />, document.getElementById("root"));
