"use client";

import { useState } from "react";
import { X, Download, FileText, ChevronDown, Check } from "lucide-react";

export default function BillingPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      monthlyFee: 0,
      features: [
        "Basic analytics",
        "Up to 3 campaigns",
        "Email support",
        "Standard reporting",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth",
      monthlyFee: 29,
      features: [
        "Priority support",
        "Advanced analytics",
        "A/B testing features",
        "Custom reporting",
        "Up to 10 campaigns",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyFee: 99,
      features: [
        "24/7 dedicated support",
        "Advanced analytics + AI insights",
        "Unlimited campaigns",
        "White-label reporting",
        "API access",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

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

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const nextBillingDate = "2024-02-10";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-400";
      case "pending": return "text-yellow-400";
      case "overdue": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const downloadPDF = (invoice: any) => {
    // Generate a simple text-based invoice for download
    const invoiceContent = `
INVOICE
=======
Invoice ID: ${invoice.id}
Date: ${formatDate(invoice.date)}
Status: ${invoice.status.toUpperCase()}

Description: ${invoice.description}
Type: ${invoice.type.toUpperCase()}

ITEMS:
${invoice.items.map((item: any) => `${item.description}: $${item.amount.toFixed(2)}`).join('\n')}

TOTAL: $${invoice.amount.toFixed(2)}

Thank you for your business!
    `.trim();

    // Create a blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    setShowPlanModal(false);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Billing & Invoices</h1>
        <p className="text-base text-slate-400">View your billing history and download receipts</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl p-6 text-white mb-6 shadow-2xl shadow-pink-500/25">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 mb-2 text-sm">Current Plan</p>
            <p className="text-3xl md:text-4xl font-bold mb-1">{currentPlan.name}</p>
            <p className="text-pink-200">${currentPlan.monthlyFee.toFixed(2)}/month</p>
            <p className="text-pink-200 text-xs mt-2">Next billing: {formatDate(nextBillingDate)}</p>
          </div>
          <button 
            onClick={() => setShowPlanModal(true)}
            className="px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-colors text-sm"
          >
            Manage Plan
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl md:text-2xl font-semibold text-white">Invoice History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-medium text-white">{invoice.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <span className="text-xs text-white">{invoice.description}</span>
                      <span className="block text-xs text-slate-400 capitalize">{invoice.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-white">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewInvoiceDetails(invoice)}
                        className="text-pink-400 hover:text-pink-300"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => downloadPDF(invoice)}
                        className="text-pink-400 hover:text-pink-300"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Invoice Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Invoice ID</span>
                <span className="text-white font-medium text-sm">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Date</span>
                <span className="text-white font-medium text-sm">{formatDate(selectedInvoice.date)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`text-white font-medium text-sm capitalize ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm block mb-2">Items</span>
                <div className="space-y-2">
                  {selectedInvoice.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.description}</span>
                      <span className="text-white">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-lg px-4">
                <span className="text-white font-semibold text-sm">Total</span>
                <span className="text-pink-400 font-bold text-lg">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => downloadPDF(selectedInvoice)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedPlan === plan.id
                      ? "border-pink-500 bg-gradient-to-br from-pink-500/10 to-orange-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  } ${plan.popular ? "ring-2 ring-pink-500/50" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-white">${plan.monthlyFee}</span>
                      <span className="text-slate-400 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanChange(plan.id);
                    }}
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                    }`}
                  >
                    {selectedPlan === plan.id ? "Current Plan" : "Select Plan"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
