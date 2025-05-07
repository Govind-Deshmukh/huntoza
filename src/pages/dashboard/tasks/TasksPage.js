// src/pages/dashboard/tasks/TasksPage.js
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useData } from "../../../context/DataContext";
import TasksHeader from "../../../components/dashboard/tasks/TasksHeader";
import TasksFilters from "../../../components/dashboard/tasks/TasksFilters";
import TasksList from "../../../components/dashboard/tasks/TasksList";
import EmptyTasksState from "../../../components/dashboard/tasks/EmptyTasksState";
import TasksPagination from "../../../components/dashboard/tasks/TasksPagination";

const TasksPage = () => {
  const {
    tasks,
    tasksPagination,
    isLoading,
    error,
    loadTasks,
    completeTask,
    deleteTask,
  } = useData();

  // State for filtering and sorting
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
    sort: "dueDate-asc",
    dueDate: "",
  });

  // Current page
  const [currentPage, setCurrentPage] = useState(1);

  // Load tasks with defined callback to prevent infinite loop
  const fetchTasks = useCallback(() => {
    loadTasks(filters, currentPage);
  }, [loadTasks, filters, currentPage]);

  // Load tasks on component mount and when filters or page changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle task completion
  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      // The tasks list will be updated through the context
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        // The tasks list will be updated through the context
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  // Format due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return "No due date";

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (dueDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // For other dates, format as "Mon, Jan 1"
    return dueDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Continuing the TasksPage component:

  // Get priority badge
  const getPriorityBadge = (priority) => {
    let bgColor;
    switch (priority) {
      case "high":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "medium":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "low":
        bgColor = "bg-green-100 text-green-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TasksHeader />

          <TasksFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Error display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="bg-white shadow rounded-lg p-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyTasksState />
          ) : (
            <div>
              {/* Tasks list */}
              <TasksList
                tasks={tasks}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                formatDueDate={formatDueDate}
                isOverdue={isOverdue}
                getPriorityBadge={getPriorityBadge}
              />

              {/* Pagination */}
              {tasksPagination.numOfPages > 1 && (
                <TasksPagination
                  currentPage={currentPage}
                  totalPages={tasksPagination.numOfPages}
                  totalItems={tasksPagination.totalItems}
                  itemsPerPage={tasks.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
