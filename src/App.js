import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReduxStoreProvider from "./store/ReduxStoreProvider";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes"; // Assuming you have a routes component

function App() {
  return (
    <BrowserRouter>
      <ReduxStoreProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ReduxStoreProvider>
    </BrowserRouter>
  );
}

export default App;
