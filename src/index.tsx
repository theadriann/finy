// styles
import "./index.scss";

// utils
import * as React from "react";
import { render } from "react-dom";
import "mobx-react/batchingForReactDom";

import App from "./App";

render(<App />, document.getElementById("root"));
