// src/components/common/Sidebar.js - Fixed version
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { currentPlan } = useData();

  // FIX: Remove this useEffect that was calling loadCurrentPlan on every render
  // The plan data will be loaded by the DataContext initially

  // Define navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      ),
    },
    {
      name: "Applications",
      path: "/applications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
      ),
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857M7 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M17 20H17"
          ></path>
        </svg>
      ),
    },
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
    },
  ];

  // Render nav items with active state
  const renderNavItems = () => {
    return navItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center px-4 py-3 text-sm ${
          location.pathname === item.path
            ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        } transition-colors duration-150`}
      >
        <span className="inline-flex items-center justify-center mr-3">
          {item.icon}
        </span>
        <span>{item.name}</span>
      </Link>
    ));
  };

  // Get plan name safely from the currentPlan object
  const getPlanName = () => {
    if (currentPlan?.plan?.name) {
      return (
        currentPlan.plan.name.charAt(0).toUpperCase() +
        currentPlan.plan.name.slice(1)
      );
    }
    return "Free"; // Default to "Free" if no plan is available
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:z-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">
              PursuitPal
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-500 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="py-4">
          <div className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Main Menu
          </div>
          {renderNavItems()}
        </nav>

        {/* Plan info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Current Plan</p>
              <p className="text-sm font-medium text-gray-800">
                {getPlanName()} Plan
              </p>
            </div>
            <Link
              to="/subscription"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Manage
            </Link>
          </div>
          {currentPlan?.subscription && (
            <div className="mt-1 text-xs text-gray-500">
              {currentPlan.subscription.status === "active" ? (
                <span className="text-green-600">● Active</span>
              ) : (
                <span className="text-yellow-600">● Expiring soon</span>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
