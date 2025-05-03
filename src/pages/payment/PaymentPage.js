// src/pages/plans/PaymentPage.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const PaymentPage = () => {
  // Get router location and navigate function
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get needed functions from DataContext
  const {
    plans,
    loadPlans,
    currentPlan,
    createPaymentOrder,
    verifyPayment,
    initiatePlanUpgrade,
    isLoading,
    error,
    clearError,
  } = useData();

  // Component state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, failed
  const [processingError, setProcessingError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // Get plan and billing info from location state
  const { planId, billingType, fromRegistration } = location.state || {};

  // Load the selected plan details when component mounts
  useEffect(() => {
    clearError();

    // If no plan data is present, redirect to plans page
    if (!planId || !billingType) {
      navigate("/plans");
      return;
    }

    // Load plan details
    const loadPlanDetails = async () => {
      try {
        // Load all plans if not already loaded
        const plansData = await loadPlans();

        // Find the selected plan in the loaded plans
        const plan = plansData.find((p) => p._id === planId);

        if (plan) {
          setSelectedPlan(plan);

          // If plan is free, handle it differently
          if (plan.name === "free") {
            await handleFreePlan(planId);
          } else {
            // For paid plans, create a payment order
            await initiatePayment(planId, billingType);
          }
        } else {
          setProcessingError("Selected plan not found");
        }
      } catch (err) {
        setProcessingError(err.message || "Failed to load plan details");
      }
    };

    loadPlanDetails();
  }, [planId, billingType, loadPlans, navigate, clearError]);

  // Handle free plan selection
  const handleFreePlan = async (planId) => {
    try {
      setPaymentStatus("processing");
      await initiatePlanUpgrade(planId, "one-time");
      setPaymentStatus("success");

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            message: "Free plan activated successfully!",
            type: "success",
          },
        });
      }, 2000);
    } catch (err) {
      setPaymentStatus("failed");
      setProcessingError(err.message || "Failed to activate free plan");
    }
  };

  // Initiate payment process
  const initiatePayment = async (planId, billingType) => {
    try {
      setPaymentStatus("processing");

      // Create payment order
      const orderData = await createPaymentOrder(planId, billingType);

      if (orderData && orderData.order) {
        setPaymentData(orderData);
        setOrderId(orderData.order.id);
        setTransactionId(orderData.transaction);
        setPaymentStatus("pending"); // Ready for payment
      } else {
        throw new Error("Invalid payment order data received");
      }
    } catch (err) {
      setPaymentStatus("failed");
      setProcessingError(err.message || "Failed to create payment order");
    }
  };

  // Handle Razorpay payment
  const handlePayment = () => {
    if (!paymentData || !orderId) {
      setProcessingError("Payment data not available");
      return;
    }

    setPaymentStatus("processing");

    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const options = {
        key: paymentData.keyId,
        amount: paymentData.order.amount,
        currency: paymentData.order.currency || "INR",
        name: "Job Hunt Tracker",
        description: `${
          paymentData.order.notes?.planName || "Subscription"
        } Plan`,
        order_id: orderId,
        handler: function (response) {
          // Handle successful payment
          handlePaymentSuccess(response);
        },
        prefill: {
          name: user?.name || paymentData.user?.name,
          email: user?.email || paymentData.user?.email,
        },
        notes: {
          plan_id: paymentData.order.notes?.planId,
          transaction_id: transactionId,
        },
        theme: {
          color: "#3f51b5",
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("pending");
          },
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        setPaymentStatus("failed");
        setProcessingError("Failed to initialize payment gateway");
      }
    };

    script.onerror = () => {
      setPaymentStatus("failed");
      setProcessingError("Failed to load payment gateway");
    };

    document.body.appendChild(script);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response) => {
    try {
      if (
        !response.razorpay_payment_id ||
        !response.razorpay_order_id ||
        !response.razorpay_signature
      ) {
        throw new Error("Invalid payment response");
      }

      // Verify payment with backend
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        transactionId: transactionId,
      };

      await verifyPayment(verificationData);
      setPaymentStatus("success");

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            message: "Payment successful! Your plan has been activated.",
            type: "success",
          },
        });
      }, 2000);
    } catch (err) {
      setPaymentStatus("failed");
      setProcessingError(err.message || "Payment verification failed");
    }
  };

  // Handle payment retry
  const handleRetry = async () => {
    // Clear any existing errors
    setProcessingError(null);

    // Reinitiate payment
    await initiatePayment(planId, billingType);
  };

  // Cancel payment and go to dashboard with free plan
  const handleCancel = async () => {
    try {
      // If user is from registration, activate free plan
      if (fromRegistration) {
        // Find free plan
        const freePlan = plans.find((p) => p.name === "free");
        if (freePlan) {
          await handleFreePlan(freePlan._id);
        } else {
          // If no free plan found, just redirect
          navigate("/dashboard");
        }
      } else {
        navigate("/plans");
      }
    } catch (err) {
      navigate("/dashboard");
    }
  };

  // Format currency for display
  const formatCurrency = (amount, currency = "INR") => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    });

    return formatter.format(amount / 100);
  };

  // Render appropriate UI based on payment status
  const renderPaymentContent = () => {
    if (isLoading || paymentStatus === "processing") {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Processing your payment...</p>
        </div>
      );
    }

    if (paymentStatus === "success") {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
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
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your subscription has been activated. You will be redirected to
            dashboard shortly.
          </p>
        </div>
      );
    }

    if (paymentStatus === "failed" || processingError) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-red-600 mb-4">
            {processingError || "There was an issue processing your payment."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {fromRegistration ? "Continue with Free Plan" : "Cancel"}
            </button>
          </div>
        </div>
      );
    }

    // Default: pending payment
    return (
      <>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {selectedPlan && paymentData && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Complete Your Payment
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                You're about to subscribe to the{" "}
                {selectedPlan.name.charAt(0).toUpperCase() +
                  selectedPlan.name.slice(1)}{" "}
                Plan
              </p>
            </div>

            <div className="px-6 py-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-800 capitalize">
                  {selectedPlan.name} Plan
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-medium text-gray-800 capitalize">
                  {billingType}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(
                    paymentData.order.amount,
                    paymentData.order.currency
                  )}
                </span>
              </div>

              {/* Features section */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Included Features:
                </h3>
                <ul className="space-y-2">
                  {selectedPlan.features
                    .filter((feature) => feature.included)
                    .slice(0, 4)
                    .map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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

            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {fromRegistration ? "Continue with Free Plan" : "Cancel"}
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {paymentStatus === "success"
                ? "Payment Successful!"
                : paymentStatus === "failed"
                ? "Payment Failed"
                : "Complete Your Payment"}
            </h1>
            {paymentStatus === "pending" && selectedPlan && (
              <p className="mt-2 text-gray-600">
                Please review your selected plan and proceed with payment
              </p>
            )}
          </div>

          {renderPaymentContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
