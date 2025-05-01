import api from "../utils/axiosConfig";

/**
 * Load all available plans
 * @returns {Promise} Promise resolving to plan data
 */
export const loadPlans = async () => {
  const response = await api.get("/plans");
  return response.data.plans;
};

/**
 * Load current user's plan
 * @returns {Promise} Promise resolving to current plan data
 */
export const loadCurrentPlan = async () => {
  const response = await api.get("/plans/user/current");
  return response.data;
};

/**
 * Initiate plan upgrade
 * @param {String} planId - Plan ID to upgrade to
 * @param {String} billingType - Billing type (monthly/yearly)
 * @returns {Promise} Promise resolving to upgrade data
 */
export const initiatePlanUpgrade = async (planId, billingType) => {
  const response = await api.post("/plans/upgrade", {
    planId,
    billingType,
  });
  return response.data;
};

/**
 * Cancel current subscription
 * @returns {Promise} Promise resolving to cancellation status
 */
export const cancelSubscription = async () => {
  await api.post("/plans/cancel");
  return true;
};

export default {
  loadPlans,
  loadCurrentPlan,
  initiatePlanUpgrade,
  cancelSubscription,
};
