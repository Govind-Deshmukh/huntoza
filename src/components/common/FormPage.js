// src/components/common/FormPage.js
import React from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

const FormPage = ({
  title,
  subtitle,
  isEditMode,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onCancel,
  children,
  submitText,
  cancelText = "Cancel",
}) => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          </div>

          <ErrorAlert message={error} />
          <SuccessAlert message={successMessage} />

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <form
              onSubmit={onSubmit}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 sm:p-6">{children}</div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  {cancelText}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isLoading
                    ? "Saving..."
                    : submitText || (isEditMode ? "Update" : "Save")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FormPage;
