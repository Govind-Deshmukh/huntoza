// Razorpay utility functions
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new Razorpay order
const createOrder = async ({ amount, currency, receipt, notes }) => {
  try {
    const options = {
      amount,
      currency: currency || "INR",
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay create order error:", error);
    throw error;
  }
};

// Verify payment signature
const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  try {
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    return false;
  }
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Razorpay get payment details error:", error);
    throw error;
  }
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  getPaymentDetails,
};
