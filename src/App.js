// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./store/slices/authSlice";

// Authentication pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ApplicationsPage from "./pages/dashboard/applications/ApplicationsPage";
import JobFormPage from "./pages/dashboard/applications/JobFormPage";
import JobDetailsPage from "./pages/dashboard/applications/JobDetailsPage";
import InterviewFormPage from "./pages/dashboard/applications/InterviewFormPage";

// Tasks pages
import TasksPage from "./pages/dashboard/tasks/TasksPage";
import TaskFormPage from "./pages/dashboard/tasks/TaskFormPage";
import TaskDetailsPage from "./pages/dashboard/tasks/TaskDetailsPage";

// Contacts pages
import ContactPage from "./pages/dashboard/contacts/ContactPage";
import ContactFormPage from "./pages/dashboard/contacts/ContactFormPage";
import ContactDetailsPage from "./pages/dashboard/contacts/ContactDetailsPage";

// Profile & Subscription pages
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import PaymentHistoryPage from "./pages/dashboard/PaymentHistoryPage";
import PlansPage from "./pages/dashboard/PlansPage";
import PaymentPage from "./pages/payment/PaymentPage";

// Protected route component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check for existing user session on app load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes (available when not logged in) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected routes (require authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Applications routes */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/jobs/new" element={<JobFormPage />} />
        <Route path="/jobs/edit/:id" element={<JobFormPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route
          path="/jobs/:jobId/interviews/new"
          element={<InterviewFormPage />}
        />
        <Route
          path="/jobs/:jobId/interviews/edit/:interviewId"
          element={<InterviewFormPage />}
        />

        {/* Tasks routes */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/edit/:id" element={<TaskFormPage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />

        {/* Contacts routes */}
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/contacts/new" element={<ContactFormPage />} />
        <Route path="/contacts/edit/:id" element={<ContactFormPage />} />
        <Route path="/contacts/:id" element={<ContactDetailsPage />} />

        {/* Profile & Subscription */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment-history" element={<PaymentHistoryPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
