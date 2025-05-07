// src/components/dashboard/applications/ApplicationItem.js
import React from "react";
import { Link } from "react-router-dom";
import StatusDropdown from "./StatusDropdown";

const ApplicationItem = ({
  job,
  getStatusBadge,
  formatDate,
  formatJobType,
  handleToggleFavorite,
  handleStatusChange,
  handleDeleteJob,
}) => {
  return (
    <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                <Link to={`/jobs/${job._id}`} className="hover:underline">
                  {job.position}
                </Link>
              </h3>
              {job.priority && (
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : job.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}{" "}
                  Priority
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mt-1">
              <span className="font-medium">{job.company}</span>
              {job.jobType && (
                <>
                  <span className="hidden sm:inline mx-1">•</span>
                  <span>{formatJobType(job.jobType)}</span>
                </>
              )}
              {job.jobLocation && (
                <>
                  <span className="hidden sm:inline mx-1">•</span>
                  <span>{job.jobLocation}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center">
          {/* Status Dropdown */}
          <StatusDropdown
            job={job}
            getStatusBadge={getStatusBadge}
            onStatusChange={handleStatusChange}
          />

          {/* Applied Date */}
          <div className="ml-4 text-xs text-gray-500 text-right">
            Applied: {formatDate(job.applicationDate)}
          </div>

          {/* Action buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              onClick={() => handleToggleFavorite(job._id, job.favorite)}
              className="text-gray-400 hover:text-yellow-500"
            >
              <span className="sr-only">
                {job.favorite ? "Remove from favorites" : "Add to favorites"}
              </span>
              <svg
                className={`h-5 w-5 ${
                  job.favorite ? "text-yellow-400" : "text-gray-400"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            <Link
              to={`/jobs/${job._id}`}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to={`/jobs/edit/${job._id}`}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Edit</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
            <button
              onClick={() => handleDeleteJob(job._id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Delete</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Salary range and interview info */}
      {(job.salary?.min > 0 ||
        job.salary?.max > 0 ||
        job.interviewHistory?.length > 0) && (
        <div className="mt-2 flex items-center text-xs text-gray-600 space-x-4">
          {/* Salary */}
          {(job.salary?.min > 0 || job.salary?.max > 0) && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-gray-400 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {job.salary.min > 0
                  ? `${job.salary.currency || "$"}${job.salary.min}`
                  : ""}
                {job.salary.min > 0 && job.salary.max > 0 ? " - " : ""}
                {job.salary.max > 0
                  ? `${job.salary.currency || "$"}${job.salary.max}`
                  : ""}
              </span>
            </div>
          )}

          {/* Interview count */}
          {job.interviewHistory?.length > 0 && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-gray-400 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {job.interviewHistory.length}{" "}
                {job.interviewHistory.length === 1 ? "Interview" : "Interviews"}
              </span>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ApplicationItem;
