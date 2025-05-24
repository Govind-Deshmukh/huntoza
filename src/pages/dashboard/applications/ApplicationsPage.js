// src/pages/dashboard/ApplicationsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  loadJobs,
  createJob,
  updateJob,
  deleteJob,
  clearError,
} from "../../../store/slices/jobsSlice";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ApplicationsHeader from "../../components/dashboard/applications/ApplicationsHeader";
import ApplicationsFilters from "../../components/dashboard/applications/ApplicationsFilters";
import ApplicationsList from "../../components/dashboard/applications/ApplicationsList";
import EmptyApplicationsState from "../../components/dashboard/applications/EmptyApplicationsState";
import Pagination from "../../components/common/Pagination";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

const ApplicationsPage = () => {
  const dispatch = useAppDispatch();

  // Redux state
  const { jobs, loading, error, pagination } = useAppSelector(
    (state) => state.jobs
  );

  // Local state for filters and UI
  const [filters, setFilters] = useState({
    status: "all",
    jobType: "all",
    search: "",
    sort: "newest",
    favorite: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: "",
  });

  // Load jobs effect
  useEffect(() => {
    dispatch(loadJobs({ filters, page: currentPage, limit: 10 }));
  }, [dispatch, filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(
    async (jobId, newStatus) => {
      try {
        await dispatch(
          updateJob({ jobId, jobData: { status: newStatus } })
        ).unwrap();
      } catch (err) {
        console.error("Error updating job status:", err);
      }
    },
    [dispatch]
  );

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(
    async (jobId, currentFavorite) => {
      try {
        await dispatch(
          updateJob({
            jobId,
            jobData: { favorite: !currentFavorite },
          })
        ).unwrap();
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    },
    [dispatch]
  );

  // Handle delete job - show confirmation modal
  const handleDeleteJob = useCallback(
    (jobId) => {
      const job = jobs.find((j) => j._id === jobId);
      setDeleteModal({
        isOpen: true,
        jobId,
        jobTitle: job ? `${job.position} at ${job.company}` : "this job",
      });
    },
    [jobs]
  );

  // Confirm delete job
  const confirmDeleteJob = useCallback(async () => {
    try {
      await dispatch(deleteJob(deleteModal.jobId)).unwrap();
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: "" });
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  }, [dispatch, deleteModal.jobId]);

  // Cancel delete
  const cancelDelete = useCallback(() => {
    setDeleteModal({ isOpen: false, jobId: null, jobTitle: "" });
  }, []);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

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
          {error && <ErrorAlert message={error} onClose={handleClearError} />}

          {/* Loading state */}
          {loading ? (
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
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={jobs.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={deleteModal.isOpen}
            title="Delete Job Application"
            message={`Are you sure you want to delete "${deleteModal.jobTitle}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDeleteJob}
            onCancel={cancelDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
