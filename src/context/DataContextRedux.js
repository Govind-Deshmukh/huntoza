// src/context/DataContextRedux.js
import React, { createContext, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "./AuthContext";

// Import actions from Redux slices
import {
  loadJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  updateJobStats,
} from "../store/slices/jobsSlice";

import {
  loadTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  getTaskById,
} from "../store/slices/tasksSlice";

import {
  loadContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactById,
  toggleContactFavorite,
  addInteraction,
  updateInteraction,
  deleteInteraction,
} from "../store/slices/contactsSlice";

import {
  loadPlans,
  loadCurrentPlan,
  initiatePlanUpgrade,
  cancelSubscription,
  createPaymentOrder,
  verifyPayment,
} from "../store/slices/plansSlice";

import { loadDashboardData } from "../store/slices/analyticsSlice";

// Create context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  // Get data from Redux store
  const {
    jobs,
    currentJob,
    loading: jobsLoading,
    error: jobsError,
    pagination: jobsPagination,
    stats: jobStats,
  } = useSelector((state) => state.jobs);

  const {
    tasks,
    currentTask,
    loading: tasksLoading,
    error: tasksError,
    pagination: tasksPagination,
    stats: taskStats,
  } = useSelector((state) => state.tasks);

  const {
    contacts,
    currentContact,
    loading: contactsLoading,
    error: contactsError,
    pagination: contactsPagination,
  } = useSelector((state) => state.contacts);

  const {
    plans,
    currentPlan,
    paymentOrder,
    loading: plansLoading,
    error: plansError,
  } = useSelector((state) => state.plans);

  const {
    dashboardData,
    loading: analyticsLoading,
    error: analyticsError,
  } = useSelector((state) => state.analytics);

  // Combined loading and error states
  const isLoading =
    jobsLoading ||
    tasksLoading ||
    contactsLoading ||
    plansLoading ||
    analyticsLoading;
  const error =
    jobsError || tasksError || contactsError || plansError || analyticsError;

  // Clear error
  const clearError = useCallback(() => {
    // Redux slices already handle this with their clearError actions
  }, []);

  // === DASHBOARD OPERATIONS ===
  const loadDashboardDataHandler = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const resultAction = await dispatch(loadDashboardData());
      return resultAction.payload;
    } catch (err) {
      console.error("Dashboard data error:", err);
      return null;
    }
  }, [isAuthenticated, dispatch]);

  // === PLANS OPERATIONS ===
  const loadPlansHandler = useCallback(async () => {
    try {
      const resultAction = await dispatch(loadPlans());
      return resultAction.payload;
    } catch (err) {
      console.error("Load plans error:", err);
      return [];
    }
  }, [dispatch]);

  const loadCurrentPlanHandler = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const resultAction = await dispatch(loadCurrentPlan());
      return resultAction.payload;
    } catch (err) {
      console.error("Load current plan error:", err);
      return null;
    }
  }, [isAuthenticated, dispatch]);

  // === JOBS OPERATIONS ===
  const loadJobsHandler = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;
      try {
        const resultAction = await dispatch(loadJobs({ filters, page, limit }));
        return resultAction.payload;
      } catch (err) {
        console.error("Load jobs error:", err);
        return [];
      }
    },
    [isAuthenticated, dispatch]
  );
};
