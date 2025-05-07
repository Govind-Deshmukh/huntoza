// src/components/common/form/SelectField.js
import React from "react";

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  showEmptyOption = true,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      >
        {showEmptyOption && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;
