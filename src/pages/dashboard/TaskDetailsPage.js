TaskDetailsPage;
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, completeTask, deleteTask, isLoading, error } = useData();
  const [task, setTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTaskById(id);
        setTask(taskData);
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, getTaskById]);

  // Handle task completion
  const handleCompleteTask = async () => {
    try {
      await completeTask(id);
      // Refresh task data
      const updatedTask = await getTaskById(id);
      setTask(updatedTask);
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    try {
      await deleteTask(id);
      navigate("/tasks");
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return "Not categorized";
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get status badge
  const getStatusBadge = (status) => {
    let bgColor;
    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "in-progress":
        bgColor = "bg-blue-100 text-blue-800";
        break;
      case "completed":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "cancelled":
        bgColor = "bg-gray-100 text-gray-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
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
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
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
          ) : !task ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                ></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Task not found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This task may have been deleted or doesn't exist.
              </p>
              <div className="mt-6">
                <Link
                  to="/tasks"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Tasks
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Task header */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center">
                    {/* Checkbox for completion */}
                    <div className="mr-4">
                      {task.status === "completed" ? (
                        <button
                          className="h-6 w-6 rounded-full flex items-center justify-center bg-blue-600 focus:outline-none"
                          disabled
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={handleCompleteTask}
                          className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <span className="sr-only">Complete task</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        {task.title}
                      </h1>
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-600 gap-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                        <span className="text-gray-500">
                          {formatCategory(task.category)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    {task.dueDate && (
                      <div
                        className={`text-sm ${
                          isOverdue(task.dueDate) && task.status !== "completed"
                            ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {formatDate(task.dueDate)}
                        {formatTime(task.dueDate) &&
                          ` at ${formatTime(task.dueDate)}`}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(task.createdAt)}
                    </div>
                    {task.completedAt && (
                      <div className="text-sm text-green-600">
                        Completed: {formatDate(task.completedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/tasks/edit/${task._id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                      >
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                      >
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4"
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
                        Delete
                      </button>
                    </div>

                    {task.status !== "completed" && (
                      <button
                        type="button"
                        onClick={handleCompleteTask}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                      >
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Task details */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Task Details
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {task.description || "No description provided"}
                      </dd>
                    </div>

                    {task.relatedJob && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Related Job
                        </dt>
                        <dd className="mt-1 text-sm text-blue-600">
                          <Link
                            to={`/jobs/${task.relatedJob._id}`}
                            className="hover:underline"
                          >
                            {task.relatedJob.company} -{" "}
                            {task.relatedJob.position}
                          </Link>
                        </dd>
                      </div>
                    )}

                    {task.relatedContact && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Related Contact
                        </dt>
                        <dd className="mt-1 text-sm text-blue-600">
                          <Link
                            to={`/contacts/${task.relatedContact._id}`}
                            className="hover:underline"
                          >
                            {task.relatedContact.name}
                            {task.relatedContact.company &&
                              ` (${task.relatedContact.company})`}
                          </Link>
                        </dd>
                      </div>
                    )}

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Last Updated
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(task.updatedAt)}
                      </dd>
                    </div>

                    {task.reminder && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Reminder
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(task.reminder)} at{" "}
                          {formatTime(task.reminder)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Delete confirmation modal */}
              {showDeleteConfirm && (
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
                              Delete task
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to delete this task? This
                                action cannot be undone.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={handleDelete}
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
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskDetailsPage;
