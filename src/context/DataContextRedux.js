// src/context/DataContextRedux.js
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "./AuthContext";
import AccessControl from "../utils/accessControl";

// Import actions from Redux slices
import {
  loadJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  updateJobStats,
  clearError as clearJobsError,
} from "../store/slices/jobsSlice";

import {
  loadTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  getTaskById,
  clearError as clearTasksError,
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
  clearError as clearContactsError,
} from "../store/slices/contactsSlice";

import {
  loadPlans,
  loadCurrentPlan,
  initiatePlanUpgrade,
  cancelSubscription,
  createPaymentOrder,
  verifyPayment,
  clearError as clearPlansError,
  clearPaymentOrder,
} from "../store/slices/plansSlice";

import {
  loadDashboardData,
  clearError as clearAnalyticsError,
} from "../store/slices/analyticsSlice";

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

  // Clear error - dispatches all clear error actions
  const clearError = useCallback(() => {
    dispatch(clearJobsError());
    dispatch(clearTasksError());
    dispatch(clearContactsError());
    dispatch(clearPlansError());
    dispatch(clearAnalyticsError());
  }, [dispatch]);

  // Initialize access control with current plan
  const accessControl = useMemo(
    () => new AccessControl(currentPlan),
    [currentPlan]
  );

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

  const initiatePlanUpgradeHandler = useCallback(
    async (planId, billingType) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          initiatePlanUpgrade({ planId, billingType })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Plan upgrade error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const cancelSubscriptionHandler = useCallback(async () => {
    if (!isAuthenticated) return false;
    try {
      await dispatch(cancelSubscription());
      return true;
    } catch (err) {
      console.error("Cancel subscription error:", err);
      throw err;
    }
  }, [isAuthenticated, dispatch]);

  const createPaymentOrderHandler = useCallback(
    async (planId, billingType) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          createPaymentOrder({ planId, billingType })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Create payment order error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const verifyPaymentHandler = useCallback(
    async (paymentData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(verifyPayment(paymentData));
        return resultAction.payload;
      } catch (err) {
        console.error("Verify payment error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const getPaymentHistoryHandler = useCallback(async () => {
    // This will need to be implemented in the paymentSlice if not already there
    return [];
  }, []);

  // === JOBS OPERATIONS ===
  const loadJobsHandler = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;
      try {
        const resultAction = await dispatch(loadJobs({ filters, page, limit }));
        return resultAction.payload;
      } catch (err) {
        console.error("Load jobs error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const getJobByIdHandler = useCallback(
    async (jobId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(getJobById(jobId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get job error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const createJobHandler = useCallback(
    async (jobData) => {
      if (!isAuthenticated) return null;
      try {
        // Check if we can create a new job based on current plan
        const canCreate = accessControl.canCreateJobApplication(
          jobsPagination.totalItems
        );
        if (!canCreate) {
          throw new Error(
            `You've reached the job applications limit for your ${currentPlan.plan.name} plan`
          );
        }

        const resultAction = await dispatch(createJob(jobData));
        return resultAction.payload;
      } catch (err) {
        console.error("Create job error:", err);
        throw err;
      }
    },
    [
      isAuthenticated,
      dispatch,
      accessControl,
      jobsPagination.totalItems,
      currentPlan.plan.name,
    ]
  );

  const updateJobHandler = useCallback(
    async (jobId, jobData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(updateJob({ jobId, jobData }));
        return resultAction.payload;
      } catch (err) {
        console.error("Update job error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const deleteJobHandler = useCallback(
    async (jobId) => {
      if (!isAuthenticated) return false;
      try {
        await dispatch(deleteJob(jobId));
        return true;
      } catch (err) {
        console.error("Delete job error:", err);
        return false;
      }
    },
    [isAuthenticated, dispatch]
  );

  // === TASKS OPERATIONS ===
  const loadTasksHandler = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;
      try {
        const resultAction = await dispatch(
          loadTasks({ filters, page, limit })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Load tasks error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const getTaskByIdHandler = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(getTaskById(taskId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get task error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const createTaskHandler = useCallback(
    async (taskData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(createTask(taskData));
        return resultAction.payload;
      } catch (err) {
        console.error("Create task error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const updateTaskHandler = useCallback(
    async (taskId, taskData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(updateTask({ taskId, taskData }));
        return resultAction.payload;
      } catch (err) {
        console.error("Update task error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const completeTaskHandler = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(completeTask(taskId));
        return resultAction.payload;
      } catch (err) {
        console.error("Complete task error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const deleteTaskHandler = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return false;
      try {
        await dispatch(deleteTask(taskId));
        return true;
      } catch (err) {
        console.error("Delete task error:", err);
        return false;
      }
    },
    [isAuthenticated, dispatch]
  );

  // === CONTACTS OPERATIONS ===
  const loadContactsHandler = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;
      try {
        const resultAction = await dispatch(
          loadContacts({ filters, page, limit })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Load contacts error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const getContactByIdHandler = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(getContactById(contactId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get contact error:", err);
        return null;
      }
    },
    [isAuthenticated, dispatch]
  );

  const createContactHandler = useCallback(
    async (contactData) => {
      if (!isAuthenticated) return null;
      try {
        // Check if we can create a new contact based on current plan
        const canCreate = accessControl.canCreateContact(
          contactsPagination.totalItems
        );
        if (!canCreate) {
          throw new Error(
            `You've reached the contacts limit for your ${currentPlan.plan.name} plan`
          );
        }

        const resultAction = await dispatch(createContact(contactData));
        return resultAction.payload;
      } catch (err) {
        console.error("Create contact error:", err);
        throw err;
      }
    },
    [
      isAuthenticated,
      dispatch,
      accessControl,
      contactsPagination.totalItems,
      currentPlan.plan.name,
    ]
  );

  const updateContactHandler = useCallback(
    async (contactId, contactData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          updateContact({ contactId, contactData })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Update contact error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const deleteContactHandler = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return false;
      try {
        await dispatch(deleteContact(contactId));
        return true;
      } catch (err) {
        console.error("Delete contact error:", err);
        return false;
      }
    },
    [isAuthenticated, dispatch]
  );

  const toggleContactFavoriteHandler = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(toggleContactFavorite(contactId));
        return resultAction.payload;
      } catch (err) {
        console.error("Toggle contact favorite error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const addInteractionHandler = useCallback(
    async (contactId, interactionData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          addInteraction({ contactId, interactionData })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Add interaction error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const updateInteractionHandler = useCallback(
    async (contactId, interactionId, interactionData) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          updateInteraction({
            contactId,
            interactionId,
            interactionData,
          })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Update interaction error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  const deleteInteractionHandler = useCallback(
    async (contactId, interactionId) => {
      if (!isAuthenticated) return null;
      try {
        const resultAction = await dispatch(
          deleteInteraction({
            contactId,
            interactionId,
          })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Delete interaction error:", err);
        throw err;
      }
    },
    [isAuthenticated, dispatch]
  );

  // Create a memoized context value
  const contextValue = useMemo(
    () => ({
      // State values
      jobs,
      jobStats,
      jobsPagination,
      tasks,
      taskStats,
      tasksPagination,
      contacts,
      contactsPagination,
      plans,
      currentPlan,
      dashboardData,
      isLoading,
      error,
      accessControl,

      // Methods
      clearError,

      // Dashboard operations
      loadDashboardData: loadDashboardDataHandler,

      // Plans operations
      loadPlans: loadPlansHandler,
      loadCurrentPlan: loadCurrentPlanHandler,
      initiatePlanUpgrade: initiatePlanUpgradeHandler,
      cancelSubscription: cancelSubscriptionHandler,
      createPaymentOrder: createPaymentOrderHandler,
      verifyPayment: verifyPaymentHandler,
      getPaymentHistory: getPaymentHistoryHandler,

      // Jobs operations
      loadJobs: loadJobsHandler,
      getJobById: getJobByIdHandler,
      createJob: createJobHandler,
      updateJob: updateJobHandler,
      deleteJob: deleteJobHandler,

      // Add methods for handling interviews if they exist in Redux slices
      addInterview: async () => {},
      updateInterview: async () => {},
      deleteInterview: async () => {},

      // Tasks operations
      loadTasks: loadTasksHandler,
      getTaskById: getTaskByIdHandler,
      createTask: createTaskHandler,
      updateTask: updateTaskHandler,
      completeTask: completeTaskHandler,
      deleteTask: deleteTaskHandler,

      // Contacts operations
      loadContacts: loadContactsHandler,
      getContactById: getContactByIdHandler,
      createContact: createContactHandler,
      updateContact: updateContactHandler,
      deleteContact: deleteContactHandler,
      toggleContactFavorite: toggleContactFavoriteHandler,
      addInteraction: addInteractionHandler,
      updateInteraction: updateInteractionHandler,
      deleteInteraction: deleteInteractionHandler,
    }),
    [
      // Dependencies for memo
      jobs,
      jobStats,
      jobsPagination,
      tasks,
      taskStats,
      tasksPagination,
      contacts,
      contactsPagination,
      plans,
      currentPlan,
      dashboardData,
      isLoading,
      error,
      accessControl,
      clearError,
      loadDashboardDataHandler,
      loadPlansHandler,
      loadCurrentPlanHandler,
      initiatePlanUpgradeHandler,
      cancelSubscriptionHandler,
      createPaymentOrderHandler,
      verifyPaymentHandler,
      getPaymentHistoryHandler,
      loadJobsHandler,
      getJobByIdHandler,
      createJobHandler,
      updateJobHandler,
      deleteJobHandler,
      loadTasksHandler,
      getTaskByIdHandler,
      createTaskHandler,
      updateTaskHandler,
      completeTaskHandler,
      deleteTaskHandler,
      loadContactsHandler,
      getContactByIdHandler,
      createContactHandler,
      updateContactHandler,
      deleteContactHandler,
      toggleContactFavoriteHandler,
      addInteractionHandler,
      updateInteractionHandler,
      deleteInteractionHandler,
    ]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
