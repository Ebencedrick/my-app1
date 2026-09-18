"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Plus, 
  Eye, 
  Pause, 
  Play, 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  X, 
  Loader2, 
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";

interface CampaignItem {
  id: string;
  name: string;
  platforms: string[];
  status: string;
  budget: number;
  spend: number;
  daysRemaining: number;
  startDate: string;
  reach: number;
}

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/campaigns");
      if (!res.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      const data = await res.json();
      if (data.campaigns) {
        const formatted: CampaignItem[] = data.campaigns.map((c: any) => {
          const budget = c.totalCharge || c.totalAdSpend || 0;
          const isCompleted = c.status === "completed";
          const isLive = c.status === "active";
          const spend = isCompleted ? budget : isLive ? Number((budget * 0.35).toFixed(2)) : 0;
          const daysRemaining = c.endDate
            ? Math.max(0, Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : (c.days || 0);
          const reach = c.totalAdSpend ? Math.round(c.totalAdSpend * 125) : 0;

          return {
            id: c._id,
            name: c.name || "Untitled Campaign",
            platforms: Array.isArray(c.platforms) && c.platforms.length ? c.platforms : ["facebook"],
            status: c.status || "pending",
            budget,
            spend,
            daysRemaining,
            startDate: c.startDate ? new Date(c.startDate).toISOString().split("T")[0] : new Date(c.createdAt).toISOString().split("T")[0],
            reach,
          };
        });
        setCampaigns(formatted);
      }
    } catch (err: any) {
      console.error("Fetch campaigns error:", err);
      setError(err.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active": 
        return { label: "Running", className: "bg-green-500/20 text-green-400 border border-green-500/30" };
      case "paused": 
        return { label: "Paused", className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" };
      case "completed": 
        return { label: "Completed", className: "bg-blue-500/20 text-blue-400 border border-blue-500/30" };
      case "pending": 
      case "in_review":
        return { label: "In Review", className: "bg-amber-500/20 text-amber-400 border border-amber-500/30" };
      case "draft": 
        return { label: "Draft", className: "bg-slate-500/20 text-slate-400 border border-slate-500/30" };
      case "rejected": 
        return { label: "Rejected", className: "bg-red-500/20 text-red-400 border border-red-500/30" };
      default: 
        return { label: status, className: "bg-slate-500/20 text-slate-400 border border-slate-500/30" };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return <Facebook className="w-4 h-4 text-blue-400" />;
      case "instagram": return <Instagram className="w-4 h-4 text-pink-400" />;
      case "tiktok": return <TikTokIcon />;
      default: return null;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (statusFilter !== "all" && campaign.status !== statusFilter) return false;
    if (platformFilter !== "all" && !campaign.platforms.map(p => p.toLowerCase()).includes(platformFilter)) return false;
    return true;
  });

  const calculateProgress = (spend: number, budget: number) => {
    return budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setCampaigns(prev =>
          prev.map(c => (c.id === campaignId ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      console.error("Toggle campaign status error:", err);
    }
  };

  const toggleMenu = (campaignId: string) => {
    setActiveMenu(activeMenu === campaignId ? null : campaignId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const duplicateCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${campaign.name} (Copy)`,
          objective: "traffic_engagement",
          platforms: campaign.platforms,
          dailyBudget: Math.max(10, Math.round(campaign.budget / (campaign.daysRemaining || 7))),
          days: campaign.daysRemaining || 7,
        }),
      });
      if (res.ok) {
        fetchCampaigns();
      } else {
        const d = await res.json();
        alert(d.error || "Could not duplicate campaign");
      }
    } catch (err) {
      console.error("Duplicate campaign error:", err);
    }
    closeMenu();
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign? Any remaining budget hold will be released back to your wallet balance.")) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete campaign");
      }
    } catch (err) {
      console.error("Delete campaign error:", err);
    }
    closeMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as HTMLElement).closest('.campaign-menu')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-sm sm:text-base text-slate-400">Manage and monitor your live social ad campaigns</p>
        </div>
        <Link
          href="/campaigns/new"
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 hover:scale-105 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status
            </label>
            <button
              onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setPlatformDropdownOpen(false); }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300 text-sm flex items-center justify-between"
            >
              <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter === "pending" ? "In Review" : statusFilter}</span>
              <X className="w-4 h-4 text-slate-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {["all", "active", "paused", "pending", "completed", "draft"].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setStatusDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      statusFilter === status
                        ? "bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-400"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {status === "all" ? "All Status" : status === "pending" ? "In Review" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Platform
            </label>
            <button
              onClick={() => { setPlatformDropdownOpen(!platformDropdownOpen); setStatusDropdownOpen(false); }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300 text-sm flex items-center justify-between"
            >
              <span className="capitalize">{platformFilter === "all" ? "All Platforms" : platformFilter}</span>
              <X className="w-4 h-4 text-slate-400" />
            </button>
            {platformDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {["all", "facebook", "instagram", "tiktok"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => { setPlatformFilter(platform); setPlatformDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                      platformFilter === platform
                        ? "bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-400"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {platform === "facebook" && <Facebook className="w-4 h-4" />}
                    {platform === "instagram" && <Instagram className="w-4 h-4" />}
                    {platform === "tiktok" && <TikTokIcon />}
                    {platform === "all" && "All Platforms"}
                    {platform !== "all" && platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-16 flex flex-col items-center justify-center bg-slate-800/30 border border-slate-700/50 rounded-2xl">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
          <p className="text-slate-400 text-sm font-medium">Loading your campaigns...</p>
        </div>
      )}

      {/* Campaigns Grid */}
      {!loading && (
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status);
            return (
              <div key={campaign.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {campaign.platforms.map((platform) => (
                        <div key={platform} className={`w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 ${platform.toLowerCase() === "tiktok" ? "text-white" : ""}`}>
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-sm font-semibold text-white hover:text-pink-400 transition-colors"
                      >
                        {campaign.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">{campaign.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                    <div className="relative campaign-menu">
                      <button 
                        onClick={() => toggleMenu(campaign.id)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        aria-label="Campaign actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {activeMenu === campaign.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={() => duplicateCampaign(campaign.id)}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => deleteCampaign(campaign.id)}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors border-t border-slate-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Budget / Spend</p>
                    <p className="text-sm font-semibold text-white">${campaign.spend.toFixed(2)} / ${campaign.budget.toFixed(2)}</p>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(campaign.spend, campaign.budget)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Days Remaining</p>
                    <p className="text-sm font-semibold text-white">{campaign.daysRemaining} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Est. Reach</p>
                    <p className="text-sm font-semibold text-white">{campaign.reach.toLocaleString()}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    {campaign.status === "active" && (
                      <button 
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                        className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-medium hover:bg-yellow-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs"
                      >
                        <Pause className="w-3 h-3" />
                        Pause
                      </button>
                    )}
                    {campaign.status === "paused" && (
                      <button 
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs"
                      >
                        <Play className="w-3 h-3" />
                        Resume
                      </button>
                    )}
                    {campaign.status === "pending" && (
                      <span className="px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg flex items-center gap-1.5 text-xs">
                        <Clock className="w-3 h-3" />
                        Queued
                      </span>
                    )}
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 hover:text-white transition-all duration-300 flex items-center gap-1.5 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredCampaigns.length === 0 && (
        <div className="bg-slate-800/40 border border-slate-700/70 p-12 rounded-2xl text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-pink-500/30">
            <Sparkles className="w-7 h-7 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No campaigns found</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            {campaigns.length === 0
              ? "You haven't launched any ad campaigns yet. Set your budget and target your audience across Facebook, Instagram, and TikTok in minutes."
              : "No campaigns match your current filters. Try changing or clearing your filter selection."}
          </p>
          <Link
            href="/campaigns/new"
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Launch First Campaign</span>
          </Link>
        </div>
      )}
    </div>
  );
}
