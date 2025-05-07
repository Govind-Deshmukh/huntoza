// src/components/common/form/DateTimeField.js
import React from "react";
import FormField from "../FormField";

const DateTimeField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  type = "date", // date, datetime-local, time
  placeholder = "",
  disabled = false,
}) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default DateTimeField;
