// src/components/auth/AuthNavbar.js
import React from "react";
import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo512.png"}
                alt="PursuitPal Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
