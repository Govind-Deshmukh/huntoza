import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const InterviewFormPage = () => {
  const navigate = useNavigate();
  const { jobId, interviewId } = useParams();
  const {
    getJobById,
    addInterview,
    updateInterview,
    isLoading,
    error,
    clearError,
  } = useData();

  // Determine if in edit mode based on presence of interviewID
  const isEditMode = !!interviewId;

  // State for job data
  const [job, setJob] = useState(null);

  // Initial form state
  const initialFormState = {
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    interviewType: "phone",
    withPerson: "",
    notes: "",
    followUpDate: "",
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch job data and interview data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobData = await getJobById(jobId);

        if (jobData) {
          setJob(jobData);

          if (isEditMode && jobData.interviewHistory) {
            const interview = jobData.interviewHistory.find(
              (i) => i._id === interviewId
            );

            if (interview) {
              // Format dates for input fields
              const formattedInterview = { ...interview };

              if (interview.date) {
                formattedInterview.date = new Date(interview.date)
                  .toISOString()
                  .slice(0, 16); // YYYY-MM-DDThh:mm
              }

              if (interview.followUpDate) {
                formattedInterview.followUpDate = new Date(
                  interview.followUpDate
                )
                  .toISOString()
                  .slice(0, 10); // YYYY-MM-DD
              }

              setFormData(formattedInterview);
            } else {
              // Interview not found, redirect back to job details
              navigate(`/jobs/${jobId}`);
            }
          }
        } else {
          // Job not found, redirect to applications
          navigate("/applications");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [jobId, interviewId, getJobById, navigate, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear previous validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message on any change
    if (successMessage) {
      setSuccessMessage("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.date) {
      errors.date = "Interview date and time is required";
    }

    if (!formData.interviewType) {
      errors.interviewType = "Interview type is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await updateInterview(jobId, interviewId, formData);
        setSuccessMessage("Interview updated successfully!");
      } else {
        await addInterview(jobId, formData);
        setSuccessMessage("Interview added successfully!");
        // Reset form if adding new interview
        setFormData(initialFormState);
      }

      // Navigate back to job details after a short delay
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 1500);
    } catch (err) {
      console.error("Error saving interview:", err);
      // Error is already handled by the DataContext
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Interview" : "Add New Interview"}
            </h1>
            {job && (
              <p className="mt-1 text-sm text-gray-600">
                {job.position} at {job.company}
              </p>
            )}
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

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interview Date and Time */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date and Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      validationErrors.date
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                  {validationErrors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.date}
                    </p>
                  )}
                </div>

                {/* Interview Type */}
                <div>
                  <label
                    htmlFor="interviewType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Interview Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="interviewType"
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      validationErrors.interviewType
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  >
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="in-person">In Person</option>
                    <option value="technical">Technical</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.interviewType && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.interviewType}
                    </p>
                  )}
                </div>

                {/* With Person */}
                <div>
                  <label
                    htmlFor="withPerson"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Interviewer
                  </label>
                  <input
                    type="text"
                    name="withPerson"
                    id="withPerson"
                    value={formData.withPerson}
                    onChange={handleChange}
                    placeholder="Name and/or title of interviewer"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  />
                </div>

                {/* Follow-up Date */}
                <div>
                  <label
                    htmlFor="followUpDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    id="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Preparation notes, questions to ask, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                ></textarea>
              </div>

              {/* Form actions */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${jobId}`)}
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
                    ? "Update Interview"
                    : "Add Interview"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewFormPage;
