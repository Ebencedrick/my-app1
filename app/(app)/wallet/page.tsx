"use client";

import { useState, useEffect, useCallback } from "react";
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
  Flame,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";

interface LedgerTx {
  _id: string;
  type: "deposit" | "hold" | "settlement" | "holdRelease" | "refund";
  amount: number;
  currency: string;
  gateway?: string;
  gatewayRef?: string;
  campaignId?: string;
  status: string;
  createdAt: string;
}

interface WalletSummary {
  walletId: string;
  currency: string;
  totalBalance: number;
  availableBalance: number;
  activeHold: number;
  totalDeposited: number;
  totalSettled: number;
  totalRefunded: number;
}

export default function WalletPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"momo" | "crypto">("momo");
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [summary, setSummary] = useState<WalletSummary>({
    walletId: "",
    currency: "USD",
    totalBalance: 0,
    availableBalance: 0,
    activeHold: 0,
    totalDeposited: 0,
    totalSettled: 0,
    totalRefunded: 0,
  });

  const [transactions, setTransactions] = useState<LedgerTx[]>([]);
  const [momoAmount, setMomoAmount] = useState(100);
  const [momoPhone, setMomoPhone] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(100);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const [balRes, txRes] = await Promise.all([
        fetch("/api/wallet/balance"),
        fetch("/api/wallet/transactions?limit=50"),
      ]);

      if (balRes.ok) {
        const balData = await balRes.json();
        setSummary({
          walletId: balData.walletId || "",
          currency: balData.currency || "USD",
          totalBalance: balData.totalBalance || 0,
          availableBalance: balData.availableBalance || 0,
          activeHold: balData.activeHold || 0,
          totalDeposited: balData.totalDeposited || 0,
          totalSettled: balData.totalSettled || 0,
          totalRefunded: balData.totalRefunded || 0,
        });
        // Sync local cache for quick UI reads
        localStorage.setItem("mock_wallet_balance", String(balData.availableBalance || 0));
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load wallet data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
    // Default phone from user profile if available
    try {
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.phone) setMomoPhone(u.phone);
      }
    } catch {}
  }, [fetchWalletData]);

  const confirmMomo = async () => {
    const amount = Number(momoAmount);
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          gateway: "momo",
          phone: momoPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Deposit failed");
        return;
      }

      setShowAddFundsModal(false);
      await fetchWalletData();
    } catch (err: any) {
      setErrorMessage("Network error during deposit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmCrypto = async () => {
    const amount = Number(cryptoAmount);
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          gateway: "crypto",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Deposit failed");
        return;
      }

      setShowAddFundsModal(false);
      await fetchWalletData();
    } catch (err: any) {
      setErrorMessage("Network error during deposit");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      case "deposit": return <CreditCard className="w-4 h-4" />;
      case "hold": return <Lock className="w-4 h-4" />;
      case "settlement": return <DollarSign className="w-4 h-4" />;
      case "holdRelease": return <RefreshCw className="w-4 h-4" />;
      case "refund": return <ArrowLeftRight className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-400";
      case "pending": return "text-yellow-400";
      case "active": return "text-blue-400";
      case "failed": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit": return "text-emerald-400 bg-emerald-500/20";
      case "hold": return "text-blue-400 bg-blue-500/20";
      case "settlement": return "text-orange-400 bg-orange-500/20";
      case "holdRelease": return "text-cyan-400 bg-cyan-500/20";
      case "refund": return "text-purple-400 bg-purple-500/20";
      default: return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-base text-slate-400">Double-entry ledger balance and real-time transaction history</p>
        </div>
        <button
          onClick={fetchWalletData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-pink-400" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Main Balance & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Main Available Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl p-6 text-white shadow-2xl shadow-pink-500/25 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-pink-100 text-sm font-medium">Available Balance</p>
                  <p className="text-white/80 text-xs">{summary.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-4xl md:text-5xl font-bold">
                  {showBalance ? `$${summary.availableBalance.toFixed(2)}` : "••••••"}
                </p>
                <button
                  onClick={() => setShowBalance((s) => !s)}
                  className="text-white/80 hover:text-white rounded-md p-1.5 transition-colors"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-pink-100/80 text-xs mt-2">
                Available to spend on new campaigns or ads
              </p>
            </div>
            <button
              onClick={() => {
                setErrorMessage(null);
                setShowAddFundsModal(true);
              }}
              className="px-5 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-bold">Add Funds</span>
            </button>
          </div>
        </div>

        {/* Financial Breakdown Mini-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Locked in Active Holds</p>
              <p className="text-xl font-bold text-blue-400 mt-1">
                ${summary.activeHold.toFixed(2)}
              </p>
            </div>
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Lifetime Deposited</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                ${summary.totalDeposited.toFixed(2)}
              </p>
            </div>
            <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-slate-600 transition-all duration-500">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Ledger Transaction History</h2>
              <p className="text-xs text-slate-400 mt-0.5">Immutable audit trail of all deposits, holds, releases, and settlements</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="p-10 text-center">
              <Wallet className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 font-medium text-sm">No ledger transactions yet</p>
              <p className="text-slate-500 text-xs mt-1">Click &quot;Add Funds&quot; above to make your first deposit.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Gateway / Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2.5 ${getTypeColor(tx.type)}`}>
                          {getTypeIcon(tx.type)}
                        </div>
                        <span className="text-xs font-semibold text-white capitalize">
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="text-xs text-white capitalize font-medium">
                        {tx.gateway || (tx.type === "hold" ? "Campaign Budget Hold" : "Direct")}
                        {tx.gatewayRef && (
                          <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                            Ref: {tx.gatewayRef}
                          </span>
                        )}
                        {tx.campaignId && (
                          <span className="block text-[11px] text-pink-400 mt-0.5">
                            Campaign ID: {tx.campaignId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`text-xs font-bold ${
                        tx.type === "deposit" || tx.type === "holdRelease" || tx.type === "refund"
                          ? "text-emerald-400"
                          : "text-orange-400"
                      }`}>
                        {tx.type === "deposit" || tx.type === "holdRelease" || tx.type === "refund" ? "+" : "-"}
                        ${tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-400">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Add Funds</h2>
                <p className="text-xs text-slate-400 mt-0.5">Deposit directly into your ledger wallet</p>
              </div>
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                {errorMessage}
              </div>
            )}

            {/* Tabs */}
            <div className="flex mb-4 bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab("momo")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
                  activeTab === "momo"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile Money
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
                  activeTab === "crypto"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bitcoin className="w-3.5 h-3.5" />
                Crypto
              </button>
            </div>

            {/* Mobile Money Tab */}
            {activeTab === "momo" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number (MTN / Orange) *
                  </label>
                  <input
                    type="tel"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    value={momoAmount}
                    onChange={(e) => setMomoAmount(Number(e.target.value))}
                    placeholder="100.00"
                    min="5"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={confirmMomo}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50 text-sm"
                >
                  <Flame className="w-4 h-4" />
                  {isSubmitting ? "Processing..." : "Confirm & Deposit"}
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  Funds are instantly credited to your MongoDB ledger wallet.
                </p>
              </div>
            )}

            {/* Crypto Tab */}
            {activeTab === "crypto" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Cryptocurrency
                  </label>
                  <select className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all text-sm">
                    <option value="usdt">USDT (TRC20 / ERC20)</option>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(Number(e.target.value))}
                    placeholder="100.00"
                    min="5"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 text-pink-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Scan QR Code or copy deposit address</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    0x71C...AdsPlatformTreasuryUSD
                  </p>
                </div>
                <button
                  onClick={confirmCrypto}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50 text-sm"
                >
                  <Flame className="w-4 h-4" />
                  {isSubmitting ? "Confirming..." : "Confirm & Deposit"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
