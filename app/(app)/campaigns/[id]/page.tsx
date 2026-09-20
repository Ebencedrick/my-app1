"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  TrendingUp, 
  Facebook, 
  Instagram, 
  Target, 
  MapPin, 
  Users, 
  Calendar, 
  Pause, 
  Square, 
  Play, 
  X, 
  BarChart3, 
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Globe
} from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";

interface CampaignDetail {
  id: string;
  name: string;
  status: string;
  objective: string;
  platforms: string[];
  dailyBudget: number;
  days: number;
  totalBudget: number;
  totalSpend: number;
  managementFee: number;
  totalCharge: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  targeting: {
    location: string;
    ageRange: string;
    gender: string;
  };
  creative: {
    mediaType: string;
    mediaUrl?: string;
    copyText: string;
    cta: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    reach: number;
    ctr: number;
    cpc: number;
    costPerResult: number;
    conversions: number;
    reachPercentage: number;
  };
  performanceData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";
  
  const [showStopModal, setShowStopModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<"impressions" | "clicks" | "spend">("impressions");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchCampaign = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/campaigns/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Campaign not found");
        }
        throw new Error("Failed to load campaign");
      }
      const data = await res.json();
      const c = data.campaign;
      if (!c) throw new Error("Campaign not found");

      const totalCharge = c.totalCharge || c.totalAdSpend || 0;
      const isCompleted = c.status === "completed";
      const isLive = c.status === "active";
      const totalSpend = isCompleted ? totalCharge : isLive ? Number((totalCharge * 0.35).toFixed(2)) : 0;
      const daysRemaining = c.endDate
        ? Math.max(0, Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : (c.days || 7);

      const target = c.adSets?.[0]?.targeting || {};
      const creative = c.creative || {};

      // Simulated metrics based on spend & objective
      const baseReach = c.totalAdSpend ? Math.round(c.totalAdSpend * 120) : 15000;
      const impressions = Math.round(baseReach * 1.25);
      const clicks = Math.round(impressions * 0.028);
      const conversions = Math.round(clicks * 0.09);

      // Generate 7-day trend based on campaign timeline
      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
        return {
          date: d.toISOString().split("T")[0],
          impressions: Math.round((impressions / 7) * (0.8 + Math.random() * 0.4)),
          clicks: Math.round((clicks / 7) * (0.8 + Math.random() * 0.4)),
          spend: Number(((totalSpend / 7) * (0.8 + Math.random() * 0.4)).toFixed(2)),
        };
      });

      setCampaign({
        id: c._id,
        name: c.name || "Ad Campaign",
        status: c.status || "pending",
        objective: c.objective || "traffic_engagement",
        platforms: Array.isArray(c.platforms) && c.platforms.length ? c.platforms : ["facebook"],
        dailyBudget: c.dailyBudget || 10,
        days: c.days || 7,
        totalBudget: totalCharge,
        totalSpend,
        managementFee: c.managementFee || Number((c.totalAdSpend * 0.05).toFixed(2)),
        totalCharge,
        startDate: c.startDate ? new Date(c.startDate).toISOString().split("T")[0] : "",
        endDate: c.endDate ? new Date(c.endDate).toISOString().split("T")[0] : "",
        daysRemaining,
        targeting: {
          location: target.location || "Cameroon, Nigeria, Ivory Coast",
          ageRange: target.ageRange ? `${target.ageRange.min}-${target.ageRange.max}` : "18-45",
          gender: target.gender || "All genders",
        },
        creative: {
          mediaType: creative.mediaType || "image",
          mediaUrl: creative.mediaUrl || "",
          copyText: creative.copyText || "Discover our latest collection today with special limited offers!",
          cta: creative.ctaType || "Learn More",
        },
        metrics: {
          impressions,
          clicks,
          reach: baseReach,
          ctr: 2.8,
          cpc: Number((totalSpend / Math.max(clicks, 1)).toFixed(2)) || 0.25,
          costPerResult: Number((totalSpend / Math.max(conversions, 1)).toFixed(2)) || 1.80,
          conversions,
          reachPercentage: 68.4,
        },
        performanceData: dates,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "pending": 
      case "in_review":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return <Facebook className="w-5 h-5 text-blue-400" />;
      case "instagram": return <Instagram className="w-5 h-5 text-pink-400" />;
      case "tiktok": return <TikTokIcon className="w-5 h-5 text-white" />;
      default: return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const calculateProgress = (spend: number, budget: number) => {
    return budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;
  };

  const handlePauseResumeCampaign = async () => {
    if (!campaign) return;
    const nextStatus = campaign.status === "paused" ? "active" : "paused";
    try {
      setActionLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setCampaign(prev => prev ? { ...prev, status: nextStatus } : null);
        setActionSuccess(`Campaign status updated to ${nextStatus}.`);
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to update campaign status");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error updating campaign status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopCampaign = async () => {
    if (!campaign) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}/stop`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setCampaign(prev => prev ? { ...prev, status: "completed" } : null);
        setShowStopModal(false);
        setActionSuccess(`Campaign stopped. $${(data.refundedAmount || 0).toFixed(2)} refunded to your wallet balance.`);
      } else {
        alert(data.error || "Failed to stop campaign");
      }
    } catch (err) {
      console.error(err);
      alert("Error stopping campaign");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading campaign details...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-8 min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{error || "Campaign not found"}</h2>
        <p className="text-slate-400 mb-6">The campaign you requested could not be found or you do not have permission to view it.</p>
        <Link
          href="/campaigns"
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Notifications */}
      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/campaigns"
            className="text-pink-400 hover:text-pink-300 flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(campaign.status)}`}>
              {campaign.status === "active" && (
                <>
                  <CheckCircle className="w-3.5 h-3.5 mr-1 inline" />
                  Running
                </>
              )}
              {campaign.status === "paused" && (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1 inline" />
                  Paused
                </>
              )}
              {campaign.status === "pending" && (
                <>
                  <Clock className="w-3.5 h-3.5 mr-1 inline" />
                  In Review
                </>
              )}
              {campaign.status === "completed" && (
                <>
                  <CheckCircle className="w-3.5 h-3.5 mr-1 inline" />
                  Completed
                </>
              )}
              {!["active", "paused", "pending", "completed"].includes(campaign.status) && campaign.status}
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">{campaign.name}</h1>
        <p className="text-xs text-slate-500 font-mono">ID: {campaign.id}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-sm text-slate-400">Reach</p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{campaign.metrics.reach.toLocaleString()}</p>
          <p className="text-xs text-pink-400 mt-1">{campaign.metrics.reachPercentage.toFixed(1)}% of target audience</p>
        </div>
        
        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-slate-400">CTR</p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{campaign.metrics.ctr}%</p>
          <p className="text-xs text-slate-400 mt-1">Click-through rate</p>
        </div>
        
        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-sm text-slate-400">Cost per Click</p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">${campaign.metrics.cpc.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">Average CPC</p>
        </div>
        
        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-slate-400">Conversions</p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{campaign.metrics.conversions}</p>
          <p className="text-xs text-slate-400 mt-1">Total actions</p>
        </div>
      </div>

      {/* Performance Chart with Interactive Bar Details */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 hover:border-slate-600 transition-all duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-400" />
              Performance Over Time
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a metric or click any day bar below to inspect detailed daily delivery stats
            </p>
          </div>
          
          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-700/80 rounded-xl">
            <button
              onClick={() => setActiveChartMetric("impressions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeChartMetric === "impressions"
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Impressions
            </button>
            <button
              onClick={() => setActiveChartMetric("clicks")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeChartMetric === "clicks"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Clicks
            </button>
            <button
              onClick={() => setActiveChartMetric("spend")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeChartMetric === "spend"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Spend ($)
            </button>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-700/60">
          {campaign.performanceData.map((data, index) => {
            const rawValue = data[activeChartMetric];
            const maxVal = Math.max(...campaign.performanceData.map(d => d[activeChartMetric])) || 1;
            const height = Math.max(12, (rawValue / maxVal) * 100);
            const isSelected = selectedDayIndex === index;

            let barGradient = "from-pink-500 to-orange-500";
            let hoverGradient = "group-hover:from-pink-400 group-hover:to-orange-400";
            if (activeChartMetric === "clicks") {
              barGradient = "from-purple-500 to-indigo-500";
              hoverGradient = "group-hover:from-purple-400 group-hover:to-indigo-400";
            } else if (activeChartMetric === "spend") {
              barGradient = "from-emerald-500 to-teal-500";
              hoverGradient = "group-hover:from-emerald-400 group-hover:to-teal-400";
            }

            return (
              <button 
                key={index} 
                onClick={() => setSelectedDayIndex(index)}
                className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer focus:outline-none"
              >
                <div className={`text-[10px] font-semibold mb-1.5 transition-all ${
                  isSelected ? "text-white scale-110" : "text-slate-400 opacity-0 group-hover:opacity-100"
                }`}>
                  {activeChartMetric === "spend" ? `$${rawValue.toFixed(1)}` : rawValue.toLocaleString()}
                </div>
                <div 
                  className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${barGradient} ${hoverGradient} ${
                    isSelected ? "ring-2 ring-white shadow-lg shadow-pink-500/30 brightness-110 scale-[1.03]" : "opacity-85 group-hover:opacity-100"
                  }`} 
                  style={{ height: `${height}%` }}
                ></div>
                <div className={`text-xs mt-2 text-center transition-colors font-medium ${
                  isSelected ? "text-white font-bold" : "text-slate-400 group-hover:text-slate-200"
                }`}>
                  {new Date(data.date).toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-[10px] text-slate-500">
                  {new Date(data.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Inspector Card */}
        {campaign.performanceData[selectedDayIndex] && (() => {
          const selectedDay = campaign.performanceData[selectedDayIndex];
          const dayCtr = selectedDay.impressions > 0 ? ((selectedDay.clicks / selectedDay.impressions) * 100).toFixed(2) : "0.00";
          const dayCpc = selectedDay.clicks > 0 ? (selectedDay.spend / selectedDay.clicks).toFixed(2) : "0.00";

          return (
            <div className="mt-5 p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                  {new Date(selectedDay.date).toLocaleDateString("en-US", { day: "numeric" })}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {new Date(selectedDay.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Day #{selectedDayIndex + 1} of campaign schedule
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                <div>
                  <div className="text-[11px] text-slate-400">Impressions</div>
                  <div className="text-sm font-bold text-white">{selectedDay.impressions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Clicks</div>
                  <div className="text-sm font-bold text-purple-400">{selectedDay.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Day Spend</div>
                  <div className="text-sm font-bold text-emerald-400">${selectedDay.spend.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">CTR / CPC</div>
                  <div className="text-sm font-bold text-orange-400">{dayCtr}% <span className="text-slate-500 font-normal">(${dayCpc})</span></div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Campaign Details */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
          <h2 className="text-xl font-semibold text-white mb-4">Campaign Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Objective</span>
              <span className="text-white font-medium capitalize">
                {campaign.objective === "awareness" ? "Views & Awareness" : "Traffic & Engagement"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Platforms</span>
              <div className="flex gap-2">
                {campaign.platforms.map((platform) => (
                  <span key={platform}>{getPlatformIcon(platform)}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Targeting</span>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white text-sm">
                  <MapPin className="w-3 h-3" />
                  {campaign.targeting.location}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Users className="w-3 h-3" />
                  {campaign.targeting.ageRange} • {campaign.targeting.gender}
                </div>
              </div>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Daily Budget</span>
              <span className="text-white font-medium">${campaign.dailyBudget.toFixed(2)}/day</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Start Date</span>
              <span className="text-white">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "Pending review"}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">End Date</span>
              <span className="text-white">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Pending review"}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Days Remaining</span>
              <span className="text-white">{campaign.daysRemaining} days</span>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Budget Usage</span>
              <span className="text-white font-medium">
                ${campaign.totalSpend.toFixed(2)} / ${campaign.totalBudget.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress(campaign.totalSpend, campaign.totalBudget)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">{calculateProgress(campaign.totalSpend, campaign.totalBudget).toFixed(1)}% budget used</p>
          </div>
        </div>

        {/* Creative Preview */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
          <h2 className="text-xl font-semibold text-white mb-4">Creative Preview</h2>
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700">
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-3 border border-slate-700 overflow-hidden relative">
              {campaign.creative.mediaUrl ? (
                <img
                  src={campaign.creative.mediaUrl}
                  alt="Campaign Creative"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-8 h-8 text-pink-400 mb-2" />
                  <span className="text-slate-400 text-sm">Media Banner Active</span>
                </div>
              )}
            </div>
            <p className="text-white text-sm mb-3 font-normal leading-relaxed">{campaign.creative.copyText}</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDestinationModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-xs font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-md shadow-pink-500/20 flex items-center gap-1.5 cursor-pointer"
                title="Click to test live destination page simulation"
              >
                <span>{campaign.creative.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-400">
                Click button to preview destination
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p><strong className="text-slate-300">Media Type:</strong> <span className="capitalize">{campaign.creative.mediaType}</span></p>
            <p><strong className="text-slate-300">Copy Length:</strong> {campaign.creative.copyText.length} characters</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
        <h2 className="text-xl font-semibold text-white mb-4">Actions & Operations</h2>
        <div className="flex flex-wrap gap-4">
          {(campaign.status === "active" || campaign.status === "pending") && (
            <>
              {campaign.status === "active" && (
                <button
                  disabled={actionLoading}
                  onClick={handlePauseResumeCampaign}
                  className="px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl font-semibold hover:bg-yellow-500/30 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Pause className="w-4 h-4" />
                  Pause Campaign
                </button>
              )}
              {campaign.status === "pending" && (
                <button
                  disabled={actionLoading}
                  onClick={() => handlePauseResumeCampaign()}
                  className="px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold hover:bg-emerald-500/30 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  Activate Campaign Now
                </button>
              )}
              <button
                disabled={actionLoading}
                onClick={() => setShowStopModal(true)}
                className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Square className="w-4 h-4" />
                Stop Campaign & Refund Hold
              </button>
            </>
          )}

          {campaign.status === "paused" && (
            <>
              <button
                disabled={actionLoading}
                onClick={handlePauseResumeCampaign}
                className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-semibold hover:bg-green-500/30 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                Resume Campaign
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setShowStopModal(true)}
                className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Square className="w-4 h-4" />
                Stop Campaign & Refund Hold
              </button>
            </>
          )}

          {campaign.status === "completed" && (
            <div className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              Campaign Completed (All remaining hold released to wallet)
            </div>
          )}
        </div>
      </div>

      {/* Stop Campaign Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Stop Campaign Early?</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Stopping this campaign will immediately halt ad delivery. Any unused budget from your hold of <strong className="text-white">${campaign.totalBudget.toFixed(2)}</strong> will be instantly refunded to your available wallet balance via the ledger system.
            </p>
            <div className="flex gap-4">
              <button
                disabled={actionLoading}
                onClick={() => setShowStopModal(false)}
                className="flex-1 px-6 py-3 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleStopCampaign}
                className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Destination / Landing Page Simulator Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Simulated Browser Bar */}
            <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              
              <div className="flex-1 max-w-lg bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-slate-300">
                <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate text-slate-400">
                  https://app.growthhub.io/preview/{campaign.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}?utm_source={campaign.platforms[0] || "feed"}&utm_medium=paid_ad&utm_campaign={encodeURIComponent(campaign.name)}
                </span>
              </div>

              <button
                onClick={() => setShowDestinationModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                title="Close simulator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Webpage Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/20 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Ad Destination Preview
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {campaign.name}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {campaign.creative.copyText}
                </p>
              </div>

              {/* Destination Landing Card */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Call to Action Triggered</div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium">
                    Status: Tracking Active
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block mb-1">Assigned Action:</span>
                    <span className="text-white font-semibold text-sm">{campaign.creative.cta}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block mb-1">Target Audience:</span>
                    <span className="text-white font-medium">{campaign.targeting.location} ({campaign.targeting.ageRange})</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 text-xs space-y-1.5">
                  <span className="text-slate-400 block font-medium">Attribution & UTM Tracking Parameters:</span>
                  <div className="font-mono text-slate-300 text-[11px] break-all">
                    • utm_source: <span className="text-pink-400">{campaign.platforms.join(", ")}</span><br />
                    • utm_medium: <span className="text-purple-400">cpc</span><br />
                    • utm_campaign: <span className="text-emerald-400">{campaign.name}</span><br />
                    • utm_content: <span className="text-orange-400">{campaign.creative.mediaType}_variant</span>
                  </div>
                </div>
              </div>

              {/* Conversion Simulator */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 text-center sm:text-left">
                  This simulated page verifies your ad CTA route and conversion attribution funnel.
                </div>
                <button
                  onClick={() => {
                    setActionSuccess("Simulated test conversion registered!");
                    setTimeout(() => setActionSuccess(null), 4000);
                    setShowDestinationModal(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold text-xs rounded-xl hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Simulate Successful Conversion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
