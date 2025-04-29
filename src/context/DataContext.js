import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosConfig";
import { useAuth } from "./AuthContext";

// Create context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Jobs state
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
  const [currentPlan, setCurrentPlan] = useState(null);

  // Analytics state
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);

  // Clear error
  const clearError = () => setError(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get("/analytics/dashboard");
      setDashboardAnalytics(response.data.data);

      // Set job stats from analytics
      setJobStats(response.data.data.applicationStats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error("Dashboard data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load plans
  const loadPlans = async () => {
    try {
      setIsLoading(true);
      clearError();

      const response = await api.get("/plans");
      setPlans(response.data.plans);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load plans");
      console.error("Load plans error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load current plan
  const loadCurrentPlan = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get("/plans/user/current");
      setCurrentPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load current plan");
      console.error("Load current plan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // === JOBS OPERATIONS ===

  // Load jobs with optional filters
  const loadJobs = async (filters = {}, page = 1, limit = 10) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      });

      const response = await api.get(`/jobs?${queryParams}`);

      setJobs(response.data.jobs);
      setJobsPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.numOfPages,
        totalItems: response.data.totalJobs,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load jobs");
      console.error("Load jobs error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get job by ID
  const getJobById = async (jobId) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get(`/jobs/${jobId}`);
      return response.data.job;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job details");
      console.error("Get job error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create job
  const createJob = async (jobData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/jobs", jobData);

      // Update jobs list if it's loaded
      if (jobs.length > 0) {
        setJobs([response.data.job, ...jobs]);
      }

      return response.data.job;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
      console.error("Create job error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update job
  const updateJob = async (jobId, jobData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.patch(`/jobs/${jobId}`, jobData);

      // Update job in the list if it's loaded
      if (jobs.length > 0) {
        setJobs(
          jobs.map((job) => (job._id === jobId ? response.data.job : job))
        );
      }

      return response.data.job;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
      console.error("Update job error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      clearError();

      await api.delete(`/jobs/${jobId}`);

      // Remove job from the list if it's loaded
      if (jobs.length > 0) {
        setJobs(jobs.filter((job) => job._id !== jobId));
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
      console.error("Delete job error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add interview to job
  const addInterview = async (jobId, interviewData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post(
        `/jobs/${jobId}/interviews`,
        interviewData
      );

      // Update job in the list if it's loaded
      if (jobs.length > 0) {
        setJobs(
          jobs.map((job) => (job._id === jobId ? response.data.job : job))
        );
      }

      return response.data.job;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add interview");
      console.error("Add interview error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // === TASKS OPERATIONS ===

  // Load tasks with optional filters
  const loadTasks = async (filters = {}, page = 1, limit = 10) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      });

      const response = await api.get(`/tasks?${queryParams}`);

      setTasks(response.data.tasks);
      setTasksPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.numOfPages,
        totalItems: response.data.totalTasks,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
      console.error("Load tasks error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get task by ID
  const getTaskById = async (taskId) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get(`/tasks/${taskId}`);
      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load task details");
      console.error("Get task error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create task
  const createTask = async (taskData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/tasks", taskData);

      // Update tasks list if it's loaded
      if (tasks.length > 0) {
        setTasks([response.data.task, ...tasks]);
      }

      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
      console.error("Create task error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.patch(`/tasks/${taskId}`, taskData);

      // Update task in the list if it's loaded
      if (tasks.length > 0) {
        setTasks(
          tasks.map((task) => (task._id === taskId ? response.data.task : task))
        );
      }

      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
      console.error("Update task error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark task as completed
  const completeTask = async (taskId) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.patch(`/tasks/${taskId}/complete`);

      // Update task in the list if it's loaded
      if (tasks.length > 0) {
        setTasks(
          tasks.map((task) => (task._id === taskId ? response.data.task : task))
        );
      }

      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete task");
      console.error("Complete task error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      clearError();

      await api.delete(`/tasks/${taskId}`);

      // Remove task from the list if it's loaded
      if (tasks.length > 0) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
      console.error("Delete task error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // === CONTACTS OPERATIONS ===

  // Load contacts with optional filters
  const loadContacts = async (filters = {}, page = 1, limit = 10) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      clearError();

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      });

      const response = await api.get(`/contacts?${queryParams}`);

      setContacts(response.data.contacts);
      setContactsPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.numOfPages,
        totalItems: response.data.totalContacts,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contacts");
      console.error("Load contacts error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get contact by ID
  const getContactById = async (contactId) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get(`/contacts/${contactId}`);
      return response.data.contact;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contact details");
      console.error("Get contact error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create contact
  const createContact = async (contactData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/contacts", contactData);

      // Update contacts list if it's loaded
      if (contacts.length > 0) {
        setContacts([response.data.contact, ...contacts]);
      }

      return response.data.contact;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contact");
      console.error("Create contact error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update contact
  const updateContact = async (contactId, contactData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.patch(`/contacts/${contactId}`, contactData);

      // Update contact in the list if it's loaded
      if (contacts.length > 0) {
        setContacts(
          contacts.map((contact) =>
            contact._id === contactId ? response.data.contact : contact
          )
        );
      }

      return response.data.contact;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update contact");
      console.error("Update contact error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      clearError();

      await api.delete(`/contacts/${contactId}`);

      // Remove contact from the list if it's loaded
      if (contacts.length > 0) {
        setContacts(contacts.filter((contact) => contact._id !== contactId));
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete contact");
      console.error("Delete contact error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite status for contact
  const toggleContactFavorite = async (contactId) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.patch(`/contacts/${contactId}/favorite`);

      // Update contact in the list if it's loaded
      if (contacts.length > 0) {
        setContacts(
          contacts.map((contact) =>
            contact._id === contactId ? response.data.contact : contact
          )
        );
      }

      return response.data.contact;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update favorite status"
      );
      console.error("Toggle favorite error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // === PAYMENT & PLANS OPERATIONS ===

  // Initiate plan upgrade
  const initiatePlanUpgrade = async (planId, billingType) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/plans/upgrade", {
        planId,
        billingType,
      });

      // If the plan is free, update current plan immediately
      if (response.data.nextStep !== "payment") {
        await loadCurrentPlan();
      }

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to initiate plan upgrade"
      );
      console.error("Plan upgrade error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create payment order
  const createPaymentOrder = async (planId, billingType) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/payments/create-order", {
        planId,
        billingType,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create payment order");
      console.error("Create payment order error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify payment
  const verifyPayment = async (paymentData) => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      clearError();

      const response = await api.post("/payments/verify", paymentData);

      // Refresh current plan after successful payment
      await loadCurrentPlan();

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify payment");
      console.error("Verify payment error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get payment history
  const getPaymentHistory = async () => {
    if (!isAuthenticated) return [];

    try {
      setIsLoading(true);
      clearError();

      const response = await api.get("/payments/history");
      return response.data.transactions;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payment history");
      console.error("Payment history error:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      clearError();

      await api.post("/plans/cancel");

      // Refresh current plan
      await loadCurrentPlan();

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel subscription");
      console.error("Cancel subscription error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue = {
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
    currentPlan,
    dashboardAnalytics,

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

    // Payment & Plans methods
    initiatePlanUpgrade,
    createPaymentOrder,
    verifyPayment,
    getPaymentHistory,
    cancelSubscription,
  };

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
