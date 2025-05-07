// src/pages/dashboard/applications/JobFormPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import ExtensionIntegration from "../../../components/dashboard/ExtensionIntegration";
import FormPage from "../../../components/common/FormPage";
import FormSection from "../../../components/common/form/FormSection";
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/form/SelectField";

const JobFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Initial form state
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
    contactPerson: "",
    notes: "",
    priority: "medium",
    favorite: false,
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [extensionDataReceived, setExtensionDataReceived] = useState(false);

  // Load contacts for contact person dropdown
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Extension data handler
  const handleExtensionData = (jobData) => {
    const updatedData = {
      ...initialFormState,
      company: jobData.company || "",
      position: jobData.position || "",
      jobLocation: jobData.jobLocation || "remote",
      jobType: jobData.jobType || "full-time",
      jobDescription: jobData.jobDescription || "",
      jobUrl: jobData.jobUrl || "",
      priority: jobData.priority || "medium",
      favorite: jobData.favorite || false,
      salary: {
        min: jobData.salary?.min || 0,
        max: jobData.salary?.max || 0,
        currency: jobData.salary?.currency || "INR",
      },
    };

    setFormData(updatedData);
    setExtensionDataReceived(true);
  };

  // Load job data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const jobData = await getJobById(id);
          if (jobData) {
            const formattedData = { ...jobData };

            if (jobData.applicationDate) {
              formattedData.applicationDate = new Date(jobData.applicationDate)
                .toISOString()
                .slice(0, 10);
            }

            if (
              jobData.contactPerson &&
              typeof jobData.contactPerson === "object"
            ) {
              formattedData.contactPerson = jobData.contactPerson._id;
            }

            if (!formattedData.salary) {
              formattedData.salary = { min: 0, max: 0, currency: "INR" };
            }

            setFormData(formattedData);
          }
        } catch (err) {
          console.error("Error fetching job data:", err);
        }
      };

      fetchJob();
    } else if (location.state?.jobData && !extensionDataReceived) {
      setFormData({
        ...initialFormState,
        ...location.state.jobData,
      });
    }
  }, [id, getJobById, isEditMode, location.state, extensionDataReceived]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

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

    if (!validateForm()) {
      return;
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

      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (err) {
      console.error("Error saving job application:", err);
    }
  };

  // Job type options
  const jobTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "remote", label: "Remote" },
    { value: "other", label: "Other" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  // Currency options
  const currencyOptions = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "CAD", label: "CAD (C$)" },
    { value: "AUD", label: "AUD (A$)" },
    { value: "JPY", label: "JPY (¥)" },
  ];

  return (
    <FormPage
      title={isEditMode ? "Edit Job Application" : "Add New Job Application"}
      subtitle={
        isEditMode
          ? "Update your job application details"
          : "Create a new job application to track in your job hunt"
      }
      isEditMode={isEditMode}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/applications")}
      submitText={isEditMode ? "Update Application" : "Add Application"}
    >
      {/* Extension integration */}
      <ExtensionIntegration onDataReceived={handleExtensionData} />

      {/* Basic information */}
      <FormSection>
        <FormField
          id="company"
          name="company"
          label="Company"
          value={formData.company}
          onChange={handleChange}
          error={validationErrors.company}
          required={true}
          placeholder="Company name"
        />

        <FormField
          id="position"
          name="position"
          label="Position"
          value={formData.position}
          onChange={handleChange}
          error={validationErrors.position}
          required={true}
          placeholder="Job title/position"
        />

        <FormField
          id="jobLocation"
          name="jobLocation"
          label="Location"
          value={formData.jobLocation}
          onChange={handleChange}
          placeholder="Remote, Hybrid, or Office location"
        />

        <SelectField
          id="jobType"
          name="jobType"
          label="Job Type"
          value={formData.jobType}
          onChange={handleChange}
          options={jobTypeOptions}
          showEmptyOption={false}
        />
      </FormSection>

      {/* Salary information */}
      <FormSection title="Salary Information">
        <FormField
          id="salary.min"
          name="salary.min"
          label="Minimum Salary"
          type="number"
          value={formData.salary.min}
          onChange={handleChange}
          min="0"
          step="1000"
        />

        <FormField
          id="salary.max"
          name="salary.max"
          label="Maximum Salary"
          type="number"
          value={formData.salary.max}
          onChange={handleChange}
          min="0"
          step="1000"
        />

        <SelectField
          id="salary.currency"
          name="salary.currency"
          label="Currency"
          value={formData.salary.currency}
          onChange={handleChange}
          options={currencyOptions}
          showEmptyOption={false}
        />
      </FormSection>

      {/* Job URL */}
      <FormField
        id="jobUrl"
        name="jobUrl"
        label="Job URL"
        value={formData.jobUrl}
        onChange={handleChange}
        placeholder="https://example.com/job-posting"
      />

      {/* Job description */}
      <FormField
        id="jobDescription"
        name="jobDescription"
        label="Job Description"
        type="textarea"
        value={formData.jobDescription}
        onChange={handleChange}
        placeholder="Copy and paste the job description here"
      />

      {/* Notes */}
      <FormField
        id="notes"
        name="notes"
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any notes or thoughts about this application"
      />

      {/* Priority and favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <SelectField
          id="priority"
          name="priority"
          label="Priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          showEmptyOption={false}
        />

        <FormField
          id="favorite"
          name="favorite"
          label="Mark as favorite"
          type="checkbox"
          checked={formData.favorite}
          onChange={handleChange}
        />
      </div>
    </FormPage>
  );
};

export default JobFormPage;
