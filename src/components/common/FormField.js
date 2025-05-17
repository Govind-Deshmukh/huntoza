// src/components/common/FormField.js
import React from "react";

const FormField = ({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  children,
}) => {
  // Handle different input types
  const renderInput = () => {
    const baseClasses = `mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`;

    switch (type) {
      case "textarea":
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            rows={4}
          />
        );
      case "select":
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
          >
            {children}
          </select>
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
              {label}
            </label>
          </div>
        );
      default:
        return (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      {type !== "checkbox" && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
