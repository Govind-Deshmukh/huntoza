// src/context/DataContext.js
// This file exists solely for backward compatibility and is a bridge to the Redux implementation
// It exports the useData hook for components that still import from this file

import { useData } from "../hooks/useData";

// Create an empty context object for compatibility
const DataContext = {
  Provider: ({ children }) => children,
};

// Export both the context (for compatibility) and the hook
export { DataContext, useData };
export default DataContext;
