"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Percent,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Edit2,
  Check,
} from "lucide-react";

interface PricingPlanItem {
  _id: string;
  name: string;
  code: string;
  monthlyFee: number;
  feePercent: number;
  spendThreshold?: number;
  description?: string;
  features?: string[];
  isActive: boolean;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState<number>(5);
  const [editMonthly, setEditMonthly] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing-plans", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      } else {
        showToast("Failed to fetch pricing plans", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error loading plans", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleQuickSave = async (planId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/pricing-plans", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({
          planId,
          feePercent: editFee,
          monthlyFee: editMonthly,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Plan updated successfully");
        setPlans((prev) =>
          prev.map((p) =>
            p._id === planId
              ? { ...p, feePercent: editFee, monthlyFee: editMonthly }
              : p
          )
        );
        setEditingPlanId(null);
      } else {
        const err = await res.json();
        showToast(err.error || "Update failed", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error updating plan", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (plan: PricingPlanItem) => {
    try {
      const res = await fetch("/api/admin/pricing-plans", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({
          planId: plan._id,
          isActive: !plan.isActive,
        }),
      });

      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => (p._id === plan._id ? { ...p, isActive: !p.isActive } : p))
        );
        showToast(`Plan "${plan.name}" ${!plan.isActive ? "activated" : "deactivated"}`);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to toggle plan status", "error");
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
          <p className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Monetization Engine</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Pricing & Platform Fees</h1>
        </div>

        <button
          onClick={loadPlans}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Refresh pricing model"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
        </button>
      </div>

      {/* Overview Notes */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Core Model</span>
            <Percent className="w-4 h-4 text-pink-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">Management Fee</p>
          <p className="mt-2 text-xs text-slate-300">
            Fee percentage is calculated on campaign creation and automatically applied as an internal revenue fee.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Free Access</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">Zero Friction</p>
          <p className="mt-2 text-xs text-slate-300">
            Users register and explore freely. Funds are only deducted when a campaign is approved and launched.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Tiers</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{plans.length} Configured</p>
          <p className="mt-2 text-xs text-slate-300">
            All tiers stored dynamically in MongoDB Atlas with adjustable fee margins.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Tier Configurations</h2>

        {loading && plans.length === 0 ? (
          <div className="py-12 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/70">
            <Loader2 className="w-6 h-6 animate-spin text-pink-400 mx-auto mb-2" />
            <p className="text-xs">Loading pricing configurations from Atlas...</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isEditing = editingPlanId === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`rounded-2xl border p-5 backdrop-blur-sm flex flex-col justify-between space-y-4 transition-all ${
                    plan.isActive
                      ? "border-slate-800 bg-slate-900/80 hover:border-pink-500/40"
                      : "border-slate-800/50 bg-slate-950/50 opacity-60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-white">{plan.name}</h3>
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors ${
                          plan.isActive
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {plan.isActive ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                    {/* Pricing / Fee Block */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      {isEditing ? (
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="block text-slate-400 mb-1">Fee Percentage (%)</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="30"
                              value={editFee}
                              onChange={(e) => setEditFee(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-pink-500 text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Monthly Fee ($)</label>
                            <input
                              type="number"
                              min="0"
                              value={editMonthly}
                              onChange={(e) => setEditMonthly(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold text-pink-400 font-mono">
                              {plan.feePercent}%
                            </span>
                            <span className="text-xs text-slate-400 ml-1">Platform Fee</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-white">
                              {plan.monthlyFee === 0 ? "Free" : `$${plan.monthlyFee}/mo`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleQuickSave(plan._id)}
                          className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white flex items-center gap-1"
                        >
                          {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                          <span>Save Changes</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPlanId(plan._id);
                          setEditFee(plan.feePercent);
                          setEditMonthly(plan.monthlyFee);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-pink-400" />
                        <span>Adjust Rates</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
