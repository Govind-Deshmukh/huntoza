// src/hooks/useData.js
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import AccessControl from "../utils/accessControl";

// Import actions from all relevant slices
import {
  loadJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  addInterview,
  updateInterview,
  deleteInterview,
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
} from "../store/slices/plansSlice";

import {
  loadDashboardData,
  clearError as clearAnalyticsError,
} from "../store/slices/analyticsSlice";

import { paymentService } from "../services";

/**
 * Custom hook to access and manage application data through Redux
 * This hook handles all data operations (jobs, tasks, contacts, plans)
 * but does NOT handle authentication (use useAuth for that)
 */
export const useData = () => {
  const dispatch = useDispatch();

  // Get all relevant state from Redux store
  const jobs = useSelector((state) => state.jobs.jobs);
  const jobStats = useSelector((state) => state.jobs.stats);
  const jobsPagination = useSelector((state) => state.jobs.pagination);
  const jobsLoading = useSelector((state) => state.jobs.loading);
  const jobsError = useSelector((state) => state.jobs.error);

  const tasks = useSelector((state) => state.tasks.tasks);
  const taskStats = useSelector((state) => state.tasks.stats);
  const tasksPagination = useSelector((state) => state.tasks.pagination);
  const tasksLoading = useSelector((state) => state.tasks.loading);
  const tasksError = useSelector((state) => state.tasks.error);

  const contacts = useSelector((state) => state.contacts.contacts);
  const contactsPagination = useSelector((state) => state.contacts.pagination);
  const contactsLoading = useSelector((state) => state.contacts.loading);
  const contactsError = useSelector((state) => state.contacts.error);

  const plans = useSelector((state) => state.plans.plans);
  const currentPlan = useSelector((state) => state.plans.currentPlan);
  const plansLoading = useSelector((state) => state.plans.loading);
  const plansError = useSelector((state) => state.plans.error);

  const dashboardData = useSelector((state) => state.analytics.dashboardData);
  const analyticsLoading = useSelector((state) => state.analytics.loading);
  const analyticsError = useSelector((state) => state.analytics.error);

  // Combined loading and error states
  const isLoading =
    jobsLoading ||
    tasksLoading ||
    contactsLoading ||
    plansLoading ||
    analyticsLoading;

  const error =
    jobsError || tasksError || contactsError || plansError || analyticsError;

  // Create access control instance for subscription/plan limits
  const accessControl = new AccessControl(currentPlan);

  // Clear all errors
  const clearError = useCallback(() => {
    dispatch(clearJobsError());
    dispatch(clearTasksError());
    dispatch(clearContactsError());
    dispatch(clearPlansError());
    dispatch(clearAnalyticsError());
  }, [dispatch]);

  // DASHBOARD OPERATIONS
  const loadDashboardDataFunc = useCallback(async () => {
    try {
      const resultAction = await dispatch(loadDashboardData());
      return resultAction.payload;
    } catch (err) {
      console.error("Dashboard data error:", err);
      return null;
    }
  }, [dispatch]);

  // PLANS OPERATIONS
  const loadPlansFunc = useCallback(async () => {
    try {
      const resultAction = await dispatch(loadPlans());
      return resultAction.payload;
    } catch (err) {
      console.error("Load plans error:", err);
      return [];
    }
  }, [dispatch]);

  const loadCurrentPlanFunc = useCallback(async () => {
    try {
      const resultAction = await dispatch(loadCurrentPlan());
      return resultAction.payload;
    } catch (err) {
      console.error("Load current plan error:", err);
      return null;
    }
  }, [dispatch]);

  const initiatePlanUpgradeFunc = useCallback(
    async (planId, billingType) => {
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
    [dispatch]
  );

  const cancelSubscriptionFunc = useCallback(async () => {
    try {
      await dispatch(cancelSubscription());
      return true;
    } catch (err) {
      console.error("Cancel subscription error:", err);
      throw err;
    }
  }, [dispatch]);

  const createPaymentOrderFunc = useCallback(
    async (planId, billingType) => {
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
    [dispatch]
  );

  const verifyPaymentFunc = useCallback(
    async (paymentData) => {
      try {
        const resultAction = await dispatch(verifyPayment(paymentData));
        return resultAction.payload;
      } catch (err) {
        console.error("Verify payment error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const getPaymentHistoryFunc = useCallback(async () => {
    try {
      const transactions = await paymentService.getPaymentHistory();
      return transactions;
    } catch (err) {
      console.error("Payment history error:", err);
      return [];
    }
  }, []);

  // JOBS OPERATIONS
  const loadJobsFunc = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      try {
        const resultAction = await dispatch(loadJobs({ filters, page, limit }));
        return resultAction.payload;
      } catch (err) {
        console.error("Load jobs error:", err);
        return null;
      }
    },
    [dispatch]
  );

  const getJobByIdFunc = useCallback(
    async (jobId) => {
      try {
        const resultAction = await dispatch(getJobById(jobId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get job error:", err);
        return null;
      }
    },
    [dispatch]
  );

  const createJobFunc = useCallback(
    async (jobData) => {
      try {
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
    [dispatch, accessControl, jobsPagination.totalItems, currentPlan.plan.name]
  );

  const updateJobFunc = useCallback(
    async (jobId, jobData) => {
      try {
        const resultAction = await dispatch(updateJob({ jobId, jobData }));
        return resultAction.payload;
      } catch (err) {
        console.error("Update job error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const deleteJobFunc = useCallback(
    async (jobId) => {
      try {
        await dispatch(deleteJob(jobId));
        return true;
      } catch (err) {
        console.error("Delete job error:", err);
        return false;
      }
    },
    [dispatch]
  );

  const addInterviewFunc = useCallback(
    async (jobId, interviewData) => {
      try {
        const resultAction = await dispatch(
          addInterview({ jobId, interviewData })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Add interview error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateInterviewFunc = useCallback(
    async (jobId, interviewId, interviewData) => {
      try {
        const resultAction = await dispatch(
          updateInterview({ jobId, interviewId, interviewData })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Update interview error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const deleteInterviewFunc = useCallback(
    async (jobId, interviewId) => {
      try {
        const resultAction = await dispatch(
          deleteInterview({ jobId, interviewId })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Delete interview error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // TASKS OPERATIONS
  const loadTasksFunc = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
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
    [dispatch]
  );

  const getTaskByIdFunc = useCallback(
    async (taskId) => {
      try {
        const resultAction = await dispatch(getTaskById(taskId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get task error:", err);
        return null;
      }
    },
    [dispatch]
  );

  const createTaskFunc = useCallback(
    async (taskData) => {
      try {
        const resultAction = await dispatch(createTask(taskData));
        return resultAction.payload;
      } catch (err) {
        console.error("Create task error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateTaskFunc = useCallback(
    async (taskId, taskData) => {
      try {
        const resultAction = await dispatch(updateTask({ taskId, taskData }));
        return resultAction.payload;
      } catch (err) {
        console.error("Update task error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const completeTaskFunc = useCallback(
    async (taskId) => {
      try {
        const resultAction = await dispatch(completeTask(taskId));
        return resultAction.payload;
      } catch (err) {
        console.error("Complete task error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const deleteTaskFunc = useCallback(
    async (taskId) => {
      try {
        await dispatch(deleteTask(taskId));
        return true;
      } catch (err) {
        console.error("Delete task error:", err);
        return false;
      }
    },
    [dispatch]
  );

  // CONTACTS OPERATIONS
  const loadContactsFunc = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
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
    [dispatch]
  );

  const getContactByIdFunc = useCallback(
    async (contactId) => {
      try {
        const resultAction = await dispatch(getContactById(contactId));
        return resultAction.payload;
      } catch (err) {
        console.error("Get contact error:", err);
        return null;
      }
    },
    [dispatch]
  );

  const createContactFunc = useCallback(
    async (contactData) => {
      try {
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
      dispatch,
      accessControl,
      contactsPagination.totalItems,
      currentPlan.plan.name,
    ]
  );

  const updateContactFunc = useCallback(
    async (contactId, contactData) => {
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
    [dispatch]
  );

  const deleteContactFunc = useCallback(
    async (contactId) => {
      try {
        await dispatch(deleteContact(contactId));
        return true;
      } catch (err) {
        console.error("Delete contact error:", err);
        return false;
      }
    },
    [dispatch]
  );

  const toggleContactFavoriteFunc = useCallback(
    async (contactId) => {
      try {
        const resultAction = await dispatch(toggleContactFavorite(contactId));
        return resultAction.payload;
      } catch (err) {
        console.error("Toggle contact favorite error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const addInteractionFunc = useCallback(
    async (contactId, interactionData) => {
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
    [dispatch]
  );

  const updateInteractionFunc = useCallback(
    async (contactId, interactionId, interactionData) => {
      try {
        const resultAction = await dispatch(
          updateInteraction({ contactId, interactionId, interactionData })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Update interaction error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const deleteInteractionFunc = useCallback(
    async (contactId, interactionId) => {
      try {
        const resultAction = await dispatch(
          deleteInteraction({ contactId, interactionId })
        );
        return resultAction.payload;
      } catch (err) {
        console.error("Delete interaction error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
    // State
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
    loadDashboardData: loadDashboardDataFunc,

    // Plans operations
    loadPlans: loadPlansFunc,
    loadCurrentPlan: loadCurrentPlanFunc,
    initiatePlanUpgrade: initiatePlanUpgradeFunc,
    cancelSubscription: cancelSubscriptionFunc,
    createPaymentOrder: createPaymentOrderFunc,
    verifyPayment: verifyPaymentFunc,
    getPaymentHistory: getPaymentHistoryFunc,

    // Jobs operations
    loadJobs: loadJobsFunc,
    getJobById: getJobByIdFunc,
    createJob: createJobFunc,
    updateJob: updateJobFunc,
    deleteJob: deleteJobFunc,
    addInterview: addInterviewFunc,
    updateInterview: updateInterviewFunc,
    deleteInterview: deleteInterviewFunc,

    // Tasks operations
    loadTasks: loadTasksFunc,
    getTaskById: getTaskByIdFunc,
    createTask: createTaskFunc,
    updateTask: updateTaskFunc,
    completeTask: completeTaskFunc,
    deleteTask: deleteTaskFunc,

    // Contacts operations
    loadContacts: loadContactsFunc,
    getContactById: getContactByIdFunc,
    createContact: createContactFunc,
    updateContact: updateContactFunc,
    deleteContact: deleteContactFunc,
    toggleContactFavorite: toggleContactFavoriteFunc,
    addInteraction: addInteractionFunc,
    updateInteraction: updateInteractionFunc,
    deleteInteraction: deleteInteractionFunc,
  };
};
