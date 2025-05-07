import React from "react";
import { Link } from "react-router-dom";
import Footer from "../home/Footer";

const PrivacyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: May 7, 2025
            </p>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              At PursuitPal, we respect your privacy and are committed to
              protecting the personal information that you share with us. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our job hunt tracking and
              organization application.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using
              PursuitPal, you acknowledge that you have read, understood, and
              agree to be bound by the terms of this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              2.1 Personal Information You Provide
            </h3>
            <p>
              When you create an account and use our service, we may collect the
              following types of information:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Account Information</strong>: Name, email address,
                password, and other information you provide during registration
              </li>
              <li>
                <strong>Profile Information</strong>: Job title, industry,
                skills, and other professional details
              </li>
              <li>
                <strong>Job Application Data</strong>: Information about job
                applications, including company names, positions, application
                status, and notes
              </li>
              <li>
                <strong>Contact Information</strong>: Details about professional
                contacts in your network
              </li>
              <li>
                <strong>Documents</strong>: Resumes, cover letters, and other
                job search-related documents you choose to store
              </li>
              <li>
                <strong>Communication Preferences</strong>: Your preferences for
                receiving notifications and updates
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              2.2 Usage Information
            </h3>
            <p>We also collect information about how you use our service:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Log Data</strong>: Information that your browser
                automatically sends whenever you visit our application,
                including your IP address, browser type, and access times
              </li>
              <li>
                <strong>Device Information</strong>: Information about the
                device you use to access our service
              </li>
              <li>
                <strong>Interaction Data</strong>: How you interact with our
                application, including features used and time spent
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Provide and Improve Our Service</strong>: To operate,
                maintain, and enhance the functionality of PursuitPal
              </li>
              <li>
                <strong>Personalize Your Experience</strong>: To understand your
                preferences and tailor our service to your needs
              </li>
              <li>
                <strong>Communication</strong>: To respond to your inquiries,
                send service-related announcements, and provide customer support
              </li>
              <li>
                <strong>Security</strong>: To protect our service and users from
                fraud, abuse, and unauthorized access
              </li>
              <li>
                <strong>Analytics</strong>: To analyze usage patterns and trends
                to improve our service
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. Data Security and Storage
            </h2>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.1 Security Measures
            </h3>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              loss, or alteration. However, no method of transmission over the
              Internet or electronic storage is 100% secure.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.2 Data Access and Storage
            </h3>
            <p>
              Your data is securely stored in our database. We do not access
              your personal data except in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>When necessary for database maintenance or migration</li>
              <li>To investigate or resolve technical issues</li>
              <li>To respond to customer support requests</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              4.3 Data Retention
            </h3>
            <p>
              We retain your personal information for as long as your account is
              active or as needed to provide you with our services. If you close
              your account, we will delete or anonymize your personal
              information unless we need to retain it for legal compliance.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Information Sharing and Disclosure
            </h2>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              5.1 No Sale of Personal Information
            </h3>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. Your job search data and personal information are
              strictly used to provide and improve our service to you.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              5.2 Limited Disclosure
            </h3>
            <p>
              We may disclose your information in the following limited
              circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Service Providers</strong>: We may share information
                with trusted third-party service providers who help us operate
                our business, such as cloud storage providers or payment
                processors. These providers are bound by confidentiality
                obligations and are only authorized to use your information as
                necessary to provide services to us.
              </li>
              <li>
                <strong>Legal Requirements</strong>: We may disclose your
                information if required to do so by law or in response to valid
                requests by public authorities.
              </li>
              <li>
                <strong>Business Transfers</strong>: If we are involved in a
                merger, acquisition, or sale of all or a portion of our assets,
                your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>With Your Consent</strong>: We may share your
                information with third parties when we have your explicit
                consent to do so.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Access</strong>: The right to access the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction</strong>: The right to correct inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion</strong>: The right to request deletion of your
                personal information
              </li>
              <li>
                <strong>Export</strong>: The right to export your data in a
                structured, commonly used format
              </li>
              <li>
                <strong>Objection</strong>: The right to object to certain
                processing activities
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              7. Children's Privacy
            </h2>
            <p>
              Our service is not directed to individuals under the age of 16,
              and we do not knowingly collect personal information from
              children. If you believe we have inadvertently collected
              information from a child, please contact us to have it removed.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by posting the updated Privacy Policy on
              our website or through the application, and we may also notify you
              by email.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              9. Third-Party Links and Services
            </h2>
            <p>
              Our application may contain links to third-party websites or
              services. This Privacy Policy does not apply to those third-party
              websites or services, and we are not responsible for their privacy
              practices. We encourage you to review the privacy policies of any
              third-party websites or services you visit.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Email: amoldeshmukh683@gmail.com</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              11. Acceptance of This Policy
            </h2>
            <p>
              By using PursuitPal, you signify your acceptance of this Privacy
              Policy. If you do not agree to this policy, please do not use our
              service.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
