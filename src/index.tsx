// styles
import "./index.scss";

// utils
import * as React from "react";
import { render } from "react-dom";

// app
import App from "./App";

// persistent storage
if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist();
}

render(<App />, document.getElementById("root"));
