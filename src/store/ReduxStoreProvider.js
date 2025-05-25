// src/store/ReduxStoreProvider.js
import React from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { AuthProvider } from "../context/AuthContext";

// This component provides the Redux store and Auth context
const ReduxStoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

export default ReduxStoreProvider;
