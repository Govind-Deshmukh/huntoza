// Improved version of src/pages/auth/SignupWithPlanPage.js
// This page will handle both registration and plan selection

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const SignupWithPlanPage = () => {
  const {
    register,
    error: authError,
    isLoading: authLoading,
    clearError: clearAuthError,
  } = useAuth();
  const {
    plans,
    loadPlans,
    error: planError,
    isLoading: planLoading,
    clearError: clearPlanError,
  } = useData();
  const navigate = useNavigate();

  // Form states
  const [step, setStep] = useState(1); // 1: Account details, 2: Plan selection
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password match error when user types in password fields
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleBillingTypeChange = (e) => {
    setBillingType(e.target.value);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubmitAccountDetails = (e) => {
    e.preventDefault();
    clearAuthError();

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Proceed to plan selection
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    clearPlanError();

    // Check if a plan is selected
    if (!selectedPlan) {
      return;
    }

    try {
      // Register user with selected plan
      const userData = {
        name,
        email,
        password,
        planId: selectedPlan._id,
        billingType: billingType,
      };

      const response = await register(userData);

      // If the selected plan is free, redirect to dashboard
      if (selectedPlan.name === "free") {
        navigate("/dashboard");
        return;
      }

      // For paid plans, redirect to payment page with order details
      if (response && response.user) {
        navigate("/payment", {
          state: {
            planId: selectedPlan._id,
            billingType: billingType,
            userId: response.user._id,
            fromRegistration: true, // Flag to identify this is a new signup
          },
        });
      }
    } catch (err) {
      // Error is already handled by the AuthContext
      setStep(1); // Go back to step 1 if there's an error
    }
  };

  const calculateYearlySavings = (plan) => {
    if (!plan || !plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };

  // If loading plans, show spinner
  if (planLoading && !plans.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? "Create your account" : "Choose a plan"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 ? (
            <>
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                sign in to your existing account
              </Link>
            </>
          ) : (
            "Select a plan that fits your job search needs"
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md lg:max-w-2xl">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center relative">
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  step >= 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span className="text-white font-bold">1</span>
              </div>
              <div className="text-center absolute -bottom-6 w-32 text-xs font-medium text-gray-600">
                Account Details
              </div>
            </div>

            <div
              className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                step >= 2 ? "border-blue-600" : "border-gray-300"
              }`}
            ></div>

            <div className="flex items-center relative">
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span className="text-white font-bold">2</span>
              </div>
              <div className="text-center absolute -bottom-6 w-32 text-xs font-medium text-gray-600">
                Choose Plan
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Account Details */}
        {step === 1 && (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {authError && (
              <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {authError}
              </div>
            )}

            {passwordError && (
              <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {passwordError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmitAccountDetails}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {authLoading ? "Processing..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {planError && (
              <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {planError}
              </div>
            )}

            {/* Billing toggle */}
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="monthly"
                    name="billing-type"
                    value="monthly"
                    checked={billingType === "monthly"}
                    onChange={handleBillingTypeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="monthly" className="ml-2 text-gray-700">
                    Monthly
                  </label>
                </div>
                <div className="flex items-center ml-6">
                  <input
                    type="radio"
                    id="yearly"
                    name="billing-type"
                    value="yearly"
                    checked={billingType === "yearly"}
                    onChange={handleBillingTypeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="yearly" className="ml-2 text-gray-700">
                    Yearly{" "}
                    <span className="text-green-600">(Save up to 20%)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`border rounded-md p-4 ${
                    selectedPlan && selectedPlan._id === plan._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`plan-${plan._id}`}
                        name="plan"
                        checked={selectedPlan && selectedPlan._id === plan._id}
                        onChange={() => handlePlanSelect(plan)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={`plan-${plan._id}`}
                        className="ml-3 block font-medium text-gray-700"
                      >
                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}{" "}
                        Plan
                      </label>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-medium text-gray-900">
                        {plan.name === "free"
                          ? "Free"
                          : billingType === "monthly"
                          ? `₹${plan.price.monthly}/month`
                          : `₹${plan.price.yearly}/year`}
                      </span>
                      {billingType === "yearly" && plan.name !== "free" && (
                        <span className="block text-sm text-green-600">
                          Save {calculateYearlySavings(plan)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {plan.description}
                  </p>

                  {/* Plan features */}
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Features
                    </h4>
                    <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {plan.features
                        .filter((f) => f.included)
                        .slice(0, 4)
                        .map((feature, i) => (
                          <li key={i} className="flex items-start">
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
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedPlan || authLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {authLoading
                  ? "Processing..."
                  : selectedPlan && selectedPlan.name === "free"
                  ? "Create Free Account"
                  : "Continue to Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupWithPlanPage;
