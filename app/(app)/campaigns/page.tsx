"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Plus, Eye, Pause, Play, MoreHorizontal, Edit, Trash2, Copy, X } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: "cmp_123",
      name: "Summer Sale 2024",
      platforms: ["facebook", "instagram"],
      status: "active",
      budget: 500.00,
      spend: 125.50,
      daysRemaining: 12,
      startDate: "2024-01-10",
      reach: 15400,
    },
    {
      id: "cmp_122",
      name: "New Product Launch",
      platforms: ["tiktok"],
      status: "active",
      budget: 300.00,
      spend: 280.00,
      daysRemaining: 2,
      startDate: "2024-01-05",
      reach: 8900,
    },
    {
      id: "cmp_121",
      name: "Brand Awareness",
      platforms: ["facebook", "instagram", "tiktok"],
      status: "paused",
      budget: 1000.00,
      spend: 450.00,
      daysRemaining: 20,
      startDate: "2024-01-01",
      reach: 32000,
    },
    {
      id: "cmp_120",
      name: "Flash Sale",
      platforms: ["facebook"],
      status: "completed",
      budget: 200.00,
      spend: 195.00,
      daysRemaining: 0,
      startDate: "2023-12-20",
      reach: 12500,
    },
    {
      id: "cmp_119",
      name: "Holiday Campaign",
      platforms: ["instagram", "tiktok"],
      status: "draft",
      budget: 400.00,
      spend: 0,
      daysRemaining: 30,
      startDate: "2024-02-01",
      reach: 0,
    },
  ]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active": return { label: "Running", className: "bg-green-500/20 text-green-400 border border-green-500/30" };
      case "paused": return { label: "Paused", className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" };
      case "completed": return { label: "Completed", className: "bg-blue-500/20 text-blue-400 border border-blue-500/30" };
      case "draft": return { label: "Draft", className: "bg-slate-500/20 text-slate-400 border border-slate-500/30" };
      case "rejected": return { label: "Rejected", className: "bg-red-500/20 text-red-400 border border-red-500/30" };
      default: return { label: status, className: "bg-slate-500/20 text-slate-400 border border-slate-500/30" };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return <Facebook className="w-4 h-4 text-blue-400" />;
      case "instagram": return <Instagram className="w-4 h-4 text-pink-400" />;
      case "tiktok": return <TikTokIcon />;
      default: return null;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (statusFilter !== "all" && campaign.status !== statusFilter) return false;
    if (platformFilter !== "all" && !campaign.platforms.includes(platformFilter)) return false;
    return true;
  });

  const calculateProgress = (spend: number, budget: number) => {
    return budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, status: campaign.status === "active" ? "paused" : "active" }
          : campaign
      )
    );
  };

  const toggleMenu = (campaignId: string) => {
    setActiveMenu(activeMenu === campaignId ? null : campaignId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const duplicateCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const newCampaign = {
        ...campaign,
        id: `cmp_${Date.now()}`,
        name: `${campaign.name} (Copy)`,
        status: "draft",
        spend: 0,
      };
      setCampaigns([...campaigns, newCampaign]);
    }
    closeMenu();
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
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
          <p className="text-sm sm:text-base text-slate-400">Manage and monitor your ad campaigns</p>
        </div>
        <Link
          href="/campaigns/new"
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 hover:scale-105 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:block">Create Campaign</span>
        </Link>
      </div>

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
              <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
              <X className="w-4 h-4 text-slate-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {["all", "active", "paused", "completed", "draft", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setStatusDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      statusFilter === status
                        ? "bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-400"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Campaigns Grid */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => {
          const statusConfig = getStatusConfig(campaign.status);
          return (
            <div key={campaign.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {campaign.platforms.map((platform) => (
                      <div key={platform} className={`w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 ${platform === "tiktok" ? "text-white" : ""}`}>
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
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {activeMenu === campaign.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={() => { closeMenu(); }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Campaign
                        </button>
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
                  <p className="text-xs text-slate-400 mb-1">Reach</p>
                  <p className="text-sm font-semibold text-white">{campaign.reach.toLocaleString()}</p>
                </div>
                <div className="flex items-end gap-2">
                  {campaign.status === "active" && (
                    <button 
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-medium hover:bg-yellow-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs"
                    >
                      <Pause className="w-3 h-3" />
                      Pause
                    </button>
                  )}
                  {campaign.status === "paused" && (
                    <button 
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs"
                    >
                      <Play className="w-3 h-3" />
                      Resume
                    </button>
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

      {filteredCampaigns.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl text-center">
          <p className="text-slate-400 text-sm">No campaigns found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
