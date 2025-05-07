// src/components/dashboard/applications/ApplicationsList.js
import React from "react";
import ApplicationItem from "./ApplicationItem";

const ApplicationsList = ({
  jobs,
  getStatusBadge,
  formatDate,
  formatJobType,
  handleToggleFavorite,
  handleStatusChange,
  handleDeleteJob,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <ApplicationItem
            key={job._id}
            job={job}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            formatJobType={formatJobType}
            handleToggleFavorite={handleToggleFavorite}
            handleStatusChange={handleStatusChange}
            handleDeleteJob={handleDeleteJob}
          />
        ))}
      </ul>
    </div>
  );
};

export default ApplicationsList;
