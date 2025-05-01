import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const ContactFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    createContact,
    updateContact,
    getContactById,
    isLoading,
    error,
    clearError,
  } = useData();

  // Determine if in edit mode based on presence of ID
  const isEditMode = !!id;

  // Initial form state
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    linkedIn: "",
    relationship: "other",
    notes: "",
    tags: [],
    followUpDate: "",
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Tags input state
  const [tagInput, setTagInput] = useState("");

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Load contact data if in edit mode
  useEffect(() => {
    const fetchContact = async () => {
      if (isEditMode) {
        try {
          const contactData = await getContactById(id);
          if (contactData) {
            // Format dates for input fields if they exist
            const formattedContact = { ...contactData };

            if (contactData.followUpDate) {
              formattedContact.followUpDate = new Date(contactData.followUpDate)
                .toISOString()
                .slice(0, 10); // YYYY-MM-DD
            }

            setFormData(formattedContact);
          }
        } catch (err) {
          console.error("Error fetching contact:", err);
        }
      }
    };

    fetchContact();
  }, [id, isEditMode, getContactById]);

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

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add tag when Enter is pressed
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault(); // Prevent form submission

      // Add tag if it doesn't already exist
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }

      setTagInput(""); // Clear input
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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
        await updateContact(id, formData);
        setSuccessMessage("Contact updated successfully!");
      } else {
        await createContact(formData);
        setSuccessMessage("Contact added successfully!");
        // Reset form if adding new contact
        setFormData(initialFormState);
        setTagInput("");
      }

      // Navigate back to contacts list after a short delay
      setTimeout(() => {
        navigate(isEditMode ? `/contacts/${id}` : "/contacts");
      }, 1500);
    } catch (err) {
      console.error("Error saving contact:", err);
      // Error is already handled by the DataContext
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Contact" : "Add New Contact"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? "Update contact information and details"
                : "Create a new contact in your network"}
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

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          validationErrors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        required
                      />
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="relationship"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Relationship
                    </label>
                    <div className="mt-1">
                      <select
                        id="relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="recruiter">Recruiter</option>
                        <option value="hiring-manager">Hiring Manager</option>
                        <option value="colleague">Colleague</option>
                        <option value="referral">Referral</option>
                        <option value="mentor">Mentor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          validationErrors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Position
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="position"
                        id="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="linkedIn"
                      className="block text-sm font-medium text-gray-700"
                    >
                      LinkedIn Profile
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="linkedIn"
                        id="linkedIn"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Follow-up Date */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="followUpDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Follow-up Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="followUpDate"
                        id="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tags
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tags and press Enter"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                            >
                              <svg
                                className="h-3 w-3"
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
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Press Enter to add each tag
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate("/contacts")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
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
                    ? "Update Contact"
                    : "Add Contact"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContactFormPage;
