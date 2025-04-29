import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PlansPage = () => {
  const { user } = useAuth();
  const {
    plans,
    loadPlans,
    isLoading,
    error,
    currentPlan,
    loadCurrentPlan,
    createPaymentOrder,
    verifyPayment,
  } = useData();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const navigate = useNavigate();

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
    loadCurrentPlan();
  }, [loadPlans, loadCurrentPlan]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBillingTypeChange = (e) => {
    setBillingType(e.target.value);
  };

  const initializePayment = async () => {
    if (!selectedPlan) return;

    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      // Create payment order
      const orderData = await createPaymentOrder(selectedPlan._id, billingType);

      if (orderData) {
        // Initialize Razorpay checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "Job Hunt Tracker",
          description: `${selectedPlan.name} Plan (${billingType})`,
          order_id: orderData.order.id,
          prefill: {
            name: user.name,
            email: user.email,
          },
          handler: function (response) {
            handlePaymentSuccess(response, orderData.transaction);
          },
          modal: {
            ondismiss: function () {
              setPaymentProcessing(false);
            },
          },
          theme: {
            color: "#3498db",
          },
        };

        // Load Razorpay script and open checkout
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      setPaymentError(err.message || "Failed to process payment");
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = async (response, transactionId) => {
    try {
      // Verify payment with backend
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        transactionId: transactionId,
      };

      // Using verifyPayment from the useData hook that was already declared at the top level
      await verifyPayment(verificationData);

      // Refresh current plan data
      await loadCurrentPlan();

      // Redirect to dashboard with success message
      navigate("/dashboard", {
        state: {
          message: "Payment successful! Your plan has been upgraded.",
          type: "success",
        },
      });
    } catch (err) {
      setPaymentError(err.message || "Payment verification failed");
      setPaymentProcessing(false);
    }
  };

  const getPlanPrice = (plan) => {
    if (!plan || !plan.price) return "";
    return billingType === "monthly"
      ? `₹${plan.price.monthly}/month`
      : `₹${plan.price.yearly}/year (Save ${calculateYearlySavings(plan)}%)`;
  };

  const calculateYearlySavings = (plan) => {
    if (!plan || !plan.price) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };

  const isPlanActive = (plan) => {
    return currentPlan && currentPlan.plan && currentPlan.plan._id === plan._id;
  };

  // If loading, show spinner
  if (isLoading && !plans.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select the plan that best fits your job search needs
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
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
                Yearly <span className="text-green-600">(Save up to 20%)</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 max-w-md mx-auto bg-red-50 p-4 rounded-md text-red-700">
            {error}
          </div>
        )}

        {paymentError && (
          <div className="mb-8 max-w-md mx-auto bg-red-50 p-4 rounded-md text-red-700">
            {paymentError}
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                selectedPlan && selectedPlan._id === plan._id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              {/* Plan header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              </div>

              {/* Plan price */}
              <div className="px-6 pt-4 pb-2">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.name === "free" ? "Free" : getPlanPrice(plan)}
                </div>
                {isPlanActive(plan) && (
                  <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Current Plan
                  </span>
                )}
              </div>

              {/* Plan features */}
              <div className="px-6 py-4">
                <ul className="mt-4 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className={`flex-shrink-0 h-5 w-5 ${
                          feature.included ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {feature.included ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        )}
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan limits */}
              <div className="px-6 py-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">
                  Plan Limits
                </h4>
                <ul className="mt-2 space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Job Applications</span>
                    <span className="font-medium">
                      {plan.limits.jobApplications === -1
                        ? "Unlimited"
                        : plan.limits.jobApplications}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Contacts</span>
                    <span className="font-medium">
                      {plan.limits.contacts === -1
                        ? "Unlimited"
                        : plan.limits.contacts}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Document Storage</span>
                    <span className="font-medium">
                      {plan.limits.documentStorage === -1
                        ? "Unlimited"
                        : `${plan.limits.documentStorage} MB`}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action button */}
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isPlanActive(plan) || paymentProcessing}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                    isPlanActive(plan)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  {isPlanActive(plan)
                    ? "Current Plan"
                    : plan.name === "free"
                    ? "Select Free Plan"
                    : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected plan action */}
        {selectedPlan && (
          <div className="mt-12 text-center">
            <h2 className="text-lg font-medium text-gray-900">
              You've selected the{" "}
              {selectedPlan.name.charAt(0).toUpperCase() +
                selectedPlan.name.slice(1)}{" "}
              Plan
            </h2>
            <p className="mt-2 text-gray-600">
              {selectedPlan.name === "free"
                ? "The Free plan includes basic features to help you get started with your job hunt."
                : `You'll be charged ${
                    billingType === "monthly"
                      ? `₹${selectedPlan.price.monthly} per month`
                      : `₹${selectedPlan.price.yearly} per year`
                  }.`}
            </p>
            <button
              onClick={
                selectedPlan.name === "free"
                  ? () => navigate("/dashboard")
                  : initializePayment
              }
              disabled={paymentProcessing}
              className="mt-4 px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {paymentProcessing
                ? "Processing..."
                : selectedPlan.name === "free"
                ? "Confirm Free Plan"
                : "Proceed to Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;
