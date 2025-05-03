import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/protectedRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Job Related Pages
import JobDetailsPage from "./pages/dashboard/JobDetailsPage";
import InterviewFormPage from "./pages/dashboard/InterviewFormPage";

// Task Related Pages
import TasksPage from "./pages/dashboard/TasksPage";
import TaskDetailsPage from "./pages/dashboard/TaskDetailsPage";
import TaskFormPage from "./pages/dashboard/TaskFormPage";

// Contact Related Pages
import ContactPage from "./pages/dashboard/ContactPage";
import ContactDetailsPage from "./pages/dashboard/ContactDetailsPage";
import ContactFormPage from "./pages/dashboard/ContactFormPage";

// Plan and Payment Pages
import PaymentHistoryPage from "./pages/dashboard/PaymentHistoryPage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import JobFormPage from "./pages/dashboard/JobFormPage";
import HomePage from "./pages/home/HomePage";
import PaymentPage from "./pages/payment/PaymentPage";
import PlansPage from "./pages/dashboard/PlansPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/plans" element={<PlansPage />} />
                {/* Jobs Routes */}
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

                {/* Tasks Routes */}
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<TaskFormPage />} />
                <Route path="/tasks/edit/:id" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskDetailsPage />} />

                {/* Contacts Routes */}
                <Route path="/contacts" element={<ContactPage />} />
                <Route path="/contacts/new" element={<ContactFormPage />} />
                <Route
                  path="/contacts/edit/:id"
                  element={<ContactFormPage />}
                />
                <Route path="/contacts/:id" element={<ContactDetailsPage />} />

                {/* Plan and Payment Routes */}
                <Route path="/payment" element={<PaymentPage />} />
                <Route
                  path="/payment-history"
                  element={<PaymentHistoryPage />}
                />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Route>

              {/* Redirect to dashboard if authenticated, otherwise to login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-screen">
                    Page not found
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
