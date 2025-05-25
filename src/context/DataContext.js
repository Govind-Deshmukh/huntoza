// src/context/DataContext.js - Bridge to Redux
import React, { createContext, useContext } from "react";
import { useReduxData } from "../hooks/useData";

// Create a context that will now serve as a bridge to Redux
const DataContext = createContext(null);

// This provider will now use the Redux store via the useData hook
export const DataProvider = ({ children }) => {
  const dataFromRedux = useReduxData();

  return (
    <DataContext.Provider value={dataFromRedux}>
      {children}
    </DataContext.Provider>
  );
};

// This hook will remain for backward compatibility
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
