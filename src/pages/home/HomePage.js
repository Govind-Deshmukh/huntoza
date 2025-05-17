// src/pages/home/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import PricingSection from "./PricingSection";
import AnnouncementBanner from "./AnnouncementBanner";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AnnouncementBanner
        message="🎉 We're in beta! Use PursuitPal completely free with no restrictions — for a limited time."
        link="/register"
        linkText="Sign Up Now"
      />

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  src={process.env.PUBLIC_URL + "/logo512.png"}
                  alt="PursuitPal Logo"
                  className="h-12 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default HomePage;
