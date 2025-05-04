import React, { useEffect, useState } from "react";

const ExtensionIntegration = ({ onDataReceived }) => {
  const [dataStatus, setDataStatus] = useState("waiting");

  useEffect(() => {
    // Check for existing data in localStorage
    const checkForExtensionData = () => {
      try {
        const storedJobData = localStorage.getItem("pendingJobData");
        if (storedJobData) {
          const jobData = JSON.parse(storedJobData);
          console.log("Found job data from extension:", jobData);

          // Pass the data to the parent component
          onDataReceived(jobData);

          // Update status
          setDataStatus("received");

          // Clean up
          localStorage.removeItem("pendingJobData");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error processing extension job data:", error);
        setDataStatus("error");
        return false;
      }
    };

    // Check on component mount
    const dataFound = checkForExtensionData();
    if (!dataFound) {
      // Set up listener for custom event from the extension
      const handleJobDataAvailable = (event) => {
        if (event.detail?.source === "chromeExtension") {
          const dataFound = checkForExtensionData();
          if (dataFound) {
            // Clean up event listener if data was found
            window.removeEventListener(
              "jobDataAvailable",
              handleJobDataAvailable
            );
          }
        }
      };

      // Register the event listener
      window.addEventListener("jobDataAvailable", handleJobDataAvailable);

      // Return cleanup function
      return () => {
        window.removeEventListener("jobDataAvailable", handleJobDataAvailable);
      };
    }
  }, [onDataReceived]);

  // Only show UI when data was received
  if (dataStatus === "received") {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mt-2 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Job details have been auto-filled from the Job Hunt Assist extension!
        </span>
      </div>
    );
  } else if (dataStatus === "error") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p>There was an error processing job data from the extension.</p>
      </div>
    );
  }

  // Don't render anything when waiting or no data
  return null;
};

export default ExtensionIntegration;
