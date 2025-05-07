// src/components/dashboard/tasks/TaskItem.js
import React from "react";
import { Link } from "react-router-dom";

const TaskItem = ({
  task,
  onComplete,
  onDelete,
  formatDueDate,
  isOverdue,
  getPriorityBadge,
}) => {
  return (
    <li
      className={`px-4 py-4 sm:px-6 hover:bg-gray-50 ${
        task.status === "completed"
          ? "bg-green-50"
          : isOverdue(task.dueDate) && task.status !== "completed"
          ? "bg-red-50"
          : task.priority === "high"
          ? "bg-yellow-50"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Checkbox for completion */}
          <div className="flex-shrink-0 mr-3">
            {task.status === "completed" ? (
              <button
                className="h-5 w-5 rounded-full flex items-center justify-center bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled
              >
                <svg
                  className="h-3 w-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => onComplete(task._id)}
                className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Complete task</span>
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </div>
            <div className="mt-1 flex items-center">
              {task.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {task.category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {task.dueDate ? (
                  <>
                    Due:{" "}
                    <span
                      className={
                        isOverdue(task.dueDate) && task.status !== "completed"
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {formatDueDate(task.dueDate)}
                    </span>
                  </>
                ) : (
                  "No due date"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4">{getPriorityBadge(task.priority)}</div>

          <div className="flex space-x-2">
            <Link
              to={`/tasks/${task._id}`}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to={`/tasks/edit/${task._id}`}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Edit</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(task._id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Delete</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {task.description && (
        <div className="mt-2 text-sm text-gray-600 ml-8">
          {task.description.length > 150
            ? task.description.slice(0, 150) + "..."
            : task.description}
        </div>
      )}

      {/* Related job or contact info */}
      {(task.relatedJob || task.relatedContact) && (
        <div className="mt-2 ml-8">
          {task.relatedJob && (
            <Link
              to={`/jobs/${task.relatedJob._id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
            >
              🏢 {task.relatedJob.company} - {task.relatedJob.position}
            </Link>
          )}
          {task.relatedContact && (
            <Link
              to={`/contacts/${task.relatedContact._id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              👤 {task.relatedContact.name}
            </Link>
          )}
        </div>
      )}
    </li>
  );
};

export default TaskItem;
