// src/components/dashboard/applications/ApplicationsFilters.js
import React from "react";

const ApplicationsFilters = ({ filters, onFilterChange }) => {
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
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="saved">Saved</option>
          </select>
        </div>

        {/* Favorites filter */}
        <div>
          <label
            htmlFor="favorite"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Favorites
          </label>
          <select
            id="favorite"
            name="favorite"
            value={filters.favorite}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="">All Applications</option>
            <option value="true">Favorites Only</option>
          </select>
        </div>

        {/* Sort filter */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={onFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a-z">Company (A-Z)</option>
            <option value="z-a">Company (Z-A)</option>
            <option value="priority-high">Priority (High-Low)</option>
            <option value="application-date">Application Date</option>
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
              placeholder="Search companies or positions"
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

export default ApplicationsFilters;
