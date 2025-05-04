// src/components/home/HeroSection.js
import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="tracking-tight font-extrabold text-gray-900">
                <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600 mb-2">
                  Organize Your Job Search
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl">
                  Track Your Journey to
                  <span className="block text-blue-600 xl:inline">
                    {" "}
                    Dream Career
                  </span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                PursuitPal helps you organize your job search process from start
                to finish. Track applications, manage interviews, store
                documents, and monitor your progress - all in one place.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/assets/images/dashboard.png"
          alt="Dashboard preview"
        />
      </div>
    </div>
  );
};

export default HeroSection;
