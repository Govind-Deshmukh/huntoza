// src/pages/dashboard/DashboardPage.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { loadDashboardData } from "../../store/slices/analyticsSlice";
import { loadJobs } from "../../store/slices/jobsSlice";
import { loadTasks } from "../../store/slices/tasksSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    dashboardData,
    loading: analyticsLoading,
    error: analyticsError,
  } = useSelector((state) => state.analytics);
  const { jobs } = useSelector((state) => state.jobs);
  const { tasks } = useSelector((state) => state.tasks);
  const isLoading = analyticsLoading;

  useEffect(() => {
    // Load dashboard analytics data
    dispatch(loadDashboardData());

    // Load recent jobs with limit
    dispatch(
      loadJobs({
        filters: { sort: "newest" },
        page: 1,
        limit: 4,
      })
    );

    // Load upcoming tasks with custom filters
    dispatch(
      loadTasks({
        filters: { status: "pending", sort: "dueDate-asc" },
        page: 1,
        limit: 3,
      })
    );
  }, [dispatch]);

  // Generate status badge with appropriate color
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format task due date for display
  const formatTaskDate = (dateString) => {
    if (!dateString) return "No due date";

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return (
        "Today, " +
        dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return (
        "Tomorrow, " +
        dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Get analytics stats from real data
  const getAnalyticsStats = () => {
    if (!dashboardData || !dashboardData.applicationStats) {
      return [
        { name: "Total Applications", value: "0", icon: applicationIcon() },
        { name: "Active Applications", value: "0", icon: activeIcon() },
        { name: "Interviews", value: "0", icon: interviewIcon() },
        { name: "Offers", value: "0", icon: offerIcon() },
      ];
    }

    const stats = dashboardData.applicationStats;

    // Calculate active applications (applied + screening + interview)
    const activeApps =
      (stats.applied || 0) + (stats.screening || 0) + (stats.interview || 0);

    return [
      {
        name: "Total Applications",
        value: stats.total || "0",
        icon: applicationIcon(),
      },
      { name: "Active Applications", value: activeApps, icon: activeIcon() },
      {
        name: "Interviews",
        value: stats.interview || "0",
        icon: interviewIcon(),
      },
      { name: "Offers", value: stats.offer || "0", icon: offerIcon() },
    ];
  };

  // Icon components
  const applicationIcon = () => (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
  );

  const activeIcon = () => (
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );

  const interviewIcon = () => (
    <svg
      className="w-6 h-6 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      ></path>
    </svg>
  );

  const offerIcon = () => (
    <svg
      className="w-6 h-6 text-yellow-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      ></path>
    </svg>
  );

  return (
    <DashboardLayout>
      <div className="py-4">
        {/* Welcome message */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your job applications today.
          </p>
        </div>

        {analyticsError && <ErrorAlert message={analyticsError} />}

        {/* Stats cards */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {getAnalyticsStats().map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white rounded-lg shadow p-4 flex items-center"
                >
                  <div className="p-3 rounded-full bg-gray-50 mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent applications */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">
                    Recent Applications
                  </h2>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Company
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Position
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.length > 0 ? (
                          jobs.map((job) => (
                            <tr key={job._id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {job.company}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {job.position}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(job.applicationDate)}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {getStatusBadge(job.status)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-4 text-center text-sm text-gray-500"
                            >
                              No applications found. Start tracking your job
                              search!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      to="/applications"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all applications →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Upcoming tasks */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">
                    Upcoming Tasks
                  </h2>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <li key={task._id} className="py-3">
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTaskDate(task.dueDate)}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  task.category === "interview-prep"
                                    ? "bg-purple-100 text-purple-800"
                                    : task.category === "follow-up"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.category
                                  ? task.category
                                      .split("-")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")
                                  : "Task"}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="py-3 text-center text-sm text-gray-500">
                        No upcoming tasks. Add some to stay organized!
                      </li>
                    )}
                  </ul>
                  <div className="mt-4 text-center">
                    <Link
                      to="/tasks"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all tasks →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
