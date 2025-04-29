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
import SignupWithPlanPage from "./pages/auth/SignupWithPlanPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Plan and Payment Pages
import PlansPage from "./pages/plans/PlansPage";
import PaymentPage from "./pages/plans/PaymentPage";
import PaymentHistoryPage from "./pages/plans/PaymentHistoryPage";
import SubscriptionPage from "./pages/plans/SubscriptionPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/register-plan" element={<SignupWithPlanPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Plan and Payment Routes */}
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route
                  path="/payment-history"
                  element={<PaymentHistoryPage />}
                />
                <Route path="/subscription" element={<SubscriptionPage />} />

                {/* Add other protected routes here */}
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
