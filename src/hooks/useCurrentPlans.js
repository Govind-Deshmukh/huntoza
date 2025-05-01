import { useState, useEffect } from "react";
import { planService } from "../services";

/**
 * Custom hook to safely load and manage current plan data
 * Handles null values gracefully to prevent "is undefined" errors
 *
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {Object} The user's current plan with safe access
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
  });

  useEffect(() => {
    const loadPlan = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setCurrentPlan((prev) => ({ ...prev, isLoading: true, error: null }));
        const planData = await planService.loadCurrentPlan();

        // Ensure we have sensible defaults even if data is incomplete
        const safeData = {
          plan: {
            name: planData?.plan?.name || "free",
            limits: planData?.plan?.limits || {},
            features: planData?.plan?.features || [],
          },
          subscription: planData?.subscription || null,
          isLoading: false,
          error: null,
        };

        setCurrentPlan(safeData);
      } catch (error) {
        console.error("Error loading current plan:", error);
        setCurrentPlan((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to load plan data",
        }));
      }
    };

    loadPlan();
  }, [isAuthenticated]);

  const refreshPlan = async () => {
    if (!isAuthenticated) return;

    try {
      setCurrentPlan((prev) => ({ ...prev, isLoading: true, error: null }));
      const planData = await planService.loadCurrentPlan();

      setCurrentPlan({
        plan: {
          name: planData?.plan?.name || "free",
          limits: planData?.plan?.limits || {},
          features: planData?.plan?.features || [],
        },
        subscription: planData?.subscription || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error refreshing plan:", error);
      setCurrentPlan((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to refresh plan data",
      }));
    }
  };

  return { ...currentPlan, refreshPlan };
};

export default useCurrentPlan;
