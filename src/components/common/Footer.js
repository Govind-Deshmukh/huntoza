import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Job Hunt Tracker. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy
            </Link>
            <Link
              to="/help"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
