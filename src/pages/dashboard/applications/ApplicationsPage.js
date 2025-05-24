// src/pages/dashboard/applications/ApplicationsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ApplicationsHeader from "../../../components/dashboard/applications/ApplicationsHeader";
import ApplicationsFilters from "../../../components/dashboard/applications/ApplicationsFilters";
import ApplicationsList from "../../../components/dashboard/applications/ApplicationsList";
import EmptyApplicationsState from "../../../components/dashboard/applications/EmptyApplicationsState";
import Pagination from "../../../components/common/Pagination";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorAlert from "../../../components/common/ErrorAlert";

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const {
    jobs,
    jobsPagination,
    loadJobs,
    updateJob,
    deleteJob,
    isLoading,
    error,
    clearError,
  } = useData();

  // State for filtering and sorting
  const [filters, setFilters] = useState({
    status: "all",
    jobType: "all",
    search: "",
    sort: "newest",
    favorite: "",
  });

  // Current page
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Load jobs with defined callback to avoid infinite loop
  const fetchJobs = useCallback(() => {
    loadJobs(filters, currentPage);
  }, [loadJobs, filters, currentPage]);

  // Load jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle status change
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
      // Jobs list will be updated through the context
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (jobId, currentFavorite) => {
    try {
      await updateJob(jobId, { favorite: !currentFavorite });
      // Jobs list will be updated through the context
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // Handle job deletion
  const handleDeleteJob = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  // Confirm delete job
  const confirmDeleteJob = async () => {
    if (jobToDelete && jobToDelete._id) {
      try {
        await deleteJob(jobToDelete._id);
        setShowDeleteConfirm(false);
        setJobToDelete(null);
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  // Format job type for display
  const formatJobType = (jobType) => {
    if (!jobType) return "";
    return jobType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge with appropriate color
  const getStatusBadge = (status) => {
    let bgColor;
    switch (status) {
      case "applied":
        bgColor = "bg-blue-100 text-blue-800";
        break;
      case "screening":
        bgColor = "bg-purple-100 text-purple-800";
        break;
      case "interview":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "offer":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "rejected":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "withdrawn":
        bgColor = "bg-gray-100 text-gray-800";
        break;
      case "saved":
        bgColor = "bg-indigo-100 text-indigo-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApplicationsHeader />

          <ApplicationsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Error display */}
          {error && <ErrorAlert message={error} />}

          {/* Loading state */}
          {isLoading ? (
            <LoadingSpinner />
          ) : jobs.length === 0 ? (
            <EmptyApplicationsState />
          ) : (
            <div>
              {/* Jobs list */}
              <ApplicationsList
                jobs={jobs}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                formatJobType={formatJobType}
                handleToggleFavorite={handleToggleFavorite}
                handleStatusChange={handleStatusChange}
                handleDeleteJob={handleDeleteJob}
              />

              {/* Pagination */}
              {jobsPagination.numOfPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={jobsPagination.numOfPages}
                  totalItems={jobsPagination.totalItems}
                  itemsPerPage={jobs.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && jobToDelete && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg
                          className="h-6 w-6 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Delete job application
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this job
                            application? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={confirmDeleteJob}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
