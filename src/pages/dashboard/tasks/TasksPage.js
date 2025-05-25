// src/pages/dashboard/tasks/TasksPage.js
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  loadTasks,
  completeTask,
  deleteTask,
} from "../../../store/slices/tasksSlice";
import TasksHeader from "../../../components/dashboard/tasks/TasksHeader";
import TasksFilters from "../../../components/dashboard/tasks/TasksFilters";
import TasksList from "../../../components/dashboard/tasks/TasksList";
import EmptyTasksState from "../../../components/dashboard/tasks/EmptyTasksState";
import Pagination from "../../../components/common/Pagination";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorAlert from "../../../components/common/ErrorAlert";

const TasksPage = () => {
  const dispatch = useDispatch();

  // Get state from Redux store
  const tasks = useSelector((state) => state.tasks.tasks);
  const pagination = useSelector((state) => state.tasks.pagination);
  const isLoading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

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
    dispatch(loadTasks({ filters, page: currentPage }));
  }, [dispatch, filters, currentPage]);

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
      await dispatch(completeTask(taskId)).unwrap();
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
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
          <ErrorAlert message={error} />

          {isLoading ? (
            <LoadingSpinner />
          ) : tasks.length === 0 ? (
            <EmptyTasksState />
          ) : (
            <div>
              <TasksList
                tasks={tasks}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                formatDueDate={formatDueDate}
                isOverdue={isOverdue}
                getPriorityBadge={getPriorityBadge}
              />

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
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
