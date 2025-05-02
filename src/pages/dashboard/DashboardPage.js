import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useAuth();

  // Mock stats for demonstration
  const stats = [
    {
      name: "Total Applications",
      value: "24",
      icon: (
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
      ),
    },
    {
      name: "Active Applications",
      value: "10",
      icon: (
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
      ),
    },
    {
      name: "Interviews Scheduled",
      value: "4",
      icon: (
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
      ),
    },
    {
      name: "Offers",
      value: "1",
      icon: (
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
      ),
    },
  ];

  // Recent applications (mock data)
  const recentApplications = [
    {
      id: 1,
      company: "Acme Inc",
      position: "Frontend Developer",
      date: "2023-04-10",
      status: "Applied",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      company: "Tech Solutions",
      position: "Full Stack Engineer",
      date: "2023-04-08",
      status: "Phone Screen",
      statusColor: "bg-purple-100 text-purple-800",
    },
    {
      id: 3,
      company: "Global Systems",
      position: "React Developer",
      date: "2023-04-05",
      status: "Interview",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: 4,
      company: "InnovateCorp",
      position: "UI/UX Developer",
      date: "2023-04-01",
      status: "Offer",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  // Upcoming tasks (mock data)
  const upcomingTasks = [
    {
      id: 1,
      title: "Interview with Acme Inc",
      date: "Today, 2:00 PM",
      type: "Interview",
    },
    {
      id: 2,
      title: "Follow up with Tech Solutions",
      date: "Tomorrow, 10:00 AM",
      type: "Follow-up",
    },
    {
      id: 3,
      title: "Update resume for Senior position",
      date: "Apr 15, 2023",
      type: "Task",
    },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              <div className="p-3 rounded-full bg-gray-50 mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
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
                    {recentApplications.map((app) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View all applications →
                </button>
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
                {upcomingTasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">{task.date}</p>
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
                ))}
              </ul>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View all tasks →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity chart (placeholder) */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Activity Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">
                Activity chart will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
