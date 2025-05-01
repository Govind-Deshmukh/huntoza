import api from "../utils/axiosConfig";

/**
 * Load jobs with optional filters
 * @param {Object} filters - Filter parameters
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Promise} Promise resolving to job data
 */
export const loadJobs = async (filters = {}, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  });

  const response = await api.get(`/jobs?${queryParams}`);
  return response.data;
};

/**
 * Get job by ID
 * @param {String} jobId - Job ID
 * @returns {Promise} Promise resolving to job data
 */
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data.job;
};

/**
 * Create a new job application
 * @param {Object} jobData - Job data
 * @returns {Promise} Promise resolving to created job
 */
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data.job;
};

/**
 * Update job application
 * @param {String} jobId - Job ID
 * @param {Object} jobData - Updated job data
 * @returns {Promise} Promise resolving to updated job
 */
export const updateJob = async (jobId, jobData) => {
  const response = await api.patch(`/jobs/${jobId}`, jobData);
  return response.data.job;
};

/**
 * Delete job application
 * @param {String} jobId - Job ID
 * @returns {Promise} Promise resolving to success status
 */
export const deleteJob = async (jobId) => {
  await api.delete(`/jobs/${jobId}`);
  return true;
};

/**
 * Add interview to job
 * @param {String} jobId - Job ID
 * @param {Object} interviewData - Interview data
 * @returns {Promise} Promise resolving to updated job
 */
export const addInterview = async (jobId, interviewData) => {
  const response = await api.post(`/jobs/${jobId}/interviews`, interviewData);
  return response.data.job;
};

/**
 * Update interview
 * @param {String} jobId - Job ID
 * @param {String} interviewId - Interview ID
 * @param {Object} interviewData - Updated interview data
 * @returns {Promise} Promise resolving to updated job
 */
export const updateInterview = async (jobId, interviewId, interviewData) => {
  const response = await api.patch(
    `/jobs/${jobId}/interviews/${interviewId}`,
    interviewData
  );
  return response.data.job;
};

/**
 * Delete interview
 * @param {String} jobId - Job ID
 * @param {String} interviewId - Interview ID
 * @returns {Promise} Promise resolving to updated job
 */
export const deleteInterview = async (jobId, interviewId) => {
  const response = await api.delete(`/jobs/${jobId}/interviews/${interviewId}`);
  return response.data.job;
};

export default {
  loadJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  addInterview,
  updateInterview,
  deleteInterview,
};
