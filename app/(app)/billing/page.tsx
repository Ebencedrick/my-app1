"use client";

export default function BillingPage() {
  // Mock data - replace with actual API calls
  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      type: "campaign",
      description: "Summer Sale 2024 Campaign",
      amount: 374.33,
      status: "paid",
      items: [
        { description: "Ad Spend (7 days × $50/day)", amount: 350.00 },
        { description: "Management Fee (15%)", amount: 52.50 },
        { description: "Refund (unused budget)", amount: -28.17 },
      ],
    },
    {
      id: "INV-2024-002",
      date: "2024-01-10",
      type: "subscription",
      description: "Growth Plan - Monthly Subscription",
      amount: 29.00,
      status: "paid",
      items: [
        { description: "Monthly subscription fee", amount: 29.00 },
      ],
    },
    {
      id: "INV-2024-003",
      date: "2024-01-05",
      type: "campaign",
      description: "New Product Launch Campaign",
      amount: 345.00,
      status: "paid",
      items: [
        { description: "Ad Spend (10 days × $30/day)", amount: 300.00 },
        { description: "Management Fee (15%)", amount: 45.00 },
      ],
    },
    {
      id: "INV-2024-004",
      date: "2023-12-20",
      type: "campaign",
      description: "Flash Sale Campaign",
      amount: 230.00,
      status: "paid",
      items: [
        { description: "Ad Spend (5 days × $40/day)", amount: 200.00 },
        { description: "Management Fee (15%)", amount: 30.00 },
      ],
    },
  ];

  const currentPlan = {
    name: "Growth",
    monthlyFee: 29.00,
    nextBillingDate: "2024-02-10",
    features: [
      "Priority support",
      "Advanced analytics",
      "A/B testing features",
      "Custom reporting",
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 dark:text-green-400";
      case "pending": return "text-yellow-600 dark:text-yellow-400";
      case "overdue": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing & Invoices</h1>
        <p className="text-gray-600 dark:text-gray-400">View your billing history and download receipts</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-2">Current Plan</p>
            <p className="text-3xl font-bold mb-1">{currentPlan.name}</p>
            <p className="text-indigo-200">${currentPlan.monthlyFee.toFixed(2)}/month</p>
            <p className="text-indigo-200 text-sm mt-2">Next billing: {formatDate(currentPlan.nextBillingDate)}</p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Manage Plan
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900 dark:text-white">{invoice.description}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">{invoice.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        View Details
                      </button>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Campaign Spend</span>
              <span className="text-gray-900 dark:text-white">$374.33</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subscription</span>
              <span className="text-gray-900 dark:text-white">$29.00</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">$403.33</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Year to Date</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Campaign Spend</span>
              <span className="text-gray-900 dark:text-white">$949.33</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Subscriptions</span>
              <span className="text-gray-900 dark:text-white">$87.00</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">$1,036.33</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">MTN Mobile Money</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Primary</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">₿</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bitcoin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Secondary</p>
              </div>
            </div>
            <button className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
