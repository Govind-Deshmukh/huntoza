// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth pages
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
import TasksPage from "./pages/dashboard/tasks/TasksPage";
import TaskFormPage from "./pages/dashboard/tasks/TaskFormPage";
import TaskDetailsPage from "./pages/dashboard/tasks/TaskDetailsPage";
import ContactPage from "./pages/dashboard/contacts/ContactPage";
import ContactFormPage from "./pages/dashboard/contacts/ContactFormPage";
import ContactDetailsPage from "./pages/dashboard/contacts/ContactDetailsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import PlansPage from "./pages/dashboard/PlansPage";
import PaymentHistoryPage from "./pages/dashboard/PaymentHistoryPage";
import PaymentPage from "./pages/payment/PaymentPage";

// Auth protection
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  // Check for existing session on app load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes */}
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

          {/* User routes */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Subscription routes */}
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
