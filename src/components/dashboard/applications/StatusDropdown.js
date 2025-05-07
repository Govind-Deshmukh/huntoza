// src/components/dashboard/applications/StatusDropdown.js
import React, { useState } from "react";

const StatusDropdown = ({ job, getStatusBadge, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
    { value: "saved", label: "Saved" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        type="button"
        className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        {getStatusBadge(job.status)}
        <svg
          className="ml-1 h-4 w-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showDropdown && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(job._id, option.value);
                  setShowDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  job.status === option.value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
