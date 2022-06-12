import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "core-js";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Main } from "./main/main";

import { icons } from "./presentation/assets/icons";

import { Provider } from "react-redux";
import store from "./presentation/redux/store";

React.icons = icons;

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("root")
);
