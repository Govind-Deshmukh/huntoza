// Improved useCurrentPlan hook
import { useState, useEffect, useCallback } from "react";
import { planService } from "../services";

/**
 * Enhanced hook to safely load and manage current plan data
 * with improved refresh mechanism
 *
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {Object} The user's current plan with safe access and refresh function
 */
const useCurrentPlan = (isAuthenticated) => {
  const [currentPlan, setCurrentPlan] = useState({
    plan: {
      name: "free",
      limits: {},
      features: [],
    },
    subscription: null,
    isLoading: false,
    error: null,
    lastRefreshTime: null,
  });

  // Get fresh plan data from the API
  const refreshPlan = useCallback(
    async (force = false) => {
      // Skip if not authenticated
      if (!isAuthenticated) return null;

      // Skip refresh if done recently (within last minute) unless forced
      const now = Date.now();
      if (
        !force &&
        currentPlan.lastRefreshTime &&
        now - currentPlan.lastRefreshTime < 60000
      ) {
        return currentPlan;
      }

      try {
        setCurrentPlan((prev) => ({ ...prev, isLoading: true, error: null }));
        const planData = await planService.loadCurrentPlan();

        // Create well-formed object with sensible defaults
        const safeData = {
          plan: {
            name: planData?.plan?.name || "free",
            limits: planData?.plan?.limits || {},
            features: planData?.plan?.features || [],
            _id: planData?.plan?._id || null,
          },
          subscription: planData?.subscription || null,
          isLoading: false,
          error: null,
          lastRefreshTime: now,
        };

        setCurrentPlan(safeData);
        return safeData;
      } catch (error) {
        console.error("Error refreshing plan:", error);
        setCurrentPlan((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to load plan data",
          lastRefreshTime: now,
        }));
        return null;
      }
    },
    [isAuthenticated, currentPlan.lastRefreshTime]
  );

  // Load plan data on initial mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshPlan();
    }
  }, [isAuthenticated, refreshPlan]);

  return { ...currentPlan, refreshPlan };
};

export default useCurrentPlan;
