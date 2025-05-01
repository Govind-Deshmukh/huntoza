import api from "../utils/axiosConfig";

/**
 * Load tasks with optional filters
 * @param {Object} filters - Filter parameters
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Promise} Promise resolving to task data
 */
export const loadTasks = async (filters = {}, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  });

  const response = await api.get(`/tasks?${queryParams}`);
  return response.data;
};

/**
 * Get task by ID
 * @param {String} taskId - Task ID
 * @returns {Promise} Promise resolving to task data
 */
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data.task;
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} Promise resolving to created task
 */
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data.task;
};

/**
 * Update task
 * @param {String} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} Promise resolving to updated task
 */
export const updateTask = async (taskId, taskData) => {
  const response = await api.patch(`/tasks/${taskId}`, taskData);
  return response.data.task;
};

/**
 * Mark task as completed
 * @param {String} taskId - Task ID
 * @returns {Promise} Promise resolving to updated task
 */
export const completeTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/complete`);
  return response.data.task;
};

/**
 * Delete task
 * @param {String} taskId - Task ID
 * @returns {Promise} Promise resolving to success status
 */
export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
  return true;
};

export default {
  loadTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
};
