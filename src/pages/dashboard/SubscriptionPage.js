import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const SubscriptionPage = () => {
  const {
    currentPlan,
    loadCurrentPlan,
    getPaymentHistory,
    cancelSubscription,
    isLoading,
    error,
  } = useData();

  const [transactions, setTransactions] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationError, setCancellationError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadCurrentPlan();
        const history = await getPaymentHistory();
        setTransactions(history);
      } catch (err) {
        console.error("Failed to load subscription data:", err);
      }
    };

    loadData();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      setCancellationLoading(true);
      setCancellationError(null);

      await cancelSubscription();

      // Close modal
      setShowCancelModal(false);

      // Refresh current plan data
      await loadCurrentPlan();

      // Reload transactions
      const history = await getPaymentHistory();
      setTransactions(history);
    } catch (err) {
      setCancellationError(err.message || "Failed to cancel subscription");
    } finally {
      setCancellationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPlanActive = () => {
    if (!currentPlan || !currentPlan.subscription) return false;
    return currentPlan.subscription.status === "active";
  };

  // Check if the current plan is a paid plan (not free)
  const isPaidPlan = () => {
    if (!currentPlan || !currentPlan.plan) return false;
    return currentPlan.plan.name !== "free";
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Subscription Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your current subscription plan.
          </p>

          {error && (
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading subscription data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Current Plan Card */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Current Plan
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Details about your subscription.
                    </p>
                  </div>
                  <Link
                    to="/plans"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Plans
                  </Link>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Plan Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {currentPlan?.plan ? (
                          <span className="inline-flex items-center">
                            {currentPlan.plan.name.charAt(0).toUpperCase() +
                              currentPlan.plan.name.slice(1)}{" "}
                            Plan
                            {isPlanActive() && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </span>
                        ) : (
                          "Loading..."
                        )}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {currentPlan?.plan?.description || "N/A"}
                      </dd>
                    </div>
                    {isPaidPlan() && (
                      <>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Billing Period
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                            {currentPlan?.subscription?.billingType || "N/A"}
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Current Period
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {formatDate(currentPlan?.subscription?.startDate)}{" "}
                            to {formatDate(currentPlan?.subscription?.endDate)}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subscription Limits
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <span className="ml-2 flex-1 w-0 truncate">
                                Job Applications
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="font-medium">
                                {currentPlan?.plan?.limits?.jobApplications ===
                                -1
                                  ? "Unlimited"
                                  : currentPlan?.plan?.limits
                                      ?.jobApplications || "N/A"}
                              </span>
                            </div>
                          </li>
                          <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <span className="ml-2 flex-1 w-0 truncate">
                                Contacts
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="font-medium">
                                {currentPlan?.plan?.limits?.contacts === -1
                                  ? "Unlimited"
                                  : currentPlan?.plan?.limits?.contacts ||
                                    "N/A"}
                              </span>
                            </div>
                          </li>
                          <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <span className="ml-2 flex-1 w-0 truncate">
                                Document Storage
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="font-medium">
                                {currentPlan?.plan?.limits?.documentStorage ===
                                -1
                                  ? "Unlimited"
                                  : `${currentPlan?.plan?.limits?.documentStorage} MB` ||
                                    "N/A"}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
                {isPaidPlan() && isPlanActive() && (
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Transactions
                </h2>
                {transactions.length === 0 ? (
                  <div className="mt-4 bg-white shadow sm:rounded-lg p-6 text-center">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                ) : (
                  <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {transactions.slice(0, 3).map((transaction) => (
                        <li key={transaction._id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {transaction.plan?.name
                                  ? `${
                                      transaction.plan.name
                                        .charAt(0)
                                        .toUpperCase() +
                                      transaction.plan.name.slice(1)
                                    } Plan (${transaction.billingType})`
                                  : "Plan Subscription"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: transaction.currency || "INR",
                                }).format(transaction.amount)}
                              </p>
                              <p
                                className={`text-xs ${
                                  transaction.status === "completed"
                                    ? "text-green-600"
                                    : transaction.status === "failed"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {transactions.length > 3 && (
                      <div className="px-6 py-4 border-t border-gray-200">
                        <Link
                          to="/payment-history"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View all transactions
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowCancelModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Cancel Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your subscription? Your
                        account will be downgraded to the Free plan immediately.
                        You'll lose access to premium features but your data
                        will be preserved.
                      </p>

                      {cancellationError && (
                        <p className="mt-2 text-sm text-red-600">
                          {cancellationError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={cancellationLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-300"
                  onClick={handleCancelSubscription}
                >
                  {cancellationLoading
                    ? "Processing..."
                    : "Cancel Subscription"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubscriptionPage;
