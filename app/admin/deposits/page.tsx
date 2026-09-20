"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  PlusCircle,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Smartphone,
  Coins,
  ShieldCheck,
} from "lucide-react";

interface AdminDeposit {
  _id: string;
  userId: {
    _id: string;
    email: string;
    businessName?: string;
    phone?: string;
  } | null;
  method: "momo" | "crypto";
  amount: number;
  currency: string;
  originalCurrency: string;
  originalAmount: number;
  gatewayRef?: string;
  status: "pending" | "confirmed" | "failed" | "expired";
  createdAt: string;
  confirmedAt?: string;
}

interface UserOption {
  _id: string;
  email: string;
  businessName?: string;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<AdminDeposit[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [stats, setStats] = useState({
    totalConfirmedVolume: 0,
    totalPendingVolume: 0,
    pendingCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Manual Credit Modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualUser, setManualUser] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualMethod, setManualMethod] = useState<"momo" | "crypto">("momo");
  const [manualNotes, setManualNotes] = useState("");
  const [submittingCredit, setSubmittingCredit] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadDeposits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/deposits", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits || []);
        if (data.stats) setStats(data.stats);
        if (data.users) setUsers(data.users);
      } else {
        showToast("Failed to fetch deposits ledger", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error loading deposits", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  const handleDepositAction = async (depositId: string, action: "confirm" | "reject") => {
    try {
      setActionLoadingId(depositId);
      const res = await fetch("/api/admin/deposits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ depositId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Deposit ${action}ed successfully`);
        loadDeposits();
      } else {
        const err = await res.json();
        showToast(err.error || "Action failed", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error executing action", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleManualCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUser || !manualAmount || Number(manualAmount) <= 0) {
      showToast("Please select a user and enter a valid positive amount", "error");
      return;
    }

    try {
      setSubmittingCredit(true);
      const res = await fetch("/api/admin/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({
          userId: manualUser,
          amount: Number(manualAmount),
          method: manualMethod,
          notes: manualNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Wallet credited successfully!");
        setShowManualModal(false);
        setManualAmount("");
        setManualNotes("");
        loadDeposits();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to process manual credit", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error submitting credit", "error");
    } finally {
      setSubmittingCredit(false);
    }
  };

  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      const uEmail = d.userId?.email || "";
      const uName = d.userId?.businessName || "";
      const ref = d.gatewayRef || "";
      const matchesSearch = `${uEmail} ${uName} ${ref}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      const matchesMethod = methodFilter === "all" || d.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [deposits, query, statusFilter, methodFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Financial Ledger</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Deposits & Top-Ups</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manual Credit</span>
          </button>

          <button
            onClick={loadDeposits}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Refresh deposit records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Total Confirmed Inflow</p>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-white font-mono">
            ${stats.totalConfirmedVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-400/80 mt-1">Live wallet ledger credits</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
            ${stats.totalPendingVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-amber-400/80 mt-1">{stats.pendingCount} transactions awaiting verification</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Failed / Flagged</p>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-red-300 font-mono">
            {stats.failedCount}
          </p>
          <p className="text-[11px] text-red-400/80 mt-1">Expired or rejected push transactions</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search user, email, or ref..."
              className="w-56 sm:w-64 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed / Expired</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Rails</option>
            <option value="momo">MTN / Orange MoMo</option>
            <option value="crypto">Cryptocurrency (USDT/BTC)</option>
          </select>
        </div>

        <p className="text-xs text-slate-400">
          Showing {filteredDeposits.length} of {deposits.length} transactions
        </p>
      </div>

      {/* Deposit Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Rail & Method</th>
                <th className="px-4 py-3.5">USD Amount</th>
                <th className="px-4 py-3.5">Gateway Reference</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                      <span>Loading deposit transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching deposit transactions found.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((item) => {
                  const isActing = actionLoadingId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="text-slate-200 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[160px]">
                            {item.userId?.businessName || item.userId?.email || "System/Guest"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {item.userId?.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/80 text-[11px]">
                          {item.method === "crypto" ? (
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
                          )}
                          <span className="capitalize font-medium">
                            {item.method === "momo" ? "MTN MoMo" : "Crypto"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-bold text-white font-mono text-sm">
                            ${item.amount.toFixed(2)}
                          </p>
                          {item.originalCurrency !== "USD" && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              {item.originalAmount.toLocaleString()} {item.originalCurrency}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                          {item.gatewayRef || "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                            item.status === "confirmed"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : item.status === "pending"
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/15 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {item.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === "pending" && <Clock className="w-3 h-3" />}
                          {item.status === "failed" && <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {item.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              disabled={isActing}
                              onClick={() => handleDepositAction(item._id, "confirm")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors disabled:opacity-50"
                              title="Confirm transaction & credit user wallet"
                            >
                              {isActing ? "Crediting..." : "Approve & Credit"}
                            </button>
                            <button
                              disabled={isActing}
                              onClick={() => handleDepositAction(item._id, "reject")}
                              className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-medium transition-colors disabled:opacity-50"
                              title="Reject deposit"
                            >
                              Reject
                            </button>
                          </div>
                        ) : item.status === "confirmed" ? (
                          <span className="text-[11px] text-emerald-400/70 font-medium">Credited</span>
                        ) : (
                          <span className="text-[11px] text-red-400/70 font-medium">Failed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Wallet Credit Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Manual Wallet Credit</h3>
                  <p className="text-[11px] text-slate-400">Direct ledger deposit injection</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualCreditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Select Beneficiary User</label>
                <select
                  required
                  value={manualUser}
                  onChange={(e) => setManualUser(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-pink-500 text-xs"
                >
                  <option value="">-- Choose registered account --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.businessName ? `${u.businessName} (${u.email})` : u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Credit Amount (USD $)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="e.g. 100.00"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-pink-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Funding Rail Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualMethod("momo")}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      manualMethod === "momo"
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualMethod("crypto")}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      manualMethod === "crypto"
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    Crypto / Bank
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Audit Notes (Optional)</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Offline cash transfer received, promo grant"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-pink-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCredit}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingCredit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Credit Wallet Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
