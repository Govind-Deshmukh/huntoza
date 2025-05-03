import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

const PlanUpgradeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { plans, loadPlans, currentPlan, isLoading, error } = useData();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");

  // Load plans when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen, loadPlans]);

  // Filter out current plan and lower-tier plans
  const getAvailablePlans = () => {
    if (!plans || !currentPlan?.plan) return [];

    // Get the current plan tier
    const planTiers = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    const currentTier = planTiers[currentPlan.plan.name] || 0;

    // Return only higher tier plans
    return plans.filter((plan) => {
      const planTier = planTiers[plan.name] || 0;
      return planTier > currentTier;
    });
  };

  const availablePlans = getAvailablePlans();

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = () => {
    if (!selectedPlan) return;

    // Navigate to payment page with plan info
    navigate("/payment", {
      state: {
        planId: selectedPlan._id,
        billingType,
        fromUpgrade: true,
      },
    });

    onClose();
  };

  // Calculate yearly savings compared to monthly
  const calculateYearlySavings = (plan) => {
    if (!plan?.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal content */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upgrade Your Plan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a plan that best fits your needs
                </p>
              </div>

              {/* Billing toggle */}
              <div className="flex justify-center my-6">
                <div className="relative inline-flex self-center rounded-lg bg-gray-100 p-1">
                  <button
                    className={`${
                      billingType === "monthly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    } relative w-28 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors`}
                    onClick={() => setBillingType("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    className={`${
                      billingType === "yearly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    } relative w-28 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors`}
                    onClick={() => setBillingType("yearly")}
                  >
                    Yearly
                    <span className="text-xs text-green-500 block">
                      Save up to 20%
                    </span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : availablePlans.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  You're already on our highest plan!
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {availablePlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`border ${
                        selectedPlan?._id === plan._id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200"
                      } rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                              {plan.name} Plan
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {plan.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ₹
                              {billingType === "monthly"
                                ? plan.price.monthly
                                : plan.price.yearly}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{billingType}
                            </div>
                            {billingType === "yearly" && (
                              <div className="text-xs text-green-500">
                                Save {calculateYearlySavings(plan)}%
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <ul className="space-y-2">
                            {plan.features
                              .filter((feature) => feature.included)
                              .slice(0, 4)
                              .map((feature, idx) => (
                                <li key={idx} className="flex">
                                  <svg
                                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-600">
                                    {feature.name}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {plan.limits.jobApplications === -1
                              ? "Unlimited applications"
                              : `${plan.limits.jobApplications} applications`}
                          </span>
                          <input
                            type="radio"
                            checked={selectedPlan?._id === plan._id}
                            onChange={() => handlePlanSelect(plan)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={!selectedPlan || isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-300"
            >
              Upgrade
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradeModal;
