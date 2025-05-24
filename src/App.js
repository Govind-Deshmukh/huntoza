// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux Store
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { getCurrentUser } from "./store/slices/authSlice";

// Context Providers (keeping DataContext for now during migration)
import { DataProvider } from "./context/DataContext";

// Components
import ProtectedRoute from "./components/protectedRoute";

// Public Pages
import HomePage from "./pages/home/HomePage";
import ContactUsPage from "./pages/contact/ContactUsPage";
import PrivacyPolicy from "./pages/privacy/PrivacyPolicy";
import TermsOfUse from "./pages/terms/TermsOfUse";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard Pages
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
import PlansPage from "./pages/dashboard/PlansPage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import PaymentHistoryPage from "./pages/dashboard/PaymentHistoryPage";
import PaymentPage from "./pages/payment/PaymentPage";

// App content component that uses Redux hooks
const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Check for existing session on app load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />

            {/* Auth Routes - Redirect to dashboard if already authenticated */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignupPage />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ForgotPasswordPage />
                )
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ResetPasswordPage />
                )
              }
            />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Applications Routes */}
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="jobs/new" element={<JobFormPage />} />
              <Route path="jobs/edit/:id" element={<JobFormPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route
                path="jobs/:jobId/interviews/new"
                element={<InterviewFormPage />}
              />
              <Route
                path="jobs/:jobId/interviews/edit/:interviewId"
                element={<InterviewFormPage />}
              />

              {/* Tasks Routes */}
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/new" element={<TaskFormPage />} />
              <Route path="tasks/edit/:id" element={<TaskFormPage />} />
              <Route path="tasks/:id" element={<TaskDetailsPage />} />

              {/* Contacts Routes */}
              <Route path="contacts" element={<ContactPage />} />
              <Route path="contacts/new" element={<ContactFormPage />} />
              <Route path="contacts/edit/:id" element={<ContactFormPage />} />
              <Route path="contacts/:id" element={<ContactDetailsPage />} />

              {/* Profile and Settings */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="payment-history" element={<PaymentHistoryPage />} />
              <Route path="payment" element={<PaymentPage />} />
            </Route>

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to home */}
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
              }
            />
          </Routes>

          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </DataProvider>
  );
};

// Main App component with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
