// src/components/home/CtaSection.js
import React from "react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <div className="bg-blue-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">
            Ready to take control of your job search?
          </span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-blue-100">
          Join thousands of job seekers who have streamlined their job hunt with
          PursuitPal.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
