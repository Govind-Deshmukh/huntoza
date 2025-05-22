// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import jobsSlice from "./slices/jobsSlice";
import tasksSlice from "./slices/tasksSlice";
import contactsSlice from "./slices/contactsSlice";
import plansSlice from "./slices/plansSlice";
import analyticsSlice from "./slices/analyticsSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsSlice,
    tasks: tasksSlice,
    contacts: contactsSlice,
    plans: plansSlice,
    analytics: analyticsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
