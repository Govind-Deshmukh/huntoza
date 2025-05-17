// src/components/dashboard/ExtensionIntegration.js
import React, { useEffect, useState } from "react";

const ExtensionIntegration = ({ onDataReceived }) => {
  const [dataStatus, setDataStatus] = useState("waiting");

  useEffect(() => {
    const handleMessageFromExtension = (event) => {
      try {
        // Only accept messages from same window and correct source/type
        if (
          event.source !== window ||
          !event.data ||
          event.data.source !== "job-hunt-extension" ||
          event.data.type !== "SCRAPED_JOB_DATA"
        ) {
          return;
        }

        const jobData = event.data.payload;

        console.log("Received job data from extension:", jobData);

        onDataReceived(jobData);
        setDataStatus("received");
      } catch (error) {
        console.error("Error processing job data:", error);
        setDataStatus("error");
      }
    };

    window.addEventListener("message", handleMessageFromExtension);

    return () => {
      window.removeEventListener("message", handleMessageFromExtension);
    };
  }, [onDataReceived]);

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

  return null; // waiting
};

export default ExtensionIntegration;
