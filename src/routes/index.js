import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import SessionManager from "../utils/SessionManager";

// Import your page components
import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import ApplicationsPage from "../pages/dashboard/applications/ApplicationsPage";
import TasksPage from "../pages/dashboard/tasks/TasksPage";
import ContactPage from "../pages/dashboard/contacts/ContactPage";
// Import other page components as needed

const AppRoutes = () => {
  return (
    <>
      {/* SessionManager to handle auth events globally */}
      <SessionManager />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          {/* Add other protected routes */}
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
