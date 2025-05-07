import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useData } from "../../../context/DataContext";

const ContactDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getContactById,
    toggleContactFavorite,
    deleteContact,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    isLoading,
    error,
  } = useData();

  const [contact, setContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showEditInteractionForm, setShowEditInteractionForm] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [interactionData, setInteractionData] = useState({
    date: new Date().toISOString().slice(0, 16), // Current date/time in YYYY-MM-DDThh:mm format
    method: "email",
    notes: "",
  });

  // Load contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contactData = await getContactById(id);
        setContact(contactData);
      } catch (err) {
        console.error("Error fetching contact details:", err);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id, getContactById]);

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    try {
      const updatedContact = await toggleContactFavorite(id);
      setContact(updatedContact);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
    }
  };

  // Handle contact deletion
  const handleDelete = async () => {
    try {
      await deleteContact(id);
      navigate("/contacts");
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Handle interaction form changes
  const handleInteractionChange = (e) => {
    const { name, value } = e.target;
    setInteractionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new interaction
  const handleAddInteraction = async (e) => {
    e.preventDefault();

    try {
      const updatedContact = await addInteraction(id, interactionData);
      setContact(updatedContact);

      // Reset form and hide it
      setInteractionData({
        date: new Date().toISOString().slice(0, 16),
        method: "email",
        notes: "",
      });

      setShowInteractionForm(false);
    } catch (err) {
      console.error("Error adding interaction:", err);
    }
  };

  // Edit interaction
  const handleEditInteraction = (interaction) => {
    // Format the date for the form
    const formattedDate = interaction.date
      ? new Date(interaction.date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16);

    setInteractionData({
      date: formattedDate,
      method: interaction.method || "email",
      notes: interaction.notes || "",
    });

    setSelectedInteraction(interaction);
    setShowEditInteractionForm(true);
    setShowInteractionForm(false);
  };

  // Update existing interaction
  const handleUpdateInteraction = async (e) => {
    e.preventDefault();

    if (!selectedInteraction || !selectedInteraction._id) {
      return;
    }

    try {
      const updatedContact = await updateInteraction(
        id,
        selectedInteraction._id,
        interactionData
      );
      setContact(updatedContact);

      // Reset form and state
      setInteractionData({
        date: new Date().toISOString().slice(0, 16),
        method: "email",
        notes: "",
      });

      setSelectedInteraction(null);
      setShowEditInteractionForm(false);
    } catch (err) {
      console.error("Error updating interaction:", err);
    }
  };

  // Delete interaction
  const handleDeleteInteraction = async (interactionId) => {
    if (window.confirm("Are you sure you want to delete this interaction?")) {
      try {
        const updatedContact = await deleteInteraction(id, interactionId);
        setContact(updatedContact);
      } catch (err) {
        console.error("Error deleting interaction:", err);
      }
    }
  };

  // Format relationship for display
  const formatRelationship = (relationship) => {
    if (!relationship) return "Not specified";
    return relationship
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  // Format interaction method for display
  const formatInteractionMethod = (method) => {
    if (!method) return "";
    return method.charAt(0).toUpperCase() + method.slice(1);
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
          ) : !contact ? (
            <div className="text-center py-12">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Contact not found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This contact may have been deleted or doesn't exist.
              </p>
              <div className="mt-6">
                <Link
                  to="/contacts"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Contacts
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Contact header */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h1 className="text-2xl font-semibold text-gray-900">
                          {contact.name}
                        </h1>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                          {contact.position && (
                            <span className="font-medium">
                              {contact.position}
                            </span>
                          )}
                          {contact.position && contact.company && (
                            <span className="hidden sm:inline mx-1">•</span>
                          )}
                          {contact.company && <span>{contact.company}</span>}
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatRelationship(contact.relationship)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-2">
                      <button
                        onClick={handleToggleFavorite}
                        className={`inline-flex items-center p-2 border rounded-full ${
                          contact.favorite
                            ? "bg-yellow-50 border-yellow-200 text-yellow-500"
                            : "border-gray-300 text-gray-400 hover:text-yellow-500"
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
                      <Link
                        to={`/contacts/edit/${contact._id}`}
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
                      </Link>
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
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main contact information */}
                <div className="md:col-span-2">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Contact Information
                      </h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        {/* Email */}
                        {contact.email && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {contact.email}
                              </a>
                            </dd>
                          </div>
                        )}

                        {/* Phone */}
                        {contact.phone && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Phone
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {contact.phone}
                              </a>
                            </dd>
                          </div>
                        )}

                        {/* Company */}
                        {contact.company && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Company
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {contact.company}
                            </dd>
                          </div>
                        )}

                        {/* Position */}
                        {contact.position && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Position
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {contact.position}
                            </dd>
                          </div>
                        )}

                        {/* LinkedIn */}
                        {contact.linkedIn && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              LinkedIn
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <a
                                href={contact.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {contact.linkedIn}
                              </a>
                            </dd>
                          </div>
                        )}

                        {/* Tags */}
                        {contact.tags && contact.tags.length > 0 && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Tags
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="flex flex-wrap gap-2">
                                {contact.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                        )}

                        {/* Notes */}
                        {contact.notes && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Notes
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                              {contact.notes}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {/* Interaction History */}
                  <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Interaction History
                      </h3>
                      <button
                        onClick={() => {
                          setShowInteractionForm(!showInteractionForm);
                          setShowEditInteractionForm(false);
                          setSelectedInteraction(null);
                          setInteractionData({
                            date: new Date().toISOString().slice(0, 16),
                            method: "email",
                            notes: "",
                          });
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                      >
                        <svg
                          className="-ml-1 mr-2 h-4 w-4"
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
                        Record Interaction
                      </button>
                    </div>

                    {/* Interaction Form */}
                    {showInteractionForm && (
                      <div className="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
                        <form onSubmit={handleAddInteraction}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Date and Time
                              </label>
                              <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                value={interactionData.date}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="method"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Method
                              </label>
                              <select
                                id="method"
                                name="method"
                                value={interactionData.method}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="email">Email</option>
                                <option value="call">Phone Call</option>
                                <option value="meeting">Meeting</option>
                                <option value="message">Message</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Notes
                              </label>
                              <textarea
                                id="notes"
                                name="notes"
                                rows="3"
                                value={interactionData.notes}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Details about the interaction"
                              ></textarea>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowInteractionForm(false)}
                              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Edit Interaction Form */}
                    {showEditInteractionForm && selectedInteraction && (
                      <div className="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
                        <form onSubmit={handleUpdateInteraction}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Date and Time
                              </label>
                              <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                value={interactionData.date}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="method"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Method
                              </label>
                              <select
                                id="method"
                                name="method"
                                value={interactionData.method}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="email">Email</option>
                                <option value="call">Phone Call</option>
                                <option value="meeting">Meeting</option>
                                <option value="message">Message</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Notes
                              </label>
                              <textarea
                                id="notes"
                                name="notes"
                                rows="3"
                                value={interactionData.notes}
                                onChange={handleInteractionChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Details about the interaction"
                              ></textarea>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowEditInteractionForm(false);
                                setSelectedInteraction(null);
                              }}
                              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="px-4 py-5 sm:p-6">
                      {/* No interactions message */}
                      {(!contact.interactionHistory ||
                        contact.interactionHistory.length === 0) && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            No interactions recorded yet
                          </p>
                        </div>
                      )}

                      {/* Interaction list */}
                      {contact.interactionHistory &&
                        contact.interactionHistory.length > 0 && (
                          <div className="flow-root">
                            <ul className="-mb-8">
                              {contact.interactionHistory
                                .sort(
                                  (a, b) => new Date(b.date) - new Date(a.date)
                                )
                                .map((interaction, idx) => (
                                  <li key={interaction._id || idx}>
                                    <div className="relative pb-8">
                                      {idx !==
                                        contact.interactionHistory.length -
                                          1 && (
                                        <span
                                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                          aria-hidden="true"
                                        ></span>
                                      )}
                                      <div className="relative flex space-x-3">
                                        <div>
                                          <span
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                              interaction.method === "email"
                                                ? "bg-blue-500"
                                                : interaction.method === "call"
                                                ? "bg-green-500"
                                                : interaction.method ===
                                                  "meeting"
                                                ? "bg-purple-500"
                                                : interaction.method ===
                                                  "message"
                                                ? "bg-yellow-500"
                                                : "bg-gray-500"
                                            }`}
                                          >
                                            <span className="text-white text-xs">
                                              {interaction.method
                                                ?.charAt(0)
                                                .toUpperCase() || "?"}
                                            </span>
                                          </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                          <div>
                                            <p className="text-sm text-gray-900">
                                              {formatInteractionMethod(
                                                interaction.method
                                              )}{" "}
                                              interaction
                                            </p>
                                            {interaction.notes && (
                                              <p className="mt-1 text-sm text-gray-600">
                                                {interaction.notes}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-right text-sm whitespace-nowrap">
                                            <div className="text-gray-500">
                                              {formatDate(interaction.date)}
                                            </div>
                                            <div className="text-gray-500">
                                              {formatTime(interaction.date)}
                                            </div>
                                            <div className="mt-1 flex space-x-2 justify-end">
                                              <button
                                                onClick={() =>
                                                  handleEditInteraction(
                                                    interaction
                                                  )
                                                }
                                                className="text-blue-600 hover:text-blue-900"
                                              >
                                                <svg
                                                  className="h-4 w-4"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                >
                                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDeleteInteraction(
                                                    interaction._id
                                                  )
                                                }
                                                className="text-red-600 hover:text-red-900"
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
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Side panel */}
                <div className="space-y-6">
                  {/* Follow-up info */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Follow-up
                      </h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {contact.followUpDate ? (
                        <div>
                          <p className="text-sm text-gray-500">
                            Next follow-up:
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(contact.followUpDate)}
                          </p>
                          <Link
                            to={`/tasks/new?contactId=${contact._id}`}
                            className="mt-4 inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="-ml-0.5 mr-1.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Create Reminder
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-4">
                            No follow-up scheduled
                          </p>
                          <Link
                            to={`/contacts/edit/${contact._id}?tab=followup`}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="-ml-0.5 mr-1.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Set Follow-up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related jobs */}
                  {contact.relatedJobs && contact.relatedJobs.length > 0 && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Related Jobs
                        </h3>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <ul className="divide-y divide-gray-200">
                          {contact.relatedJobs.map((job) => (
                            <li key={job._id} className="py-2">
                              <Link
                                to={`/jobs/${job._id}`}
                                className="block hover:bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-blue-600 truncate">
                                      {job.position}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {job.company}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Quick actions */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Quick Actions
                      </h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="-ml-1 mr-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Send Email
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <svg
                              className="-ml-1 mr-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            Call
                          </a>
                        )}
                        <Link
                          to={`/tasks/new?contactId=${contact._id}`}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg
                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Create Task
                        </Link>
                        <Link
                          to={`/jobs/new?contactId=${contact._id}`}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg
                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          Add Job Application
                        </Link>
                      </div>
                    </div>
                  </div>
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
                              Delete contact
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to delete this contact?
                                All related interactions will be permanently
                                removed. This action cannot be undone.
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

export default ContactDetailsPage;
