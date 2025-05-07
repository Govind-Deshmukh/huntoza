// src/pages/legal/RefundPage.js
import React from "react";
import { Link } from "react-router-dom";
import Footer from "../home/Footer";

const RefundPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: May 7, 2025
            </p>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              This Refund Policy outlines the terms and conditions relating to
              refunds, cancellations, and billing for PursuitPal's subscription
              services. By subscribing to any of our paid plans, you acknowledge
              that you have read, understood, and agree to be bound by this
              Refund Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. No-Refund Policy
            </h2>
            <p>
              PursuitPal operates under a{" "}
              <strong>strict no-refund policy</strong>. Once payment is
              processed for any subscription plan, we do not issue refunds under
              any circumstances, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Accidental purchases</li>
              <li>Dissatisfaction with the service</li>
              <li>Underutilization of features</li>
              <li>Change of mind after purchase</li>
              <li>Finding an alternative service</li>
            </ul>
            <p>
              By completing your purchase, you acknowledge and agree that you
              are making a final, non-refundable payment.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. Technical Error Exception
            </h2>
            <p>
              In the rare case where a payment is successfully processed but
              your plan is not activated due to a verified technical error on
              our part, you may be eligible for plan activation. This exception
              is subject to the following conditions:
            </p>
            <ol className="list-decimal pl-6 mt-2 mb-4">
              <li>
                You must contact us at amoldeshmukh683@gmail.com within 48 hours
                of the payment
              </li>
              <li>
                The payment must be verifiable in our payment processor records
              </li>
              <li>
                We must be able to confirm through our system logs that the plan
                was not activated despite successful payment
              </li>
              <li>
                You must provide transaction details including payment date,
                amount, and any transaction IDs
              </li>
            </ol>
            <p>
              Please note that this exception does not entitle you to a refund
              but rather to the proper activation of the service you purchased.
              We reserve the right to determine whether a technical error has
              occurred on our side.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. Subscription Management and Cancellation
            </h2>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.1 Subscription Duration
            </h3>
            <p>When you purchase a subscription:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                Your subscription will remain active for the full period you
                have paid for
              </li>
              <li>
                You will have access to all features included in your selected
                plan for the entire paid period
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.2 Cancellation Policy
            </h3>
            <p>
              You may cancel your subscription at any time through your account
              settings. When you cancel:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                Your subscription will not automatically renew at the end of
                your current billing cycle
              </li>
              <li>
                You will continue to have access to your subscription until the
                end of your current paid period
              </li>
              <li>No partial refunds will be issued for unused time</li>
              <li>
                You will receive a confirmation email when your cancellation is
                processed
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.3 Auto-Renewal
            </h3>
            <p>
              Unless you cancel before the renewal date, your subscription will
              automatically renew for the same period and at the current rate
              for your subscription plan.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Account Deletion and Data Loss
            </h2>
            <p>If you choose to delete your account:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                All your data will be permanently removed from our systems
              </li>
              <li>You will immediately lose access to all premium features</li>
              <li>
                No refunds will be issued for any remaining subscription time
              </li>
              <li>This action cannot be reversed</li>
            </ul>
            <p>
              You acknowledge that you are solely responsible for backing up any
              important data before deleting your account, and that PursuitPal
              bears no responsibility for any data loss resulting from account
              deletion.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Changes to This Policy
            </h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Any
              changes will be posted on this page and will become effective
              immediately upon posting. Your continued use of our service after
              any changes to this policy constitutes your acceptance of the
              updated terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              7. Contact Information
            </h2>
            <p>
              If you have any questions about this Refund Policy or need to
              report a payment issue that qualifies for the technical error
              exception, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Email: amoldeshmukh683@gmail.com</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              8. Acknowledgment
            </h2>
            <p>
              By using PursuitPal's services, you acknowledge that you have
              read, understood, and agree to be bound by this Refund Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RefundPage;
