// src/components/home/FaqSection.js
import React, { useState } from "react";

const FaqSection = () => {
  const faqs = [
    {
      question: "Is there a free plan available?",
      answer:
        "Yes, we offer a free plan that allows you to track up to 10 job applications. It's perfect for those who are just starting their job search.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Absolutely! You can upgrade your plan at any time to get access to more features. You can also downgrade at the end of your billing cycle.",
    },
    {
      question: "Is my data secure with PursuitPal?",
      answer:
        "Yes, we take security seriously. All your data is encrypted and stored securely. We never share your information with third parties.",
    },
    {
      question: "Can I access PursuitPal on mobile devices?",
      answer:
        "Yes, PursuitPal is fully responsive and works on all devices - desktops, tablets, and smartphones. Stay organized wherever you are.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Find answers to common questions about PursuitPal.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg mb-4 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transform ${
                    openIndex === index ? "rotate-180" : ""
                  } transition-transform duration-200`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`px-6 pb-4 ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
