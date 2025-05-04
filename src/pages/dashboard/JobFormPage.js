import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const JobFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    createJob,
    updateJob,
    getJobById,
    loadContacts,
    isLoading,
    error,
    clearError,
    contacts,
  } = useData();

  // Determine if in edit mode based on presence of ID
  const isEditMode = !!id;

  // Initial form state matching ALL fields from the Job model
  const initialFormState = {
    company: "",
    position: "",
    status: "applied",
    jobType: "full-time",
    jobLocation: "remote",
    jobDescription: "",
    jobUrl: "",
    salary: {
      min: 0,
      max: 0,
      currency: "INR",
    },
    applicationDate: new Date().toISOString().slice(0, 10), // Today's date in YYYY-MM-DD format
    contactPerson: null,
    notes: "",
    documents: {
      resume: "",
      coverLetter: "",
      other: [],
    },
    interviewHistory: [],
    feedbackReceived: "",
    priority: "medium",
    favorite: false,
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Load contacts for contact person dropdown
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Load job data if in edit mode
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(id);

        if (jobData) {
          // Format dates for the form inputs
          const formattedData = { ...jobData };

          if (jobData.applicationDate) {
            formattedData.applicationDate = new Date(jobData.applicationDate)
              .toISOString()
              .slice(0, 10);
          }

          // Handle contact person if it's an object
          if (
            jobData.contactPerson &&
            typeof jobData.contactPerson === "object"
          ) {
            formattedData.contactPerson = jobData.contactPerson._id;
          }

          // Ensure salary is properly structured
          if (!formattedData.salary) {
            formattedData.salary = {
              min: 0,
              max: 0,
              currency: "INR",
            };
          }

          setFormData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching job data:", err);
      }
    };

    if (isEditMode) {
      fetchJob();
    }
  }, [id, getJobById, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    const inputValue = type === "checkbox" ? checked : value;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message
    if (successMessage) {
      setSuccessMessage("");
    }

    // Handle nested salary object properties
    if (name.startsWith("salary.")) {
      const salaryProp = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryProp]: type === "number" ? Number(inputValue) : inputValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.company.trim()) {
      errors.company = "Company name is required";
    }

    if (!formData.position.trim()) {
      errors.position = "Position is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate form
    if (!validateForm()) {
      return;
    }
    if (!formData.contactPerson) {
      formData.contactPerson = null;
    }

    try {
      if (isEditMode) {
        await updateJob(id, formData);
        setSuccessMessage("Job application updated successfully!");
      } else {
        await createJob(formData);
        setSuccessMessage("Job application created successfully!");
        setFormData(initialFormState);
      }

      // Navigate back to applications list after a short delay
      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (err) {
      console.error("Error saving job application:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Job Application" : "Add New Job Application"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? "Update your job application details"
                : "Create a new job application to track in your job hunt"}
            </p>
          </div>

          {/* Error message */}
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

          {/* Success message */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg p-6"
            >
              {/* Basic Information Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        validationErrors.company
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Company name"
                    />
                    {validationErrors.company && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.company}
                      </p>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      id="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        validationErrors.position
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Job title"
                    />
                    {validationErrors.position && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.position}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                      <option value="saved">Saved</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label
                      htmlFor="jobType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Job Type
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Job Location */}
                  <div>
                    <label
                      htmlFor="jobLocation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="jobLocation"
                      id="jobLocation"
                      value={formData.jobLocation}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                      placeholder="Job location or Remote"
                    />
                  </div>

                  {/* Job URL */}
                  <div>
                    <label
                      htmlFor="jobUrl"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Job URL
                    </label>
                    <input
                      type="text"
                      name="jobUrl"
                      id="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                      placeholder="https://example.com/job-posting"
                    />
                  </div>

                  {/* Application Date */}
                  <div>
                    <label
                      htmlFor="applicationDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Application Date
                    </label>
                    <input
                      type="date"
                      name="applicationDate"
                      id="applicationDate"
                      value={formData.applicationDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact Person
                    </label>
                    <select
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="">Select Contact</option>
                      {contacts &&
                        contacts.map((contact) => (
                          <option key={contact._id} value={contact._id}>
                            {contact.name}
                            {contact.company && ` (${contact.company})`}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Salary Range Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Salary Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Minimum Salary */}
                  <div>
                    <label
                      htmlFor="salary-min"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      name="salary.min"
                      id="salary-min"
                      value={formData.salary.min}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Maximum Salary */}
                  <div>
                    <label
                      htmlFor="salary-max"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      name="salary.max"
                      id="salary-max"
                      value={formData.salary.max}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Salary Currency */}
                  <div>
                    <label
                      htmlFor="salary-currency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Currency
                    </label>
                    <select
                      id="salary-currency"
                      name="salary.currency"
                      value={formData.salary.currency}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Additional Information
                </h2>

                {/* Priority & Favorite */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Priority */}
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Favorite */}
                  <div className="flex items-center h-full mt-8">
                    <input
                      id="favorite"
                      name="favorite"
                      type="checkbox"
                      checked={formData.favorite}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="favorite"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Mark as favorite
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    rows="5"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Copy and paste the job description here"
                  ></textarea>
                </div>

                {/* Feedback Received */}
                <div className="mb-6">
                  <label
                    htmlFor="feedbackReceived"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Feedback Received
                  </label>
                  <textarea
                    id="feedbackReceived"
                    name="feedbackReceived"
                    rows="3"
                    value={formData.feedbackReceived}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Any feedback received from the company"
                  ></textarea>
                </div>

                {/* Notes */}
                <div>
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
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Add any notes or thoughts about this application"
                  ></textarea>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Application"
                    : "Add Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobFormPage;
