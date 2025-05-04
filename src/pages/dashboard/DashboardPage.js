// Enhanced DashboardPage with API integration
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    dashboardAnalytics,
    loadDashboardData,
    currentPlan,
    loadCurrentPlan,
    jobs,
    loadJobs,
    tasks,
    loadTasks,
    isLoading,
    error,
  } = useData();

  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // Load all necessary data for dashboard
    const loadDashboardContent = async () => {
      await loadDashboardData();
      await loadCurrentPlan();

      // Load recent jobs with limit
      await loadJobs({ sort: "newest" }, 1, 4);

      // Load upcoming tasks with custom filters
      await loadTasks({ status: "pending", sort: "dueDate-asc" }, 1, 3);
    };

    loadDashboardContent();
  }, [loadDashboardData, loadCurrentPlan, loadJobs, loadTasks]);

  // Process jobs data for display
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const formattedJobs = jobs.map((job) => ({
        id: job._id,
        company: job.company,
        position: job.position,
        date: new Date(job.applicationDate).toISOString().slice(0, 10),
        status: job.status.charAt(0).toUpperCase() + job.status.slice(1),
        statusColor: getStatusColor(job.status),
      }));
      setRecentApplications(formattedJobs);
    }
  }, [jobs]);

  // Process tasks data for display
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.map((task) => ({
        id: task._id,
        title: task.title,
        date: formatTaskDate(task.dueDate),
        type: formatTaskCategory(task.category),
      }));
      setUpcomingTasks(formattedTasks);
    }
  }, [tasks]);

  // Helper function to format task date for display
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

  // Helper function to format task category
  const formatTaskCategory = (category) => {
    if (!category) return "Task";

    const categoryMap = {
      application: "Application",
      networking: "Networking",
      "interview-prep": "Interview",
      "follow-up": "Follow-up",
      "skill-development": "Learning",
      other: "Task",
    };

    return categoryMap[category] || "Task";
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colorMap = {
      applied: "bg-blue-100 text-blue-800",
      screening: "bg-purple-100 text-purple-800",
      interview: "bg-yellow-100 text-yellow-800",
      offer: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
      saved: "bg-indigo-100 text-indigo-800",
    };

    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  // Get analytics stats from real data
  const getAnalyticsStats = () => {
    if (!dashboardAnalytics || !dashboardAnalytics.applicationStats) {
      return [
        { name: "Total Applications", value: "0", icon: applicationIcon() },
        { name: "Active Applications", value: "0", icon: activeIcon() },
        { name: "Interviews", value: "0", icon: interviewIcon() },
        { name: "Offers", value: "0", icon: offerIcon() },
      ];
    }

    const stats = dashboardAnalytics.applicationStats;

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

        {/* Stats cards */}
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
                        {recentApplications.length > 0 ? (
                          recentApplications.map((app) => (
                            <tr key={app.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {app.company}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {app.position}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {app.date}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.statusColor}`}
                                >
                                  {app.status}
                                </span>
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
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map((task) => (
                        <li key={task.id} className="py-3">
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {task.date}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  task.type === "Interview"
                                    ? "bg-purple-100 text-purple-800"
                                    : task.type === "Follow-up"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.type}
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
