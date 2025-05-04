// src/components/home/PricingSection.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const [plans, setPlans] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingType, setBillingType] = useState("monthly");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/plans`);
        if (!response.ok) throw new Error("Failed to fetch plans");
        const data = await response.json();
        setPlans(data.plans);
        setError(null);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load pricing plans. Please try again later.");
        setPlans(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const calculateSavings = (plan) => {
    if (!plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyTotal = plan.price.yearly;

    if (monthlyTotal === 0 || yearlyTotal === 0) return 0;

    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  if (isLoading) {
    return (
      <div id="pricing" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The right price for your job search needs
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Choose the plan that fits your needs, from free to enterprise
              level.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="pricing" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            The right price for your job search needs
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the plan that fits your needs, from free to enterprise level.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-12 flex justify-center">
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

        {error && (
          <div className="mt-4 text-center text-amber-600">{error}</div>
        )}

        <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600">
                    {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                  </h3>
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
                <p className="mt-5 text-lg text-gray-500">{plan.description}</p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  {plan.features &&
                    plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
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
                      {plan.limits?.jobApplications === -1
                        ? "Unlimited job applications"
                        : `Up to ${plan.limits?.jobApplications} job applications`}
                    </p>
                  </li>
                  {plan.limits?.documentStorage && (
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
                        {plan.limits.documentStorage === -1
                          ? "Unlimited storage"
                          : `${plan.limits.documentStorage} MB storage`}
                      </p>
                    </li>
                  )}
                </ul>
                <Link
                  to={`/register`}
                  state={{ planId: plan._id, billingType }}
                  className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {plan.name === "free" ? "Get started" : "Subscribe"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
