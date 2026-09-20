"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  pendingReviews: number;
  platformRevenue: number;
  recentTransactions: any[];
  recentCampaigns: any[];
}

export default function AdminOverviewPage() {
  // Fast hydration from client session storage to eliminate blank waiting time
  const [statsData, setStatsData] = useState<AdminStats | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("admin_stats_cache");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });

  const [loading, setLoading] = useState(!statsData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = useCallback(async (force = false) => {
    try {
      if (force) setIsRefreshing(true);
      else if (!statsData) setLoading(true);

      const url = force ? "/api/admin/stats?refresh=true" : "/api/admin/stats";
      const res = await fetch(url, {
        headers: { "x-mock-admin": "true" },
      });

      if (res.ok) {
        const data = await res.json();
        setStatsData(data);
        try {
          sessionStorage.setItem("admin_stats_cache", JSON.stringify(data));
        } catch {}
      }
    } catch (e) {
      console.error("Admin stats fetch error:", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [statsData]);

  useEffect(() => {
    loadStats(false);
  }, [loadStats]);

  const stats = useMemo(() => [
    { 
      label: "Total registered users", 
      value: statsData ? statsData.totalUsers.toLocaleString() : "...", 
      delta: "Live in Atlas", 
      tone: "emerald" 
    },
    { 
      label: "Active campaigns", 
      value: statsData ? statsData.activeCampaigns.toLocaleString() : "...", 
      delta: `${statsData?.totalCampaigns || 0} total`, 
      tone: "pink" 
    },
    { 
      label: "Platform fee revenue", 
      value: statsData ? `$${statsData.platformRevenue.toFixed(2)}` : "...", 
      delta: "5% fee model", 
      tone: "amber" 
    },
    { 
      label: "Pending reviews", 
      value: statsData ? statsData.pendingReviews.toLocaleString() : "...", 
      delta: "Requires action", 
      tone: "blue" 
    },
  ], [statsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-pink-300 font-semibold">Admin Control Center</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Platform Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          {loading && !statsData && (
            <div className="flex items-center gap-2 text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-xl">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing with Atlas...</span>
            </div>
          )}

          <button
            onClick={() => loadStats(true)}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh metrics from MongoDB Atlas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-pink-400" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400">
              <span className="truncate">{stat.label}</span>
              <span
                className={`self-start sm:self-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  stat.tone === "emerald"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : stat.tone === "pink"
                      ? "bg-pink-500/10 text-pink-300"
                      : stat.tone === "amber"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-blue-500/10 text-blue-300"
                }`}
              >
                {stat.delta}
              </span>
            </div>
            <p className="mt-3 sm:mt-5 text-xl sm:text-2xl font-bold text-white font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Operations & Campaigns Split */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Recent Ledger Operations</h2>
              <p className="text-xs text-slate-400">Live database audit trail</p>
            </div>
            <Link href="/admin/deposits" className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-0.5">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {statsData && statsData.recentTransactions && statsData.recentTransactions.length > 0 ? (
              statsData.recentTransactions.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 text-xs">
                  <div>
                    <p className="font-medium text-white capitalize">{item.type} {item.gateway ? `(${item.gateway.toUpperCase()})` : ""}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()} • {item._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${item.type === "deposit" ? "text-emerald-400" : "text-white"}`}>
                      {item.type === "deposit" ? "+" : "-"}${item.amount.toFixed(2)}
                    </p>
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 capitalize">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No recent transactions found in ledger.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Latest Campaigns</h2>
              <p className="text-xs text-slate-400">Recent campaign launches</p>
            </div>
            <Link href="/admin/campaigns" className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-0.5">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {statsData && statsData.recentCampaigns && statsData.recentCampaigns.length > 0 ? (
              statsData.recentCampaigns.map((c: any) => (
                <div key={c._id} className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 text-xs">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-medium text-white truncate">{c.name || "Untitled Campaign"}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{c.days} days • ${(c.dailyBudget || 0).toFixed(2)}/day</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      c.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : c.status === "pending" || c.status === "in_review"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-slate-800 text-slate-300"
                    }`}>
                      {c.status || "draft"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No campaigns launched yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
