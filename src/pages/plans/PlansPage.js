import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const PlansPage = () => {
  const { plans, loadPlans, currentPlan, isLoading, error } = useData();
  const [selectedBillingType, setSelectedBillingType] = useState("monthly");

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Toggle between monthly and yearly pricing
  const handleBillingTypeChange = (type) => {
    setSelectedBillingType(type);
  };

  // Calculate yearly savings
  const calculateYearlySavings = (plan) => {
    if (!plan || !plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Choose Your Plan
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Select a plan that fits your job search needs
            </p>
          </div>

          {/* Billing toggle */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => handleBillingTypeChange("monthly")}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedBillingType === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300 rounded-l-md focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleBillingTypeChange("yearly")}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedBillingType === "yearly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700`}
              >
                Yearly{" "}
                <span className="text-green-500 font-bold">
                  (Save up to 20%)
                </span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center my-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan cards */}
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-lg shadow overflow-hidden border"
                >
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-blue-600">
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}{" "}
                      Plan
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="px-6 py-4">
                    {plan.name === "free" ? (
                      <p className="text-3xl font-bold text-gray-900">
                        Free
                        <span className="text-base font-normal text-gray-500"></span>
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        ₹
                        {selectedBillingType === "monthly"
                          ? plan.price.monthly
                          : plan.price.yearly}
                        <span className="text-base font-normal text-gray-500">
                          /
                          {selectedBillingType === "monthly" ? "month" : "year"}
                        </span>
                      </p>
                    )}

                    {selectedBillingType === "yearly" &&
                      plan.name !== "free" && (
                        <p className="mt-1 text-sm text-green-600">
                          Save {calculateYearlySavings(plan)}% compared to
                          monthly
                        </p>
                      )}

                    <ul className="mt-6 space-y-3">
                      {plan.features
                        .filter((feature) => feature.included)
                        .map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            <span className="ml-2 text-sm text-gray-600">
                              {feature.name}
                            </span>
                          </li>
                        ))}
                    </ul>

                    <div className="mt-6">
                      {currentPlan &&
                      currentPlan.plan &&
                      currentPlan.plan.name === plan.name ? (
                        <button
                          className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          disabled
                        >
                          Current Plan
                        </button>
                      ) : (
                        <Link
                          to="/payment"
                          state={{
                            planId: plan._id,
                            billingType: selectedBillingType,
                          }}
                          className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {plan.name === "free"
                            ? "Select Free Plan"
                            : "Select Plan"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plan comparison */}
          <div className="mt-10 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Plan Comparison
              </h2>
            </div>
            <div className="px-6 py-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan._id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Job Applications
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan._id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {plan.limits?.jobApplications === -1
                          ? "Unlimited"
                          : `Up to ${plan.limits?.jobApplications}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Contacts
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan._id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {plan.limits?.contacts === -1
                          ? "Unlimited"
                          : `Up to ${plan.limits?.contacts}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Document Storage
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan._id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {plan.limits?.documentStorage === -1
                          ? "Unlimited"
                          : `${plan.limits?.documentStorage} MB`}
                      </td>
                    ))}
                  </tr>
                  {/* Additional feature rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlansPage;
