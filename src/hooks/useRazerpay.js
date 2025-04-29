import { useState, useCallback } from "react";

/**
 * Custom hook to integrate Razorpay payment gateway
 * @returns {Object} Razorpay integration methods and state
 */
const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load Razorpay script asynchronously
   * @returns {Promise} Promise that resolves when Razorpay script is loaded
   */
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
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

  /**
   * Initialize and open Razorpay payment
   * @param {Object} options - Razorpay payment options
   * @returns {Promise} Promise that resolves after payment completion or rejection
   */
  const openRazorpayCheckout = useCallback(
    async (options) => {
      setIsLoading(true);
      setError(null);

      try {
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          await loadRazorpayScript();
        }

        return new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            ...options,
            handler: (response) => {
              resolve(response);
            },
            modal: {
              ondismiss: () => {
                reject(new Error("Payment canceled by user"));
              },
            },
          });

          rzp.on("payment.failed", (resp) => {
            reject(new Error(resp.error.description || "Payment failed"));
          });

          rzp.open();
        });
      } catch (err) {
        setError(err.message || "Failed to initialize payment");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadRazorpayScript]
  );

  /**
   * Process payment with Razorpay
   * @param {Object} paymentData - Payment details including order ID, amount, etc.
   * @param {Object} userData - User information for prefill
   * @returns {Promise} Promise that resolves with payment response
   */
  const processPayment = useCallback(
    async (paymentData, userData) => {
      if (!paymentData || !paymentData.order || !paymentData.keyId) {
        throw new Error("Invalid payment data");
      }

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
      };

      try {
        return await openRazorpayCheckout(options);
      } catch (err) {
        setError(err.message || "Payment processing failed");
        throw err;
      }
    },
    [openRazorpayCheckout]
  );

  return {
    isLoading,
    error,
    processPayment,
    clearError: () => setError(null),
  };
};

export default useRazorpay;
