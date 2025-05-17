// src/components/common/form/FormSection.js
import React from "react";

const FormSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

export default FormSection;
