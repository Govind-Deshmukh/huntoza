// src/hooks/useRazorpay.js - This is an improved version with better error handling
import { useState, useCallback } from "react";

const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error("Razorpay SDK failed to load"));
        }
      };

      script.onerror = () => {
        reject(new Error("Failed to load Razorpay SDK"));
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
        const Razorpay = await loadRazorpayScript();

        return new Promise((resolve, reject) => {
          const options = {
            key: paymentData.keyId,
            amount: paymentData.order.amount,
            currency: paymentData.order.currency || "INR",
            name: "Job Hunt Tracker",
            description: `${
              paymentData.order.notes?.planName || "Premium"
            } Plan`,
            order_id: paymentData.order.id,
            prefill: {
              name: userData?.name || "",
              email: userData?.email || "",
              contact: userData?.phone || "",
            },
            theme: {
              color: "#3f51b5",
            },
            modal: {
              ondismiss: function () {
                reject(new Error("Payment canceled by user"));
              },
            },
            notes: {
              plan_id: paymentData.order.notes?.planId,
              transaction_id: paymentData.transaction,
            },
          };

          const razorpayInstance = new Razorpay(options);

          razorpayInstance.on("payment.success", function (response) {
            resolve(response);
          });

          razorpayInstance.on("payment.error", function (response) {
            reject(new Error(response.error?.description || "Payment failed"));
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
