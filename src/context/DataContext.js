import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import useCurrentPlan from "../hooks/useCurrentPlans";
import AccessControl from "../utils/accessControl";
import {
  showSuccessToast,
  showErrorToast,
  handleApiError,
} from "../utils/toastUtils";
import {
  jobService,
  taskService,
  contactService,
  planService,
  paymentService,
  analyticsService,
} from "../services";

// Create context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [jobStats, setJobStats] = useState({
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
    saved: 0,
  });
  const [jobsPagination, setJobsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [tasksPagination, setTasksPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [contactsPagination, setContactsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Plans state
  const [plans, setPlans] = useState([]);

  // Use the safe current plan hook instead of state + useEffect
  const currentPlanData = useCurrentPlan(isAuthenticated);

  // Initialize access control with current plan
  const accessControl = useMemo(
    () => new AccessControl(currentPlanData),
    [currentPlanData]
  );

  // Analytics state
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // === DASHBOARD OPERATIONS ===
  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const data = await analyticsService.loadDashboardData();
      setDashboardAnalytics(data);

      // Set job stats from analytics
      setJobStats(data.applicationStats);

      return data;
    } catch (err) {
      const errorMessage = "Failed to load dashboard data";
      setError(errorMessage);
      handleApiError(err);
      console.error("Dashboard data error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearError]);

  // === PLANS OPERATIONS ===
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();

      const plansData = await planService.loadPlans();
      setPlans(plansData);
      return plansData;
    } catch (err) {
      const errorMessage = "Failed to load plans";
      setError(errorMessage);
      handleApiError(err);
      console.error("Load plans error:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  const loadCurrentPlan = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      // FIX: Use refreshPlan from our hook
      const refreshedPlan = await currentPlanData.refreshPlan();
      return refreshedPlan;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, [isAuthenticated, currentPlanData]);

  // === JOBS OPERATIONS ===
  const loadJobs = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        clearError();

        const data = await jobService.loadJobs(filters, page, limit);

        setJobs(data.jobs);
        setJobsPagination({
          currentPage: data.currentPage,
          totalPages: data.numOfPages,
          totalItems: data.totalJobs,
        });

        return data;
      } catch (err) {
        const errorMessage = "Failed to load jobs";
        setError(errorMessage);
        handleApiError(err);
        console.error("Load jobs error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );
  const getJobById = useCallback(
    async (jobId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const jobData = await jobService.getJobById(jobId);
        return jobData;
      } catch (err) {
        const errorMessage = "Failed to load job details";
        setError(errorMessage);
        handleApiError(err);
        console.error("Get job error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );

  const createJob = useCallback(
    async (jobData) => {
      if (!isAuthenticated) return null;

      try {
        // Check if we can create a new job based on current plan
        const canCreate = accessControl.canCreateJobApplication(
          jobsPagination.totalItems
        );
        if (!canCreate) {
          throw new Error(
            `You've reached the job applications limit for your ${currentPlanData.plan.name} plan`
          );
        }

        setIsLoading(true);
        clearError();

        const createdJob = await jobService.createJob(jobData);

        // Update jobs list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) => [createdJob, ...prevJobs]);
        }

        // Update total count
        setJobsPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems + 1,
        }));

        showSuccessToast("Job application created successfully!");
        return createdJob;
      } catch (err) {
        const errorMessage = err.message || "Failed to create job";
        setError(errorMessage);
        handleApiError(err);
        console.error("Create job error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isAuthenticated,
      clearError,
      jobs.length,
      jobsPagination.totalItems,
      accessControl,
      currentPlanData.plan.name,
    ]
  );

  const updateJob = useCallback(
    async (jobId, jobData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedJob = await jobService.updateJob(jobId, jobData);

        // Update job in the list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job._id === jobId ? updatedJob : job))
          );
        }

        showSuccessToast("Job application updated successfully!");
        return updatedJob;
      } catch (err) {
        const errorMessage = "Failed to update job";
        setError(errorMessage);
        handleApiError(err);
        console.error("Update job error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, jobs.length]
  );

  const deleteJob = useCallback(
    async (jobId) => {
      if (!isAuthenticated) return false;

      try {
        setIsLoading(true);
        clearError();

        await jobService.deleteJob(jobId);

        // Remove job from the list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        }

        // Update total count
        setJobsPagination((prev) => ({
          ...prev,
          totalItems: Math.max(0, prev.totalItems - 1),
        }));

        showSuccessToast("Job application deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage = "Failed to delete job";
        setError(errorMessage);
        handleApiError(err);
        console.error("Delete job error:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, jobs.length]
  );

  const addInterview = useCallback(
    async (jobId, interviewData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedJob = await jobService.addInterview(jobId, interviewData);

        // Update job in the list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job._id === jobId ? updatedJob : job))
          );
        }

        showSuccessToast("Interview added successfully!");
        return updatedJob;
      } catch (err) {
        const errorMessage = "Failed to add interview";
        setError(errorMessage);
        handleApiError(err);
        console.error("Add interview error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, jobs.length]
  );

  const updateInterview = useCallback(
    async (jobId, interviewId, interviewData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedJob = await jobService.updateInterview(
          jobId,
          interviewId,
          interviewData
        );

        // Update job in the list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job._id === jobId ? updatedJob : job))
          );
        }

        showSuccessToast("Interview updated successfully!");
        return updatedJob;
      } catch (err) {
        const errorMessage = "Failed to update interview";
        setError(errorMessage);
        handleApiError(err);
        console.error("Update interview error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, jobs.length]
  );

  const deleteInterview = useCallback(
    async (jobId, interviewId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedJob = await jobService.deleteInterview(jobId, interviewId);

        // Update job in the list if it's loaded
        if (jobs.length > 0) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job._id === jobId ? updatedJob : job))
          );
        }

        showSuccessToast("Interview deleted successfully!");
        return updatedJob;
      } catch (err) {
        const errorMessage = "Failed to delete interview";
        setError(errorMessage);
        handleApiError(err);
        console.error("Delete interview error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, jobs.length]
  );

  // === TASKS OPERATIONS ===
  const loadTasks = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        clearError();

        const data = await taskService.loadTasks(filters, page, limit);

        setTasks(data.tasks);
        setTasksPagination({
          currentPage: data.currentPage,
          totalPages: data.numOfPages,
          totalItems: data.totalTasks,
        });

        return data;
      } catch (err) {
        const errorMessage = "Failed to load tasks";
        setError(errorMessage);
        handleApiError(err);
        console.error("Load tasks error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );

  const getTaskById = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const taskData = await taskService.getTaskById(taskId);
        return taskData;
      } catch (err) {
        const errorMessage = "Failed to load task details";
        setError(errorMessage);
        handleApiError(err);
        console.error("Get task error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );

  const createTask = useCallback(
    async (taskData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const createdTask = await taskService.createTask(taskData);

        // Update tasks list if it's loaded
        if (tasks.length > 0) {
          setTasks((prevTasks) => [createdTask, ...prevTasks]);
        }

        showSuccessToast("Task created successfully!");
        return createdTask;
      } catch (err) {
        const errorMessage = "Failed to create task";
        setError(errorMessage);
        handleApiError(err);
        console.error("Create task error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, tasks.length]
  );

  const updateTask = useCallback(
    async (taskId, taskData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedTask = await taskService.updateTask(taskId, taskData);

        // Update task in the list if it's loaded
        if (tasks.length > 0) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
          );
        }

        showSuccessToast("Task updated successfully!");
        return updatedTask;
      } catch (err) {
        const errorMessage = "Failed to update task";
        setError(errorMessage);
        handleApiError(err);
        console.error("Update task error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, tasks.length]
  );

  const completeTask = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedTask = await taskService.completeTask(taskId);

        // Update task in the list if it's loaded
        if (tasks.length > 0) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
          );
        }

        showSuccessToast("Task marked as completed!");
        return updatedTask;
      } catch (err) {
        const errorMessage = "Failed to complete task";
        setError(errorMessage);
        handleApiError(err);
        console.error("Complete task error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, tasks.length]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!isAuthenticated) return false;

      try {
        setIsLoading(true);
        clearError();

        await taskService.deleteTask(taskId);

        // Remove task from the list if it's loaded
        if (tasks.length > 0) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        }

        showSuccessToast("Task deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage = "Failed to delete task";
        setError(errorMessage);
        handleApiError(err);
        console.error("Delete task error:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, tasks.length]
  );

  // === CONTACTS OPERATIONS ===
  const loadContacts = useCallback(
    async (filters = {}, page = 1, limit = 10) => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        clearError();

        const data = await contactService.loadContacts(filters, page, limit);

        setContacts(data.contacts);
        setContactsPagination({
          currentPage: data.currentPage,
          totalPages: data.numOfPages,
          totalItems: data.totalContacts,
        });

        return data;
      } catch (err) {
        const errorMessage = "Failed to load contacts";
        setError(errorMessage);
        handleApiError(err);
        console.error("Load contacts error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );

  const getContactById = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const contactData = await contactService.getContactById(contactId);
        return contactData;
      } catch (err) {
        const errorMessage = "Failed to load contact details";
        setError(errorMessage);
        handleApiError(err);
        console.error("Get contact error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError]
  );

  const createContact = useCallback(
    async (contactData) => {
      if (!isAuthenticated) return null;

      try {
        // Check if we can create a new contact based on current plan
        const canCreate = accessControl.canCreateContact(
          contactsPagination.totalItems
        );
        if (!canCreate) {
          throw new Error(
            `You've reached the contacts limit for your ${currentPlanData.plan.name} plan`
          );
        }

        setIsLoading(true);
        clearError();

        const createdContact = await contactService.createContact(contactData);

        // Update contacts list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) => [createdContact, ...prevContacts]);
        }

        // Update total count
        setContactsPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems + 1,
        }));

        showSuccessToast("Contact created successfully!");
        return createdContact;
      } catch (err) {
        const errorMessage = err.message || "Failed to create contact";
        setError(errorMessage);
        handleApiError(err);
        console.error("Create contact error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isAuthenticated,
      clearError,
      contacts.length,
      contactsPagination.totalItems,
      accessControl,
      currentPlanData.plan.name,
    ]
  );

  const updateContact = useCallback(
    async (contactId, contactData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedContact = await contactService.updateContact(
          contactId,
          contactData
        );

        // Update contact in the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === contactId ? updatedContact : contact
            )
          );
        }

        showSuccessToast("Contact updated successfully!");
        return updatedContact;
      } catch (err) {
        const errorMessage = "Failed to update contact";
        setError(errorMessage);
        handleApiError(err);
        console.error("Update contact error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  const deleteContact = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return false;

      try {
        setIsLoading(true);
        clearError();

        await contactService.deleteContact(contactId);

        // Remove contact from the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact._id !== contactId)
          );
        }

        // Update total count
        setContactsPagination((prev) => ({
          ...prev,
          totalItems: Math.max(0, prev.totalItems - 1),
        }));

        showSuccessToast("Contact deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage = "Failed to delete contact";
        setError(errorMessage);
        handleApiError(err);
        console.error("Delete contact error:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  const toggleContactFavorite = useCallback(
    async (contactId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedContact = await contactService.toggleContactFavorite(
          contactId
        );

        // Update contact in the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === contactId ? updatedContact : contact
            )
          );
        }

        showSuccessToast(
          updatedContact.favorite
            ? "Contact added to favorites"
            : "Contact removed from favorites"
        );

        return updatedContact;
      } catch (err) {
        const errorMessage = "Failed to update favorite status";
        setError(errorMessage);
        handleApiError(err);
        console.error("Toggle favorite error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  const addInteraction = useCallback(
    async (contactId, interactionData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedContact = await contactService.addInteraction(
          contactId,
          interactionData
        );

        // Update contact in the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === contactId ? updatedContact : contact
            )
          );
        }

        showSuccessToast("Interaction added successfully!");
        return updatedContact;
      } catch (err) {
        const errorMessage = "Failed to add interaction";
        setError(errorMessage);
        handleApiError(err);
        console.error("Add interaction error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  const updateInteraction = useCallback(
    async (contactId, interactionId, interactionData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedContact = await contactService.updateInteraction(
          contactId,
          interactionId,
          interactionData
        );

        // Update contact in the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === contactId ? updatedContact : contact
            )
          );
        }

        showSuccessToast("Interaction updated successfully!");
        return updatedContact;
      } catch (err) {
        const errorMessage = "Failed to update interaction";
        setError(errorMessage);
        handleApiError(err);
        console.error("Update interaction error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  const deleteInteraction = useCallback(
    async (contactId, interactionId) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const updatedContact = await contactService.deleteInteraction(
          contactId,
          interactionId
        );

        // Update contact in the list if it's loaded
        if (contacts.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === contactId ? updatedContact : contact
            )
          );
        }

        showSuccessToast("Interaction deleted successfully!");
        return updatedContact;
      } catch (err) {
        const errorMessage = "Failed to delete interaction";
        setError(errorMessage);
        handleApiError(err);
        console.error("Delete interaction error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, contacts.length]
  );

  // === PAYMENT & PLANS OPERATIONS ===
  const initiatePlanUpgrade = useCallback(
    async (planId, billingType) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const result = await planService.initiatePlanUpgrade(
          planId,
          billingType
        );

        // If the plan is free, update current plan immediately
        if (result.nextStep !== "payment") {
          await currentPlanData.refreshPlan();
          showSuccessToast("Plan upgraded successfully!");
        }

        return result;
      } catch (err) {
        const errorMessage = "Failed to initiate plan upgrade";
        setError(errorMessage);
        handleApiError(err);
        console.error("Plan upgrade error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, currentPlanData]
  );

  // Create payment order
  const createPaymentOrder = useCallback(
    async (planId, billingType) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const orderData = await paymentService.createPaymentOrder(
          planId,
          billingType
        );
        return orderData;
      } catch (err) {
        // Try to refresh token if 401 error
        if (err.response?.status === 401) {
          try {
            await refreshToken();
            // Retry the request after refresh
            const orderData = await paymentService.createPaymentOrder(
              planId,
              billingType
            );
            return orderData;
          } catch (refreshErr) {
            setError("Your session has expired. Please log in again.");
            handleApiError(refreshErr);
            throw refreshErr;
          }
        } else {
          const errorMessage = "Failed to create payment order";
          setError(errorMessage);
          handleApiError(err);
          throw err;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, refreshToken]
  );

  // Verify payment
  const verifyPayment = useCallback(
    async (paymentData) => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        clearError();

        const response = await paymentService.verifyPayment(paymentData);

        // Refresh current plan after successful payment
        await currentPlanData.refreshPlan();
        showSuccessToast("Payment verified successfully!");

        return response;
      } catch (err) {
        // Try to refresh token if 401 error
        if (err.response?.status === 401) {
          try {
            await refreshToken();
            // Retry the request after refresh
            const response = await paymentService.verifyPayment(paymentData);
            await currentPlanData.refreshPlan();
            showSuccessToast("Payment verified successfully!");
            return response;
          } catch (refreshErr) {
            setError("Your session has expired. Please log in again.");
            handleApiError(refreshErr);
            throw refreshErr;
          }
        } else {
          const errorMessage = "Failed to verify payment";
          setError(errorMessage);
          handleApiError(err);
          throw err;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearError, currentPlanData, refreshToken]
  );

  // Get payment history
  const getPaymentHistory = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      setIsLoading(true);
      clearError();

      const transactions = await paymentService.getPaymentHistory();
      return transactions;
    } catch (err) {
      // Try to refresh token if 401 error
      if (err.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request after refresh
          const transactions = await paymentService.getPaymentHistory();
          return transactions;
        } catch (refreshErr) {
          setError("Your session has expired. Please log in again.");
          handleApiError(refreshErr);
          return [];
        }
      } else {
        const errorMessage = "Failed to load payment history";
        setError(errorMessage);
        handleApiError(err);
        return [];
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearError, refreshToken]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      clearError();

      await planService.cancelSubscription();

      // Refresh current plan
      await currentPlanData.refreshPlan();
      showSuccessToast("Subscription cancelled successfully!");

      return true;
    } catch (err) {
      // Try to refresh token if 401 error
      if (err.response?.status === 401) {
        try {
          await refreshToken();
          // Retry the request after refresh
          await planService.cancelSubscription();
          await currentPlanData.refreshPlan();
          showSuccessToast("Subscription cancelled successfully!");
          return true;
        } catch (refreshErr) {
          setError("Your session has expired. Please log in again.");
          handleApiError(refreshErr);
          throw refreshErr;
        }
      } else {
        const errorMessage = "Failed to cancel subscription";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearError, currentPlanData, refreshToken]);

  // Context value
  const contextValue = useMemo(
    () => ({
      // State
      isLoading,
      error,
      jobs,
      jobStats,
      jobsPagination,
      tasks,
      taskStats,
      tasksPagination,
      contacts,
      contactsPagination,
      plans,
      currentPlan: currentPlanData,
      dashboardAnalytics,
      accessControl,

      // Methods
      clearError,
      loadDashboardData,
      loadPlans,
      loadCurrentPlan,

      // Jobs methods
      loadJobs,
      getJobById,
      createJob,
      updateJob,
      deleteJob,
      addInterview,
      updateInterview,
      deleteInterview,

      // Tasks methods
      loadTasks,
      getTaskById,
      createTask,
      updateTask,
      completeTask,
      deleteTask,

      // Contacts methods
      loadContacts,
      getContactById,
      createContact,
      updateContact,
      deleteContact,
      toggleContactFavorite,
      addInteraction,
      updateInteraction,
      deleteInteraction,

      // Payment & Plans methods
      initiatePlanUpgrade,
      createPaymentOrder,
      verifyPayment,
      getPaymentHistory,
      cancelSubscription,
    }),
    [
      isLoading,
      error,
      jobs,
      jobStats,
      jobsPagination,
      tasks,
      taskStats,
      tasksPagination,
      contacts,
      contactsPagination,
      plans,
      currentPlanData,
      dashboardAnalytics,
      accessControl,
      clearError,
      loadDashboardData,
      loadPlans,
      loadCurrentPlan,
      loadJobs,
      getJobById,
      createJob,
      updateJob,
      deleteJob,
      addInterview,
      updateInterview,
      deleteInterview,
      loadTasks,
      getTaskById,
      createTask,
      updateTask,
      completeTask,
      deleteTask,
      loadContacts,
      getContactById,
      createContact,
      updateContact,
      deleteContact,
      toggleContactFavorite,
      addInteraction,
      updateInteraction,
      deleteInteraction,
      initiatePlanUpgrade,
      createPaymentOrder,
      verifyPayment,
      getPaymentHistory,
      cancelSubscription,
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
