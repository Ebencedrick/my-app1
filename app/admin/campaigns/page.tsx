"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Search,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  Eye,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Target,
  Sparkles,
} from "lucide-react";

interface AdminCampaignItem {
  _id: string;
  name: string;
  objective: string;
  platforms: string[];
  status: "draft" | "pending" | "in_review" | "active" | "paused" | "completed" | "rejected";
  dailyBudget: number;
  days: number;
  totalAdSpend: number;
  managementFee: number;
  totalCharge: number;
  startDate?: string;
  endDate?: string;
  creative?: {
    mediaUrl?: string;
    mediaType?: "image" | "video";
    copyText?: string;
    ctaType?: string;
  };
  adSets?: any[];
  userId?: {
    _id: string;
    email: string;
    businessName?: string;
  } | null;
  createdAt: string;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<AdminCampaignItem | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/campaigns", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } else {
        showToast("Failed to fetch campaigns", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error fetching campaigns", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      setActionLoadingId(campaignId);
      const res = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ campaignId, status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Campaign updated successfully");
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaignId ? { ...c, status: newStatus as any } : c))
        );
        if (selectedCampaign && selectedCampaign._id === campaignId) {
          setSelectedCampaign((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        const err = await res.json();
        showToast(err.error || "Status update failed", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error changing status", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const brand = c.userId?.businessName || c.userId?.email || "";
      const matchesSearch = `${c.name} ${brand} ${c.objective}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesPlatform = platformFilter === "all" || (c.platforms || []).includes(platformFilter);
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [campaigns, query, statusFilter, platformFilter]);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Operations</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
              {campaigns.length} total campaigns
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">All Platform Campaigns</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaign, brand, or objective..."
              className="w-56 sm:w-64 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active / Running</option>
            <option value="paused">Paused</option>
            <option value="in_review">In Review</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Networks</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>

          <button
            onClick={loadCampaigns}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Refresh campaigns"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5">Campaign Name</th>
                <th className="px-4 py-3.5">Advertiser / Brand</th>
                <th className="px-4 py-3.5">Platforms</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Ad Budget</th>
                <th className="px-4 py-3.5">5% Fee Earned</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                      <span>Loading campaigns from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => {
                  const isActing = actionLoadingId === c._id;

                  return (
                    <tr
                      key={c._id}
                      className="text-slate-200 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Objective */}
                      <td className="px-4 py-3.5">
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[180px]">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-pink-400 capitalize">
                            {c.objective || "Traffic"}
                          </p>
                        </div>
                      </td>

                      {/* Brand / User */}
                      <td className="px-4 py-3.5">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-200 truncate max-w-[140px]">
                            {c.userId?.businessName || "Unnamed Business"}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {c.userId?.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* Platforms */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(c.platforms || []).map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-medium capitalize text-slate-300"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                            c.status === "active"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : c.status === "paused"
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : c.status === "in_review" || c.status === "pending"
                                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                                  : c.status === "completed"
                                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                                    : "bg-red-500/15 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3.5 font-mono text-white font-medium">
                        ${c.totalAdSpend ? c.totalAdSpend.toFixed(2) : (c.dailyBudget * c.days).toFixed(2)}
                      </td>

                      {/* Management Fee */}
                      <td className="px-4 py-3.5 font-mono text-pink-300 font-semibold">
                        ${(c.managementFee || Math.round((c.totalAdSpend || c.dailyBudget * c.days) * 0.05)).toFixed(2)}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        {c.days} days (${c.dailyBudget}/day)
                      </td>

                      {/* Admin Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Preview Details */}
                          <button
                            onClick={() => setSelectedCampaign(c)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect campaign & creative details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Pause button */}
                          {c.status === "active" && (
                            <button
                              disabled={isActing}
                              onClick={() => handleStatusChange(c._id, "paused")}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Pause live delivery"
                            >
                              <Pause className="w-3 h-3" />
                              <span>Pause</span>
                            </button>
                          )}

                          {/* Resume button */}
                          {c.status === "paused" && (
                            <button
                              disabled={isActing}
                              onClick={() => handleStatusChange(c._id, "active")}
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Resume campaign"
                            >
                              <Play className="w-3 h-3" />
                              <span>Resume</span>
                            </button>
                          )}

                          {/* Mark Completed (Releases hold) */}
                          {(c.status === "active" || c.status === "paused") && (
                            <button
                              disabled={isActing}
                              onClick={() => handleStatusChange(c._id, "completed")}
                              className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-colors disabled:opacity-50"
                              title="Mark finished and release unused budget holds"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-pink-400 font-semibold">
                  {selectedCampaign.objective} Campaign
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">{selectedCampaign.name}</h3>
                <p className="text-xs text-slate-400">
                  By {selectedCampaign.userId?.businessName || selectedCampaign.userId?.email || "Advertiser"}
                </p>
              </div>

              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Daily Budget</p>
                <p className="text-sm font-bold text-white mt-1">${selectedCampaign.dailyBudget}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Duration</p>
                <p className="text-sm font-bold text-white mt-1">{selectedCampaign.days} Days</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Ad Spend</p>
                <p className="text-sm font-bold text-emerald-400 mt-1">${selectedCampaign.totalAdSpend}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">5% Platform Fee</p>
                <p className="text-sm font-bold text-pink-400 mt-1">${selectedCampaign.managementFee}</p>
              </div>
            </div>

            {/* Creative Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Ad Creative & Copy Preview</span>
              </h4>

              {selectedCampaign.creative?.mediaUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-56 bg-black flex items-center justify-center">
                  <img
                    src={selectedCampaign.creative.mediaUrl}
                    alt="Ad Creative"
                    className="max-h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-slate-900 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No visual media attached
                </div>
              )}

              <div>
                <p className="text-[11px] text-slate-400 font-medium">Primary Ad Copy:</p>
                <p className="text-xs text-slate-200 mt-1 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  {selectedCampaign.creative?.copyText || "No ad copy provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Call to Action:</span>
                <span className="px-2.5 py-1 rounded-md bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30">
                  {selectedCampaign.creative?.ctaType || "Learn More"}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Current Status:</span>
                <span className="text-xs font-semibold capitalize text-white">{selectedCampaign.status}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedCampaign.status !== "active" && (
                  <button
                    onClick={() => handleStatusChange(selectedCampaign._id, "active")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Activate Campaign
                  </button>
                )}
                {selectedCampaign.status === "active" && (
                  <button
                    onClick={() => handleStatusChange(selectedCampaign._id, "paused")}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                  >
                    Pause Campaign
                  </button>
                )}
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
