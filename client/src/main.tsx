import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import SocketProvider from "./services/SocketProvider.tsx";
import GlobalModal from "./components/GlobalModal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
        <GlobalModal />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
