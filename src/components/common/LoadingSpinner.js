// src/components/common/LoadingSpinner.js
import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6 border-t-1 border-b-1",
    medium: "h-12 w-12 border-t-2 border-b-2",
    large: "h-16 w-16 border-t-3 border-b-3",
  };

  return (
    <div className="flex justify-center my-8">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-500`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
