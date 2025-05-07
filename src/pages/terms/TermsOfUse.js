// src/pages/legal/TermsPage.js
import React from "react";
import { Link } from "react-router-dom";
import Footer from "../home/Footer";

const TermsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zM12 11h4v2h-4v-2z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  PursuitPal
                </span>
              </Link>
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

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: May 7, 2025
            </p>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              Welcome to PursuitPal ("we," "our," or "us"). By accessing or
              using our job hunt tracking and organization application, you
              agree to be bound by these Terms of Service ("Terms"). Please read
              these Terms carefully before using our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. Description of Service
            </h2>
            <p>
              PursuitPal is a personal job hunt tracking and organization tool
              designed to help job seekers organize their job search process.
              Our application allows users to:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Track job applications submitted to different companies</li>
              <li>Organize job search activities and to-do tasks</li>
              <li>Keep track of interview schedules and follow-ups</li>
              <li>Store and manage resumes and cover letters</li>
              <li>Monitor application progress with statistics and metrics</li>
              <li>Maintain a database of professional contacts</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. User Accounts
            </h2>
            <p>
              To use our services, you may need to create an account. You are
              responsible for maintaining the confidentiality of your account
              information and for all activities that occur under your account.
              You agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                Provide accurate and complete information when creating your
                account
              </li>
              <li>Update your information to keep it accurate and current</li>
              <li>
                Protect your account credentials and not share them with others
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. User Responsibilities
            </h2>
            <p>When using our services, you agree to:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Comply with all applicable laws and regulations</li>
              <li>Use the service for personal job search purposes only</li>
              <li>Not upload content that infringes on the rights of others</li>
              <li>
                Not use the service to engage in any illegal or unauthorized
                activity
              </li>
              <li>Not attempt to interfere with or disrupt the service</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Disclaimer of Guarantees
            </h2>
            <p>
              PursuitPal is designed to help organize your job search process,
              but we do not guarantee any specific outcomes. We specifically
              disclaim any guarantees that:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Using our service will result in employment</li>
              <li>
                Companies will respond to applications tracked through our
                service
              </li>
              <li>
                The information you enter will lead to job interviews or offers
              </li>
            </ul>
            <p>
              Our application is a tool to assist in your job search, but your
              success ultimately depends on your qualifications, skills, and the
              job market conditions. Our service does not replace the need for
              your own efforts in the job search process.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Intellectual Property
            </h2>
            <p>
              The PursuitPal application, including all content, features, and
              functionality, is owned by us and is protected by copyright,
              trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                Copy, modify, or create derivative works based on our service
              </li>
              <li>
                Reverse engineer or attempt to extract the source code of our
                software
              </li>
              <li>
                Remove any copyright, trademark, or other proprietary notices
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              7. Data Storage and Privacy
            </h2>
            <p>
              We value your privacy and are committed to protecting your
              personal information. Please review our{" "}
              <Link
                to="/privacy-policy"
                className="text-blue-600 hover:text-blue-800"
              >
                Privacy Policy
              </Link>{" "}
              for information on how we collect, use, and disclose information.
              By using our service, you consent to the data practices described
              in our Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              8. Subscription and Payments
            </h2>
            <p>If you choose a paid subscription:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                Payment will be charged to your selected payment method at
                confirmation of purchase
              </li>
              <li>
                Subscriptions automatically renew unless canceled at least 24
                hours before the end of the current period
              </li>
              <li>
                You can manage and cancel your subscription through your account
                settings
              </li>
              <li>
                No refunds will be provided for partial subscription periods
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              9. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to our
              service:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>If you violate these Terms</li>
              <li>
                If you engage in any conduct that could harm our service or
                other users
              </li>
              <li>If you fail to pay any fees due</li>
              <li>For any other reason we deem appropriate</li>
            </ul>
            <p>
              You may terminate your account at any time by contacting us or
              through your account settings.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              10. Changes to Terms
            </h2>
            <p>
              We may modify these Terms at any time. If we make changes, we will
              provide notice by posting the updated Terms on our website or
              within the application. Your continued use of our service after
              any changes constitutes your acceptance of the modified Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to, loss of profits, data, or
              use, resulting from your use of our service or any content
              provided therein.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which we operate, without regard
              to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              13. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Email: amoldeshmukh683@gmail.com</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              14. Acceptance of Terms
            </h2>
            <p>
              By using PursuitPal, you acknowledge that you have read,
              understood, and agree to be bound by these Terms.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsPage;
