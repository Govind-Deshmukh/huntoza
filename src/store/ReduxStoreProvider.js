import React from "react";
import { Provider } from "react-redux";
import { store } from "./index";

// Removed AuthProvider import to avoid circular dependency
const ReduxStoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
