// src/pages/dashboard/applications/ApplicationsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ApplicationsHeader from "../../../components/dashboard/applications/ApplicationsHeader";
import ApplicationsFilters from "../../../components/dashboard/applications/ApplicationsFilters";
import ApplicationsList from "../../../components/dashboard/applications/ApplicationsList";
import EmptyApplicationsState from "../../../components/dashboard/applications/EmptyApplicationsState";
import Pagination from "../../../components/common/Pagination";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
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
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            title="Delete job application"
            message="Are you sure you want to delete this job application? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDeleteJob}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setJobToDelete(null);
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
