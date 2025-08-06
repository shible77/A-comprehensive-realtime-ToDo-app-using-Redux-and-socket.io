import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import SocketProvider from "./services/SocketProvider.tsx";
import GlobalModal from "./components/GlobalModal.tsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <Router>
          <App />
        </Router>
        <GlobalModal />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
