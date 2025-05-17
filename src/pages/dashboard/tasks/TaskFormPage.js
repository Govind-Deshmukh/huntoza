// src/pages/dashboard/tasks/TaskFormPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import FormPage from "../../../components/common/FormPage";
import FormSection from "../../../components/common/form/FormSection";
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/form/SelectField";
import DateTimeField from "../../../components/common/form/DateTimeField";

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
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load related data
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
      if (isEditMode) {
        try {
          const taskData = await getTaskById(id);

          if (taskData) {
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

            if (
              taskData.relatedJob &&
              typeof taskData.relatedJob === "object"
            ) {
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
      }
    };

    fetchTask();
  }, [id, getTaskById, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

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

    if (!validateForm()) {
      return;
    }

    // Fix for the ObjectId casting error - convert empty strings to null
    const sanitizedData = {
      ...formData,
      relatedContact:
        formData.relatedContact === "" ? null : formData.relatedContact,
      relatedJob: formData.relatedJob === "" ? null : formData.relatedJob,
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

      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Options for select fields
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const categoryOptions = [
    { value: "application", label: "Application" },
    { value: "networking", label: "Networking" },
    { value: "interview-prep", label: "Interview Prep" },
    { value: "skill-development", label: "Skill Development" },
    { value: "follow-up", label: "Follow-up" },
    { value: "other", label: "Other" },
  ];

  // Prepare job options for select field
  const jobOptions =
    jobs?.map((job) => ({
      value: job._id,
      label: `${job.company} - ${job.position}`,
    })) || [];

  // Prepare contact options for select field
  const contactOptions =
    contacts?.map((contact) => ({
      value: contact._id,
      label: `${contact.name}${contact.company ? ` (${contact.company})` : ""}`,
    })) || [];

  return (
    <FormPage
      title={isEditMode ? "Edit Task" : "Create New Task"}
      subtitle={
        isEditMode
          ? "Update your task details"
          : "Add a new task to your job search process"
      }
      isEditMode={isEditMode}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/tasks")}
      submitText={isEditMode ? "Update Task" : "Create Task"}
    >
      <FormField
        id="title"
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        error={validationErrors.title}
        required={true}
        placeholder="Enter task title"
      />

      <FormField
        id="description"
        name="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the task"
      />

      <FormSection>
        <SelectField
          id="status"
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          showEmptyOption={false}
        />

        <SelectField
          id="priority"
          name="priority"
          label="Priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          showEmptyOption={false}
        />

        <SelectField
          id="category"
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          showEmptyOption={false}
        />

        <DateTimeField
          id="dueDate"
          name="dueDate"
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <DateTimeField
          id="reminder"
          name="reminder"
          label="Reminder"
          type="datetime-local"
          value={formData.reminder}
          onChange={handleChange}
        />

        <SelectField
          id="relatedJob"
          name="relatedJob"
          label="Related Job"
          value={formData.relatedJob}
          onChange={handleChange}
          options={jobOptions}
          placeholder="None"
        />

        <SelectField
          id="relatedContact"
          name="relatedContact"
          label="Related Contact"
          value={formData.relatedContact}
          onChange={handleChange}
          options={contactOptions}
          placeholder="None"
        />
      </FormSection>
    </FormPage>
  );
};

export default TaskFormPage;
