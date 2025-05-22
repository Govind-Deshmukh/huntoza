// src/store/slices/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobService } from "../../services";

// Async thunks
export const loadJobs = createAsyncThunk(
  "jobs/loadJobs",
  async ({ filters = {}, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await jobService.loadJobs(filters, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const job = await jobService.createJob(jobData);
      return job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const job = await jobService.updateJob(jobId, jobData);
      return job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(jobId);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const job = await jobService.getJobById(jobId);
      return job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  stats: {
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
    saved: 0,
  },
};

// Jobs slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    updateJobStats: (state, action) => {
      state.stats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load jobs
      .addCase(loadJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.numOfPages,
          totalItems: action.payload.totalJobs,
        };
      })
      .addCase(loadJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob && state.currentJob._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentJob, updateJobStats } =
  jobsSlice.actions;
export default jobsSlice.reducer;
