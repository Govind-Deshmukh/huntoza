import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const TaskFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    createTask,
    updateTask,
    getTaskById,
    loadJobs,
    loadContacts,
    isLoading,
    error,
    clearError,
    jobs,
    contacts,
  } = useData();

  // Determine if in edit mode based on presence of ID
  const isEditMode = !!id;

  // Initial form state
  const initialFormState = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    reminder: "",
    category: "other",
    relatedJob: "",
    relatedContact: "",
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Load jobs and contacts for select fields
  useEffect(() => {
    const fetchOptions = async () => {
      await loadJobs({ status: "all" });
      await loadContacts();
    };

    fetchOptions();
  }, [loadJobs, loadContacts]);

  // Load task data if in edit mode
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTaskById(id);

        if (taskData) {
          // Format dates for the form inputs
          const formattedTask = { ...taskData };

          if (taskData.dueDate) {
            formattedTask.dueDate = new Date(taskData.dueDate)
              .toISOString()
              .slice(0, 10);
          }

          if (taskData.reminder) {
            formattedTask.reminder = new Date(taskData.reminder)
              .toISOString()
              .slice(0, 16);
          }

          // Handle related entities
          if (taskData.relatedJob && typeof taskData.relatedJob === "object") {
            formattedTask.relatedJob = taskData.relatedJob._id;
          }

          if (
            taskData.relatedContact &&
            typeof taskData.relatedContact === "object"
          ) {
            formattedTask.relatedContact = taskData.relatedContact._id;
          }

          setFormData(formattedTask);
        }
      } catch (err) {
        console.error("Error fetching task data:", err);
      }
    };

    if (isEditMode) {
      fetchTask();
    }
  }, [id, getTaskById, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Normalize empty strings for relatedContact or relatedJob to null
    if ((name === "relatedContact" || name === "relatedJob") && value === "") {
      newValue = null;
    }

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

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
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

    // Create a copy of formData and sanitize it
    const sanitizedData = {
      ...formData,
      relatedContact:
        formData.relatedContact === "" ? null : formData.relatedContact,
      relatedJob: formData.relatedJob === "" ? null : formData.relatedJob, // Optional
    };

    try {
      if (isEditMode) {
        await updateTask(id, sanitizedData);
        setSuccessMessage("Task updated successfully!");
      } else {
        await createTask(sanitizedData);
        setSuccessMessage("Task created successfully!");
        setFormData(initialFormState);
      }

      // Navigate back to tasks list after a short delay
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? "Update your task details"
                : "Add a new task to your job search process"}
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
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      validationErrors.title
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter task title"
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Describe the task"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

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
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="application">Application</option>
                      <option value="networking">Networking</option>
                      <option value="interview-prep">Interview Prep</option>
                      <option value="skill-development">
                        Skill Development
                      </option>
                      <option value="follow-up">Follow-up</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    />
                  </div>

                  {/* Reminder */}
                  <div>
                    <label
                      htmlFor="reminder"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reminder
                    </label>
                    <input
                      type="datetime-local"
                      name="reminder"
                      id="reminder"
                      value={formData.reminder}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    />
                  </div>

                  {/* Related Job */}
                  <div>
                    <label
                      htmlFor="relatedJob"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Related Job
                    </label>
                    <select
                      id="relatedJob"
                      name="relatedJob"
                      value={formData.relatedJob}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="">None</option>
                      {jobs &&
                        jobs.map((job) => (
                          <option key={job._id} value={job._id}>
                            {job.company} - {job.position}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Related Contact */}
                  <div>
                    <label
                      htmlFor="relatedContact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Related Contact
                    </label>
                    <select
                      id="relatedContact"
                      name="relatedContact"
                      value={formData.relatedContact}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="">None</option>
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

                {/* Form buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/tasks")}
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
                      ? "Update Task"
                      : "Create Task"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskFormPage;
