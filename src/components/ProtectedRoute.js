import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./common/LoadingSpinner";

const ProtectedRoute = () => {
  // Get auth state from Redux instead of context
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
