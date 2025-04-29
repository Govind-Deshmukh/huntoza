import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  // Get plan and billing info from location state
  const { planId, billingType } = location.state || {};

  // Error handling
  const error = dataError || razorpayError;
  const isLoading = dataLoading || razorpayLoading;

  useEffect(() => {
    // Redirect if no plan data
    if (!planId || !billingType) {
      navigate("/plans");
      return;
    }

    const initializePayment = async () => {
      try {
        setPaymentProcessing(true);
        clearError();

        // Create payment order
        const orderData = await createPaymentOrder(planId, billingType);
        setPaymentData(orderData);
        setPaymentProcessing(false);
      } catch (err) {
        setPaymentProcessing(false);
      }
    };

    initializePayment();
  }, [planId, billingType, createPaymentOrder, navigate, clearError]);

  const handlePayment = async () => {
    if (!paymentData) return;

    try {
      setPaymentProcessing(true);

      // Process payment with Razorpay
      const response = await processPayment(paymentData, {
        name: user?.name || paymentData.user?.name,
        email: user?.email || paymentData.user?.email,
      });

      // Handle payment success
      await handlePaymentSuccess(response, paymentData.transaction);
    } catch (err) {
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
      console.error("Payment verification failed:", err);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate("/plans");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {paymentSuccess ? "Payment Successful" : "Complete Payment"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {paymentSuccess
            ? "Your plan has been upgraded successfully"
            : "Complete your payment to activate your subscription"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLoading || paymentProcessing ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">
                {paymentProcessing
                  ? "Processing your payment..."
                  : "Initializing payment..."}
              </p>
            </div>
          ) : paymentSuccess ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
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
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Payment Successful
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Thank you for your payment. Your subscription has been
                activated.
              </p>
              <div className="mt-5">
                <p className="text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Payment Failed
              </h3>
              <p className="mt-2 text-sm text-red-600">{error}</p>
              <div className="mt-5 flex justify-center space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : !paymentData ? (
            <div className="text-center py-6">
              <p className="text-gray-700">Preparing payment details...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Please click the button below to proceed with your payment.
              </p>
              <button
                onClick={handlePayment}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Pay Now
              </button>
              <button
                onClick={handleCancel}
                className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {paymentData && !paymentSuccess && !isLoading && !paymentProcessing && (
          <div className="mt-4 bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="border-t border-gray-200 pt-4">
              <dl className="divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Plan</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {paymentData.order.notes?.planName
                      ? paymentData.order.notes.planName
                          .charAt(0)
                          .toUpperCase() +
                        paymentData.order.notes.planName.slice(1) +
                        " Plan"
                      : "Subscription"}
                  </dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Billing</dt>
                  <dd className="text-sm font-medium text-gray-900 capitalize">
                    {paymentData.order.notes?.billingType || billingType}
                  </dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: paymentData.order.currency || "INR",
                      minimumFractionDigits: 0,
                    }).format(paymentData.order.amount / 100)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
