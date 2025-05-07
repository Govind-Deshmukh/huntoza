// src/pages/dashboard/contacts/ContactFormPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import FormPage from "../../../components/common/FormPage";
import FormSection from "../../../components/common/form/FormSection";
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/form/SelectField";
import DateTimeField from "../../../components/common/form/DateTimeField";

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
  const [tagInput, setTagInput] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load contact data if in edit mode
  useEffect(() => {
    const fetchContact = async () => {
      if (isEditMode) {
        try {
          const contactData = await getContactById(id);

          if (contactData) {
            const formattedContact = { ...contactData };

            if (contactData.followUpDate) {
              formattedContact.followUpDate = new Date(contactData.followUpDate)
                .toISOString()
                .slice(0, 10);
            }

            setFormData(formattedContact);
          }
        } catch (err) {
          console.error("Error fetching contact:", err);
        }
      }
    };

    fetchContact();
  }, [id, getContactById, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

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
        setFormData(initialFormState);
        setTagInput("");
      }

      setTimeout(() => {
        navigate(isEditMode ? `/contacts/${id}` : "/contacts");
      }, 1500);
    } catch (err) {
      console.error("Error saving contact:", err);
    }
  };
  // src/pages/dashboard/contacts/ContactFormPage.js - continued
  // Relationship options
  const relationshipOptions = [
    { value: "recruiter", label: "Recruiter" },
    { value: "hiring-manager", label: "Hiring Manager" },
    { value: "colleague", label: "Colleague" },
    { value: "referral", label: "Referral" },
    { value: "mentor", label: "Mentor" },
    { value: "other", label: "Other" },
  ];

  // Tags component to render current tags
  const TagsDisplay = () => (
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
  );

  return (
    <FormPage
      title={isEditMode ? "Edit Contact" : "Add New Contact"}
      subtitle={
        isEditMode
          ? "Update contact information and details"
          : "Create a new contact in your network"
      }
      isEditMode={isEditMode}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/contacts")}
      submitText={isEditMode ? "Update Contact" : "Add Contact"}
    >
      <FormSection>
        <FormField
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          error={validationErrors.name}
          required={true}
        />

        <SelectField
          id="relationship"
          name="relationship"
          label="Relationship"
          value={formData.relationship}
          onChange={handleChange}
          options={relationshipOptions}
          showEmptyOption={false}
        />

        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
        />

        <FormField
          id="phone"
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <FormField
          id="company"
          name="company"
          label="Company"
          value={formData.company}
          onChange={handleChange}
        />

        <FormField
          id="position"
          name="position"
          label="Position"
          value={formData.position}
          onChange={handleChange}
        />
      </FormSection>

      <FormField
        id="linkedIn"
        name="linkedIn"
        label="LinkedIn Profile"
        value={formData.linkedIn}
        onChange={handleChange}
        placeholder="https://linkedin.com/in/username"
      />

      <DateTimeField
        id="followUpDate"
        name="followUpDate"
        label="Follow-up Date"
        type="date"
        value={formData.followUpDate}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagKeyDown}
          placeholder="Add tags and press Enter"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <TagsDisplay />
        <p className="mt-1 text-xs text-gray-500">
          Press Enter to add each tag
        </p>
      </div>

      <FormField
        id="notes"
        name="notes"
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
      />
    </FormPage>
  );
};

export default ContactFormPage;
