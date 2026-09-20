"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BriefcaseBusiness,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Loader2,
  Zap,
  Clock,
  Sliders,
} from "lucide-react";

interface AdAccountItem {
  _id: string;
  name: string;
  platform: "meta" | "tiktok" | "instagram" | "linkedin";
  accountId: string;
  status: "healthy" | "needs_attention" | "paused";
  spendCapacity: number;
  dailySpend: number;
  dailySpendLimit: number;
  healthScore: number;
  paymentMethodStatus: string;
  currency: string;
  lastSyncedAt: string;
}

export default function AdminAdAccountsPage() {
  const [accounts, setAccounts] = useState<AdAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ad-accounts", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      } else {
        showToast("Failed to load ad accounts", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error fetching accounts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleSyncAll = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/admin/ad-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ action: "sync_all" }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "All ad accounts successfully synced!");
        if (data.accounts) setAccounts(data.accounts);
      } else {
        showToast("Failed to sync ad accounts", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error during sync", "error");
    } finally {
      setSyncing(false);
    }
  };

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Infrastructure</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[11px] text-emerald-300 font-mono border border-emerald-500/20">
              Model B (Managed Reseller)
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Central Business Managers</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Platform ad accounts running all user campaigns under central payment rails
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing || loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-white" : ""}`} />
          <span>{syncing ? "Synchronizing..." : "Sync Ad Accounts"}</span>
        </button>
      </div>

      {/* Accounts Grid */}
      {loading && accounts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/70">
          <Loader2 className="w-6 h-6 animate-spin text-pink-400 mx-auto mb-2" />
          <p className="text-xs">Querying platform ad account telemetry...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accounts.map((account) => {
            const isHealthy = account.status === "healthy";
            const isAttention = account.status === "needs_attention";

            return (
              <div
                key={account.accountId}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{account.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ID: {account.accountId}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize border flex-shrink-0 ${
                      isHealthy
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : isAttention
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {account.status.replace("_", " ")}
                  </span>
                </div>

                {/* Spend capacity */}
                <div>
                  <p className="text-[11px] text-slate-400">Total Spend Capacity</p>
                  <p className="text-2xl font-bold text-white font-mono mt-0.5">
                    ${account.spendCapacity.toLocaleString()}
                  </p>
                </div>

                {/* Health Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Health Score</span>
                    <span className="font-bold text-white font-mono">{account.healthScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        account.healthScore >= 90
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : account.healthScore >= 75
                            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                            : "bg-gradient-to-r from-red-500 to-orange-400"
                      }`}
                      style={{ width: `${account.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Payment rail & sync */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CreditCard className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span className="truncate">{account.paymentMethodStatus}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>
                      Synced: {new Date(account.lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
