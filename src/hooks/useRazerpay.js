// src/hooks/useRazorpay.js

import { useState, useCallback } from "react";

const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        reject(
          new Error(
            "Failed to load Razorpay SDK. Please check your internet connection."
          )
        );
      };

      document.body.appendChild(script);
    });
  }, []);

  // Process payment with Razorpay
  const processPayment = useCallback(
    async (paymentData, userData) => {
      if (!paymentData || !paymentData.order || !paymentData.keyId) {
        throw new Error("Invalid payment data");
      }

      setIsLoading(true);
      setError(null);

      try {
        // Load Razorpay script if not already loaded
        await loadRazorpayScript();

        const options = {
          key: paymentData.keyId,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency || "INR",
          name: "Job Hunt Tracker",
          description: "Plan Subscription",
          order_id: paymentData.order.id,
          prefill: {
            name: userData?.name || "",
            email: userData?.email || "",
            contact: userData?.phone || "",
          },
          theme: {
            color: "#3498db",
          },
          modal: {
            ondismiss: function () {
              setError("Payment cancelled by user");
            },
          },
          notes: {
            plan_id: paymentData.order.notes.planId,
            billing_type: paymentData.order.notes.billingType,
            transaction_id: paymentData.transaction,
          },
        };

        return new Promise((resolve, reject) => {
          const razorpayInstance = new window.Razorpay({
            ...options,
            handler: (response) => {
              resolve(response);
            },
          });

          razorpayInstance.on("payment.failed", (resp) => {
            reject(new Error(resp.error.description || "Payment failed"));
          });

          razorpayInstance.open();
        });
      } catch (err) {
        setError(err.message || "Payment processing failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadRazorpayScript]
  );

  return {
    isLoading,
    error,
    processPayment,
    clearError: () => setError(null),
  };
};

export default useRazorpay;
