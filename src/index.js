import React from "react";
import ReactDOM from "react-dom";
import { AppEntry } from "./AppEntry";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./utils/before";
import "@fontsource/bai-jamjuree";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppEntry />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
