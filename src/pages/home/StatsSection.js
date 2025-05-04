// src/components/home/StatsSection.js
import React from "react";

const StatsSection = () => {
  const stats = [
    { title: "Total Users", value: "10,000+" },
    { title: "Applications Tracked", value: "250,000+" },
    { title: "Jobs Landed", value: "5,000+" },
    { title: "Success Rate", value: "85%" },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-blue-50 overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
