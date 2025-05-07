import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useData } from "../../../context/DataContext";

const ContactPage = () => {
  const {
    contacts,
    contactsPagination,
    isLoading,
    error,
    loadContacts,
    toggleContactFavorite,
    deleteContact,
  } = useData();

  // State for filtering and sorting
  const [filters, setFilters] = useState({
    relationship: "all",
    search: "",
    sort: "newest",
    favorite: "",
    tag: "",
  });

  // Current page
  const [currentPage, setCurrentPage] = useState(1);

  // Load contacts on component mount and when filters change
  useEffect(() => {
    loadContacts(filters, currentPage);
  }, [loadContacts, filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle contact favorite toggle
  const handleToggleFavorite = async (contactId) => {
    try {
      await toggleContactFavorite(contactId);
      // Refresh the contacts list to show updated status
      loadContacts(filters, currentPage);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // Handle contact deletion
  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contactId);
        // Refresh the contact list
        loadContacts(filters, currentPage);
      } catch (err) {
        console.error("Error deleting contact:", err);
      }
    }
  };

  // Format relationship for display
  const formatRelationship = (relationship) => {
    if (!relationship) return "";
    return relationship
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const { numOfPages } = contactsPagination;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Previous</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    // Page numbers
    for (let i = 1; i <= numOfPages; i++) {
      // Show first page, last page, and pages around current page
      if (
        i === 1 ||
        i === numOfPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`relative inline-flex items-center px-4 py-2 border ${
              i === currentPage
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            } text-sm font-medium`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < numOfPages - 2)
      ) {
        // Add ellipsis
        buttons.push(
          <span
            key={`ellipsis-${i}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm"
          >
            ...
          </span>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numOfPages))}
        disabled={currentPage === numOfPages}
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Next</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    return buttons;
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your network connections
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/contacts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Contact
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Relationship filter */}
              <div>
                <label
                  htmlFor="relationship"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Relationship
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  value={filters.relationship}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                >
                  <option value="all">All Relationships</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="hiring-manager">Hiring Manager</option>
                  <option value="colleague">Colleague</option>
                  <option value="referral">Referral</option>
                  <option value="mentor">Mentor</option>
                  <option value="other">Other</option>
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
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Name (A-Z)</option>
                  <option value="z-a">Name (Z-A)</option>
                  <option value="last-contact">Last Contact Date</option>
                  <option value="company">Company</option>
                </select>
              </div>

              {/* Favorite filter */}
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
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                >
                  <option value="">All Contacts</option>
                  <option value="true">Favorites Only</option>
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
                    onChange={handleFilterChange}
                    placeholder="Search contacts"
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
          ) : contacts.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 2a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No contacts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new contact.
              </p>
              <div className="mt-6">
                <Link
                  to="/contacts/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Contact
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Contacts list */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {contacts.map((contact) => (
                    <li key={contact._id} className="col-span-1">
                      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link
                                  to={`/contacts/${contact._id}`}
                                  className="hover:text-blue-600"
                                >
                                  {contact.name}
                                </Link>
                              </h3>
                              <div className="text-sm text-gray-500">
                                {contact.position && contact.company && (
                                  <span>
                                    {contact.position} at {contact.company}
                                  </span>
                                )}
                                {!contact.position && contact.company && (
                                  <span>{contact.company}</span>
                                )}
                                {contact.position && !contact.company && (
                                  <span>{contact.position}</span>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {formatRelationship(contact.relationship)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFavorite(contact._id)}
                              className={`p-1 rounded-full ${
                                contact.favorite
                                  ? "text-yellow-500 hover:text-yellow-600"
                                  : "text-gray-400 hover:text-yellow-500"
                              }`}
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-4 flex justify-between text-xs text-gray-500">
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </a>
                          )}
                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-green-600 hover:text-green-800"
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </a>
                          )}
                          {contact.linkedIn && (
                            <a
                              href={contact.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          )}
                          <Link
                            to={`/contacts/edit/${contact._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="h-4 w-4"
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
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pagination */}
              {contactsPagination.numOfPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, contactsPagination.numOfPages)
                        )
                      }
                      disabled={currentPage === contactsPagination.numOfPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">{contacts.length}</span>{" "}
                        results of{" "}
                        <span className="font-medium">
                          {contactsPagination.totalItems}
                        </span>{" "}
                        contacts
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        {generatePaginationButtons()}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContactPage;
