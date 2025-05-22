// src/store/slices/tasksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../../services";

// Async thunks
export const loadTasks = createAsyncThunk(
  "tasks/loadTasks",
  async ({ filters = {}, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await taskService.loadTasks(filters, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const task = await taskService.createTask(taskData);
      return task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const task = await taskService.updateTask(taskId, taskData);
      return task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const task = await taskService.completeTask(taskId);
      return task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTaskById = createAsyncThunk(
  "tasks/getTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const task = await taskService.getTaskById(taskId);
      return task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  stats: {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  },
};

// Tasks slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    updateTaskStats: (state, action) => {
      state.stats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load tasks
      .addCase(loadTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.numOfPages,
          totalItems: action.payload.totalTasks,
        };
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Complete task
      .addCase(completeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get task by ID
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentTask, updateTaskStats } =
  tasksSlice.actions;
export default tasksSlice.reducer;
