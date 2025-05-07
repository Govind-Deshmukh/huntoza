// src/components/dashboard/applications/ApplicationsHeader.js
import React from "react";
import { Link } from "react-router-dom";

const ApplicationsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Job Applications
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your job applications and track their status
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <Link
          to="/jobs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Application
        </Link>
      </div>
    </div>
  );
};

export default ApplicationsHeader;
