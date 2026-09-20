"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BellRing,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface PendingCampaign {
  _id: string;
  name: string;
  objective: string;
  platforms: string[];
  status: "pending" | "in_review";
  dailyBudget: number;
  days: number;
  totalAdSpend: number;
  totalCharge: number;
  creative?: {
    mediaUrl?: string;
    mediaType?: "image" | "video";
    copyText?: string;
    ctaType?: string;
  };
  userId?: {
    _id: string;
    email: string;
    businessName?: string;
  } | null;
  createdAt: string;
}

export default function AdminReviewQueuePage() {
  const [queue, setQueue] = useState<PendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<PendingCampaign | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/review-queue", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setQueue(data.queue || []);
      } else {
        showToast("Failed to fetch review queue", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error fetching queue", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleDecision = async (campaignId: string, decision: "approve" | "reject", reason?: string) => {
    try {
      setActionLoadingId(campaignId);
      const res = await fetch("/api/admin/review-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ campaignId, decision, reason }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Campaign ${decision}d successfully!`);
        setQueue((prev) => prev.filter((c) => c._id !== campaignId));
        setRejectingItem(null);
        setRejectionReason("");
        setCustomReason("");
      } else {
        const err = await res.json();
        showToast(err.error || "Action failed", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error executing moderation decision", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const presetReasons = [
    "Ad copy violates Meta/TikTok platform advertising policy",
    "Creative media does not meet aspect ratio or quality standards",
    "Misleading promotional claims or non-compliant landing page",
    "Restricted goods/services or unregulated financial claims",
  ];

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
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Moderation Queue</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-[11px] text-pink-300 font-mono border border-pink-500/20">
              {queue.length} pending moderation
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Ad Creative & Policy Review</h1>
        </div>

        <button
          onClick={loadQueue}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Refresh review queue"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
        </button>
      </div>

      {/* Queue Cards */}
      {loading && queue.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
            <p className="text-sm">Inspecting review queue in MongoDB...</p>
          </div>
        </div>
      ) : queue.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Review Queue is Clear</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            All submitted campaigns have been moderated and dispatched to the platform ad managers.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {queue.map((campaign) => {
            const isActing = actionLoadingId === campaign._id;

            return (
              <div
                key={campaign._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  {/* Top bar: Brand & Budget */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <p className="text-[11px] text-pink-400 font-semibold uppercase tracking-wider">
                        {campaign.objective}
                      </p>
                      <h3 className="font-bold text-base text-white mt-0.5 truncate max-w-[220px]">
                        {campaign.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {campaign.userId?.businessName || campaign.userId?.email || "Advertiser"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-white font-mono">
                        ${campaign.totalAdSpend ? campaign.totalAdSpend.toFixed(2) : (campaign.dailyBudget * campaign.days).toFixed(2)}
                      </p>
                      <span className="inline-flex rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-300 font-medium capitalize">
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  {/* Platforms & duration */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Target:</span>
                      {(campaign.platforms || []).map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-medium capitalize text-white"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">
                      {campaign.days} days • ${campaign.dailyBudget}/day
                    </span>
                  </div>

                  {/* Creative Preview */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2.5">
                    {campaign.creative?.mediaUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-48">
                        <img
                          src={campaign.creative.mediaUrl}
                          alt="Creative preview"
                          className="max-h-48 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-8 rounded-lg bg-slate-900 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                        No image uploaded
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ad Copy</p>
                      <p className="text-xs text-slate-200 mt-1 line-clamp-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {campaign.creative?.copyText || "No copy text provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-slate-400">Call To Action:</span>
                      <span className="px-2 py-0.5 rounded bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-bold">
                        {campaign.creative?.ctaType || "Learn More"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Moderation Decision Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    disabled={isActing}
                    onClick={() => {
                      setRejectingItem(campaign);
                      setRejectionReason(presetReasons[0]);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    disabled={isActing}
                    onClick={() => handleDecision(campaign._id, "approve")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isActing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Approve & Launch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Reject Campaign & Refund Hold</h3>
                  <p className="text-[11px] text-slate-400">Campaign: {rejectingItem.name}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Rejecting will mark the campaign as rejected and automatically release the budget hold of{" "}
                <strong>${rejectingItem.totalCharge?.toFixed(2) || "0.00"}</strong> back to the user&apos;s available wallet balance.
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 font-medium">Select Policy Compliance Reason:</p>
              <div className="space-y-2">
                {presetReasons.map((reason) => (
                  <label
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      rejectionReason === reason
                        ? "border-red-500/60 bg-red-500/10 text-white"
                        : "border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      checked={rejectionReason === reason}
                      onChange={() => setRejectionReason(reason)}
                      className="mt-0.5 accent-pink-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Or write custom instructions for advertiser:</label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="e.g. Please crop creative to 9:16 and remove copyright watermark."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDecision(
                    rejectingItem._id,
                    "reject",
                    customReason.trim() || rejectionReason
                  )
                }
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Confirm Rejection & Release Hold</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
