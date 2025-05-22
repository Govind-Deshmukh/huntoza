// src/store/slices/analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsService } from "../../services";

// Async thunks
export const loadDashboardData = createAsyncThunk(
  "analytics/loadDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.loadDashboardData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getApplicationAnalytics = createAsyncThunk(
  "analytics/getApplicationAnalytics",
  async (period = "all-time", { rejectWithValue }) => {
    try {
      const data = await analyticsService.getApplicationAnalytics(period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getInterviewAnalytics = createAsyncThunk(
  "analytics/getInterviewAnalytics",
  async (period = "all-time", { rejectWithValue }) => {
    try {
      const data = await analyticsService.getInterviewAnalytics(period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTaskAnalytics = createAsyncThunk(
  "analytics/getTaskAnalytics",
  async (period = "all-time", { rejectWithValue }) => {
    try {
      const data = await analyticsService.getTaskAnalytics(period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getNetworkingAnalytics = createAsyncThunk(
  "analytics/getNetworkingAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getNetworkingAnalytics();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  dashboardData: null,
  applicationAnalytics: null,
  interviewAnalytics: null,
  taskAnalytics: null,
  networkingAnalytics: null,
  loading: false,
  error: null,
};

// Analytics slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.dashboardData = null;
      state.applicationAnalytics = null;
      state.interviewAnalytics = null;
      state.taskAnalytics = null;
      state.networkingAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load dashboard data
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get application analytics
      .addCase(getApplicationAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationAnalytics = action.payload;
      })
      .addCase(getApplicationAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get interview analytics
      .addCase(getInterviewAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterviewAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewAnalytics = action.payload;
      })
      .addCase(getInterviewAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get task analytics
      .addCase(getTaskAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.taskAnalytics = action.payload;
      })
      .addCase(getTaskAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get networking analytics
      .addCase(getNetworkingAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNetworkingAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.networkingAnalytics = action.payload;
      })
      .addCase(getNetworkingAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
