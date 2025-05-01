import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

export default function TaskFormPage() {
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
  return <div>TaskFormPage</div>;
}
