import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import MessageToast from "./components/MessageToast/MessageToast.jsx";
import { setDispatch } from "./store/features/messages/messageActions.js";

import "./index.css";
import App from "./App.jsx";

setDispatch(store.dispatch);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <MessageToast />
    </BrowserRouter>
  </Provider>
);
