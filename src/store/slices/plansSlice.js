// src/store/slices/plansSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planService, paymentService } from "../../services";

// Async thunks
export const loadPlans = createAsyncThunk(
  "plans/loadPlans",
  async (_, { rejectWithValue }) => {
    try {
      const data = await planService.loadPlans();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadCurrentPlan = createAsyncThunk(
  "plans/loadCurrentPlan",
  async (_, { rejectWithValue }) => {
    try {
      const data = await planService.loadCurrentPlan();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const initiatePlanUpgrade = createAsyncThunk(
  "plans/initiatePlanUpgrade",
  async ({ planId, billingType }, { rejectWithValue }) => {
    try {
      const data = await planService.initiatePlanUpgrade(planId, billingType);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "plans/cancelSubscription",
  async (_, { rejectWithValue }) => {
    try {
      await planService.cancelSubscription();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPaymentOrder = createAsyncThunk(
  "plans/createPaymentOrder",
  async ({ planId, billingType }, { rejectWithValue }) => {
    try {
      const data = await paymentService.createPaymentOrder(planId, billingType);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "plans/verifyPayment",
  async (paymentData, { rejectWithValue, dispatch }) => {
    try {
      const data = await paymentService.verifyPayment(paymentData);
      // Refresh current plan after successful payment
      dispatch(loadCurrentPlan());
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  plans: [],
  currentPlan: {
    plan: {
      name: "free",
      limits: {},
      features: [],
    },
    subscription: null,
    isLoading: false,
    error: null,
    lastRefreshTime: null,
  },
  paymentOrder: null,
  loading: false,
  error: null,
};

// Plans slice
const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentOrder: (state) => {
      state.paymentOrder = null;
    },
    refreshCurrentPlan: (state) => {
      state.currentPlan.lastRefreshTime = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // Load plans
      .addCase(loadPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(loadPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load current plan
      .addCase(loadCurrentPlan.pending, (state) => {
        state.currentPlan.isLoading = true;
        state.currentPlan.error = null;
      })
      .addCase(loadCurrentPlan.fulfilled, (state, action) => {
        state.currentPlan.isLoading = false;
        state.currentPlan.plan = {
          name: action.payload?.plan?.name || "free",
          limits: action.payload?.plan?.limits || {},
          features: action.payload?.plan?.features || [],
          _id: action.payload?.plan?._id || null,
        };
        state.currentPlan.subscription = action.payload?.subscription || null;
        state.currentPlan.lastRefreshTime = Date.now();
      })
      .addCase(loadCurrentPlan.rejected, (state, action) => {
        state.currentPlan.isLoading = false;
        state.currentPlan.error = action.payload;
        state.currentPlan.lastRefreshTime = Date.now();
      })

      // Initiate plan upgrade
      .addCase(initiatePlanUpgrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePlanUpgrade.fulfilled, (state, action) => {
        state.loading = false;
        // If it's a free plan upgrade, refresh current plan
        if (action.payload.nextStep !== "payment") {
          // This will trigger a refresh of current plan
        }
      })
      .addCase(initiatePlanUpgrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
        // Reset to free plan
        state.currentPlan.plan = {
          name: "free",
          limits: {},
          features: [],
          _id: null,
        };
        state.currentPlan.subscription = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create payment order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentOrder = null; // Clear payment order after successful verification
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearPaymentOrder, refreshCurrentPlan } =
  plansSlice.actions;
export default plansSlice.reducer;
