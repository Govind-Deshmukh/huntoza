// src/components/home/TestimonialsSection.js
import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah L.",
      role: "Software Engineer",
      initial: "S",
      text: "PursuitPal was a game-changer during my job search. I was able to organize all my applications, interviews, and follow-ups in one place. Landed my dream job in 8 weeks!",
    },
    {
      name: "Michael R.",
      role: "Product Manager",
      initial: "M",
      text: "The analytics dashboard helped me identify which job boards were yielding the best results. I adjusted my strategy and received 3 offers within a month!",
    },
    {
      name: "Priya K.",
      role: "Marketing Specialist",
      initial: "P",
      text: "As someone who applied to over 50 jobs, keeping track was a nightmare until I found PursuitPal. The interface is intuitive and the reminders saved me from missing follow-ups!",
    },
  ];

  return (
    <div className="bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Hear from our satisfied users
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {testimonial.initial}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
