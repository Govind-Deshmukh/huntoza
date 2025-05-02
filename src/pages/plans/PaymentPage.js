// src/pages/plans/PaymentPage.js - Let's enhance this

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import useRazorpay from "../../hooks/useRazerpay";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    createPaymentOrder,
    verifyPayment,
    isLoading: dataLoading,
    error: dataError,
  } = useData();

  const {
    processPayment,
    isLoading: razorpayLoading,
    error: razorpayError,
    clearError,
  } = useRazorpay();

  const [paymentData, setPaymentData] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Get plan and billing info from location state
  const { planId, billingType } = location.state || {};

  // Combined error and loading states
  const error = dataError || razorpayError || paymentError;
  const isLoading = dataLoading || razorpayLoading;

  useEffect(() => {
    // Clear errors on component mount
    clearError();

    // Redirect if no plan data is present
    if (!planId || !billingType) {
      navigate("/plans");
      return;
    }

    const initializePayment = async () => {
      try {
        setPaymentProcessing(true);

        // Create payment order
        const orderData = await createPaymentOrder(planId, billingType);
        setPaymentData(orderData);
      } catch (err) {
        setPaymentError(err.message || "Failed to create payment order");
        console.error("Payment initialization error:", err);
      } finally {
        setPaymentProcessing(false);
      }
    };

    initializePayment();
  }, [planId, billingType, createPaymentOrder, navigate, clearError]);

  const handlePayment = async () => {
    if (!paymentData) return;

    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      // Process payment with Razorpay
      const response = await processPayment(paymentData, {
        name: user?.name || paymentData.user?.name,
        email: user?.email || paymentData.user?.email,
      });

      // Handle payment success
      await handlePaymentSuccess(response, paymentData.transaction);
    } catch (err) {
      setPaymentError(err.message || "Payment processing failed");
      console.error("Payment failed:", err);
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

      await verifyPayment(verificationData);

      // Show success message
      setPaymentSuccess(true);

      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            message: "Payment successful! Your plan has been upgraded.",
            type: "success",
          },
        });
      }, 3000);
    } catch (err) {
      setPaymentError(err.message || "Payment verification failed");
      console.error("Payment verification failed:", err);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate("/plans");
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

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {paymentSuccess ? "Payment Successful!" : "Complete Your Payment"}
            </h1>
            <p className="mt-2 text-gray-600">
              {paymentSuccess
                ? "Your plan has been upgraded successfully."
                : "Please review your plan details and proceed with payment."}
            </p>
          </div>

          {/* Loading state */}
          {(isLoading || paymentProcessing) && (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-700">
                {paymentProcessing ? "Processing payment..." : "Loading..."}
              </span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <h3 className="text-sm font-medium text-red-800">
                    Payment Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {paymentSuccess && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
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
                <h2 className="mt-3 text-lg font-medium text-gray-900">
                  Payment successful!
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Thank you for your payment. Your subscription has been
                  activated.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Payment details */}
          {!isLoading &&
            !paymentProcessing &&
            !paymentSuccess &&
            paymentData && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {paymentData.order.notes?.planName || "Subscription"} Plan
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Billing Cycle</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {paymentData.order.notes?.billingType || billingType}
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
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
