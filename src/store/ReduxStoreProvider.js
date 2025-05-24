// src/store/ReduxStoreProvider.js
import React from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";

// This component combines both Redux and Context API providers
// It allows for a gradual migration from Context API to Redux
const ReduxStoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </Provider>
  );
};

export default ReduxStoreProvider;
