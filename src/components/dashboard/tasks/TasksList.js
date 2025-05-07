// src/components/dashboard/tasks/TasksList.js
import React from "react";
import TaskItem from "./TaskItem";

const TasksList = ({
  tasks,
  onCompleteTask,
  onDeleteTask,
  formatDueDate,
  isOverdue,
  getPriorityBadge,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onComplete={onCompleteTask}
            onDelete={onDeleteTask}
            formatDueDate={formatDueDate}
            isOverdue={isOverdue}
            getPriorityBadge={getPriorityBadge}
          />
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
