// src/components/dashboard/tasks/TasksFilters.js
import React from "react";

const TasksFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority filter */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={filters.priority}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="all">All Categories</option>
            <option value="application">Application</option>
            <option value="networking">Networking</option>
            <option value="interview-prep">Interview Prep</option>
            <option value="skill-development">Skill Development</option>
            <option value="follow-up">Follow-up</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Due date filter */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <select
            id="dueDate"
            name="dueDate"
            value={filters.dueDate}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Next 7 Days</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search}
              onChange={onFilterChange}
              placeholder="Search tasks"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksFilters;
