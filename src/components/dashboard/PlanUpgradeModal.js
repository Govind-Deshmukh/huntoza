// Create a new file: src/components/dashboard/PlanUpgradeModal.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

const PlanUpgradeModal = ({ isOpen, onClose }) => {
  const { plans, loadPlans, currentPlan } = useData();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen, loadPlans]);

  // Filter out current plan and lower-tier plans
  const availablePlans = plans.filter((plan) => {
    // If no current plan info, show all plans
    if (!currentPlan || !currentPlan.plan) return true;

    // Free plan users can see all paid plans
    if (currentPlan.plan.name === "free") return plan.name !== "free";

    // Logic for upgrading between paid plans
    // This is simplified - you'd need proper plan hierarchy logic
    const planOrder = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    return planOrder[plan.name] > planOrder[currentPlan.plan.name];
  });

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = () => {
    if (!selectedPlan) return;

    navigate("/payment", {
      state: {
        planId: selectedPlan._id,
        billingType: billingType,
        isUpgrade: true,
      },
    });

    onClose();
  };

  const calculateYearlySavings = (plan) => {
    if (!plan || !plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upgrade Your Plan
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Choose a plan that best fits your needs
                  </p>

                  {/* Billing toggle */}
                  <div className="flex justify-center my-4">
                    <div className="relative flex items-center">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="modal-monthly"
                          name="modal-billing-type"
                          value="monthly"
                          checked={billingType === "monthly"}
                          onChange={() => setBillingType("monthly")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="modal-monthly"
                          className="ml-2 text-gray-700"
                        >
                          Monthly
                        </label>
                      </div>
                      <div className="flex items-center ml-6">
                        <input
                          type="radio"
                          id="modal-yearly"
                          name="modal-billing-type"
                          value="yearly"
                          checked={billingType === "yearly"}
                          onChange={() => setBillingType("yearly")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="modal-yearly"
                          className="ml-2 text-gray-700"
                        >
                          Yearly{" "}
                          <span className="text-green-600">
                            (Save up to 20%)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="space-y-4 mt-4">
                    {availablePlans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`border rounded-md p-4 ${
                          selectedPlan && selectedPlan._id === plan._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        } cursor-pointer`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`modal-plan-${plan._id}`}
                              name="modal-plan"
                              checked={
                                selectedPlan && selectedPlan._id === plan._id
                              }
                              onChange={() => handlePlanSelect(plan)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor={`modal-plan-${plan._id}`}
                              className="ml-3 block font-medium text-gray-700"
                            >
                              {plan.name.charAt(0).toUpperCase() +
                                plan.name.slice(1)}{" "}
                              Plan
                            </label>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-medium text-gray-900">
                              {billingType === "monthly"
                                ? `₹${plan.price.monthly}/month`
                                : `₹${plan.price.yearly}/year`}
                            </span>
                            {billingType === "yearly" && (
                              <span className="block text-sm text-green-600">
                                Save {calculateYearlySavings(plan)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {plan.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={!selectedPlan}
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
