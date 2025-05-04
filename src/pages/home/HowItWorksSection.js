// src/components/home/HowItWorksSection.js
import React from "react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Track Applications",
      description:
        "Add job applications and keep track of their status as you progress through the hiring process.",
    },
    {
      number: 2,
      title: "Manage Interviews",
      description:
        "Schedule interviews, set reminders, and prepare with notes and resources all in one place.",
    },
    {
      number: 3,
      title: "Track Progress",
      description:
        "Monitor your job search metrics and gain insights to improve your strategy and land your dream job.",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple steps to organize your job search
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            PursuitPal makes it easy to stay on top of your job hunt.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center px-4 mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-lg font-bold">{step.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
