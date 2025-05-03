import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useData } from "../../context/DataContext";

const PaymentHistoryPage = () => {
  const { getPaymentHistory, isLoading, error } = useData();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const history = await getPaymentHistory();
        setTransactions(history);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
      }
    };

    fetchPaymentHistory();
  }, [getPaymentHistory]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment History
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View your subscription payments and transaction details.
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
                    Error loading payment history
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
          ) : transactions.length === 0 ? (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No payment history
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't made any payments yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <li key={transaction._id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {transaction.plan?.name
                                ? `${
                                    transaction.plan.name
                                      .charAt(0)
                                      .toUpperCase() +
                                    transaction.plan.name.slice(1)
                                  } Plan`
                                : "Plan Subscription"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-semibold text-gray-900">
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency
                            )}
                          </span>
                          <span
                            className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              transaction.status
                            )}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Payment ID
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {transaction.paymentId || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Billing Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 capitalize">
                            {transaction.billingType}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Subscription Period
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatDate(transaction.startDate)} to{" "}
                            {formatDate(transaction.endDate)}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
