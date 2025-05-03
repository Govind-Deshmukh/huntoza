// src/pages/dashboard/PlansPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const PlansPage = () => {
  const navigate = useNavigate();
  const { plans, loadPlans, currentPlan, isLoading, error } = useData();
  const [billingType, setBillingType] = useState("monthly");

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSelectPlan = (planId) => {
    // If it's the current plan, don't do anything
    if (currentPlan?.plan?._id === planId) {
      return;
    }

    // Navigate to payment page with plan details
    navigate("/payment", {
      state: { planId, billingType },
    });
  };

  const calculateSavings = (plan) => {
    if (!plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyTotal = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Select a Plan
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Choose the plan that fits your job hunting needs.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative inline-flex self-center rounded-lg bg-gray-100 p-1">
              <button
                className={`${
                  billingType === "monthly"
                    ? "bg-white shadow-sm"
                    : "bg-transparent"
                } relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                onClick={() => setBillingType("monthly")}
              >
                Monthly
              </button>
              <button
                className={`${
                  billingType === "yearly"
                    ? "bg-white shadow-sm"
                    : "bg-transparent"
                } relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                onClick={() => setBillingType("yearly")}
              >
                Yearly <span className="text-green-500">(Save up to 20%)</span>
              </button>
            </div>
          </div>

          {/* Plans grid */}
          {isLoading ? (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="mt-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`flex flex-col rounded-lg shadow-lg overflow-hidden border ${
                    currentPlan?.plan?._id === plan._id
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-blue-500"
                  } transition-colors`}
                >
                  <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600">
                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                      </h3>
                      {currentPlan?.plan?._id === plan._id && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                      {plan.name === "free" ? (
                        <span>Free</span>
                      ) : (
                        <>
                          <span>
                            ₹
                            {billingType === "monthly"
                              ? plan.price.monthly
                              : plan.price.yearly}
                          </span>
                          <span className="ml-1 text-2xl font-medium text-gray-500">
                            /{billingType === "monthly" ? "mo" : "yr"}
                          </span>
                        </>
                      )}
                    </div>
                    {billingType === "yearly" && plan.name !== "free" && (
                      <p className="mt-2 text-sm text-green-600">
                        Save {calculateSavings(plan)}% with annual billing
                      </p>
                    )}
                    <p className="mt-5 text-lg text-gray-500">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className={`h-6 w-6 ${
                                feature.included
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }`}
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
                          </div>
                          <p
                            className={`ml-3 text-base ${
                              feature.included
                                ? "text-gray-700"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.name}
                          </p>
                        </li>
                      ))}
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-green-500"
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
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {plan.limits.jobApplications === -1
                            ? "Unlimited job applications"
                            : `Up to ${plan.limits.jobApplications} job applications`}
                        </p>
                      </li>
                    </ul>
                    <button
                      onClick={() => handleSelectPlan(plan._id)}
                      disabled={currentPlan?.plan?._id === plan._id}
                      className={`inline-flex items-center justify-center px-5 py-3 border ${
                        currentPlan?.plan?._id === plan._id
                          ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "border-transparent bg-blue-600 text-white hover:bg-blue-700"
                      } text-base font-medium rounded-md`}
                    >
                      {currentPlan?.plan?._id === plan._id
                        ? "Current Plan"
                        : plan.name === "free"
                        ? "Downgrade to Free"
                        : "Select Plan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlansPage;
