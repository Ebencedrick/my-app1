"use client";

import { useState } from "react";
import { 
  Wallet, 
  Plus, 
  Download, 
  CreditCard, 
  Lock, 
  DollarSign, 
  ArrowLeftRight, 
  X, 
  Smartphone, 
  Bitcoin, 
  QrCode,
  Flame
} from "lucide-react";

export default function WalletPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"momo" | "crypto">("momo");

  // Mock data - replace with actual API calls
  const balance = 1250.00;
  const transactions = [
    { id: 1, type: "deposit", method: "MTN Mobile Money", amount: 500.00, status: "completed", date: "2024-01-15T10:30:00Z" },
    { id: 2, type: "hold", method: "Campaign Hold", amount: -200.00, status: "active", date: "2024-01-15T09:00:00Z", campaignId: "cmp_123" },
    { id: 3, type: "settlement", method: "Ad Spend", amount: -45.50, status: "completed", date: "2024-01-14T18:00:00Z", campaignId: "cmp_122" },
    { id: 4, type: "deposit", method: "Bitcoin", amount: 750.00, status: "completed", date: "2024-01-10T14:20:00Z" },
    { id: 5, type: "refund", method: "Campaign Refund", amount: 50.00, status: "completed", date: "2024-01-08T11:00:00Z", campaignId: "cmp_121" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return <CreditCard className="w-5 h-5" />;
      case "hold": return <Lock className="w-5 h-5" />;
      case "settlement": return <DollarSign className="w-5 h-5" />;
      case "refund": return <ArrowLeftRight className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "pending": return "text-yellow-400";
      case "active": return "text-blue-400";
      case "failed": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit": return "text-green-400 bg-green-500/20";
      case "hold": return "text-blue-400 bg-blue-500/20";
      case "settlement": return "text-orange-400 bg-orange-500/20";
      case "refund": return "text-purple-400 bg-purple-500/20";
      default: return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-slate-400">Manage your funds and view transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-2xl shadow-pink-500/25 group hover:shadow-pink-500/40 transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <p className="text-pink-100">Available Balance</p>
            </div>
            <p className="text-5xl font-bold group-hover:scale-105 transition-transform duration-300">${balance.toFixed(2)}</p>
            <p className="text-pink-200 mt-2 text-sm">USD</p>
          </div>
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="px-8 py-4 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-300 text-lg flex items-center gap-2 group-hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-slate-600 transition-all duration-500">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Transaction History</h2>
            <button className="px-4 py-2 text-sm text-pink-400 hover:text-pink-300 flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Download Statement
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getTypeColor(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                      </div>
                      <span className="text-sm font-medium text-white capitalize">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {transaction.method}
                      {transaction.campaignId && (
                        <span className="block text-xs text-slate-400">
                          Campaign: {transaction.campaignId}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                      {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {formatDate(transaction.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add Funds</h2>
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 bg-slate-900 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("momo")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "momo"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile Money
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "crypto"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bitcoin className="w-4 h-4" />
                Crypto
              </button>
            </div>

            {/* Mobile Money Tab */}
            {activeTab === "momo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="100.00"
                    min="10"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300"
                  />
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:scale-105">
                  <Flame className="w-4 h-4" />
                  Request to Pay
                </button>
                <p className="text-xs text-slate-400 text-center">
                  You'll receive a USSD prompt on your phone to confirm the payment
                </p>
              </div>
            )}

            {/* Crypto Tab */}
            {activeTab === "crypto" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Cryptocurrency
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300">
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="usdt">Tether (USDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="100.00"
                    min="10"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300"
                  />
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <QrCode className="w-6 h-6 text-pink-400" />
                  </div>
                  <p className="text-sm text-slate-400 mb-2">Scan QR code to pay</p>
                  <div className="w-32 h-32 bg-slate-800 mx-auto rounded-lg flex items-center justify-center border border-slate-600">
                    <span className="text-slate-500 text-xs">QR Code</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:scale-105">
                  <Flame className="w-4 h-4" />
                  I've Sent the Payment
                </button>
                <p className="text-xs text-slate-400 text-center">
                  Payment will be confirmed after network confirmation
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
