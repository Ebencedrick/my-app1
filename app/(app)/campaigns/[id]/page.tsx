"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
  Flame,
  BarChart3,
  CheckCircle
} from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id || "unknown";
  const [showStopModal, setShowStopModal] = useState(false);
  const [campaign, setCampaign] = useState({
    id: id,
    name: "Summer Sale 2024",
    status: "active" as "active" | "paused" | "completed",
    objective: "traffic_engagement" as "awareness" | "traffic_engagement",
    platforms: ["facebook", "instagram"],
    dailyBudget: 50.00,
    days: 14,
    totalBudget: 700.00,
    totalSpend: 325.50,
    managementFee: 48.83,
    totalCharge: 374.33,
    startDate: "2024-01-10",
    endDate: "2024-01-24",
    daysRemaining: 8,
    targeting: {
      location: "Cameroon, Nigeria",
      ageRange: "18-45",
      gender: "all",
    },
    creative: {
      mediaType: "image",
      mediaUrl: "/placeholder-image.jpg",
      copyText: "Summer Sale! Up to 50% off on all items. Limited time offer!",
      cta: "Shop Now",
    },
    metrics: {
      impressions: 45230,
      clicks: 1234,
      reach: 38500,
      ctr: 2.73,
      cpc: 0.26,
      costPerResult: 1.85,
      conversions: 176,
      reachPercentage: 78.5,
    },
    performanceData: [
      { date: "2024-01-10", impressions: 3200, clicks: 85, spend: 22.50 },
      { date: "2024-01-11", impressions: 4100, clicks: 112, spend: 29.80 },
      { date: "2024-01-12", impressions: 3800, clicks: 98, spend: 25.40 },
      { date: "2024-01-13", impressions: 4500, clicks: 125, spend: 33.20 },
      { date: "2024-01-14", impressions: 5200, clicks: 145, spend: 38.10 },
      { date: "2024-01-15", impressions: 4800, clicks: 132, spend: 34.60 },
      { date: "2024-01-16", impressions: 5100, clicks: 140, spend: 36.80 },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return <Facebook className="w-5 h-5 text-blue-400" />;
      case "instagram": return <Instagram className="w-5 h-5 text-pink-400" />;
      case "tiktok": return <TikTokIcon className="w-5 h-5 text-white" />;
      default: return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const calculateProgress = (spend: number, budget: number) => {
    return budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;
  };

  const handlePauseCampaign = () => {
    setCampaign(prev => ({
      ...prev,
      status: prev.status === "paused" ? "active" : "paused",
    }));
  };

  const handleStopCampaign = () => {
    setCampaign(prev => ({
      ...prev,
      status: "completed",
    }));
    setShowStopModal(false);
    alert("Campaign stopped. Unused budget will be refunded to your wallet.");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="text-pink-400 hover:text-pink-300 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </button>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getStatusColor(campaign.status)}`}>
              {campaign.status === "active" && (
                <>
                  <CheckCircle className="w-4 h-4 mr-1 inline" />
                  Running
                </>
              )}
              {campaign.status === "paused" && (
                <>
                  <Pause className="w-4 h-4 mr-1 inline" />
                  Paused
                </>
              )}
              {campaign.status}
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{campaign.name}</h1>
        <p className="text-slate-400">ID: {campaign.id}</p>
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

      {/* Performance Chart */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 hover:border-slate-600 transition-all duration-500">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-pink-400" />
          Performance Over Time
        </h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {campaign.performanceData.map((data, index) => {
            const maxImpressions = Math.max(...campaign.performanceData.map(d => d.impressions));
            const height = (data.impressions / maxImpressions) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-gradient-to-t from-pink-500 to-orange-500 rounded-t transition-all duration-300 group-hover:from-pink-400 group-hover:to-orange-400" 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-slate-400 mt-2 text-center group-hover:text-white transition-colors">
                  {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
            <span className="text-slate-400">Impressions</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Campaign Details */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
          <h2 className="text-xl font-semibold text-white mb-4">Campaign Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">Objective</span>
              <span className="text-white font-medium capitalize">{campaign.objective === "awareness" ? "Views & Awareness" : "Traffic & Engagement"}</span>
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
              <span className="text-slate-400">Start Date</span>
              <span className="text-white">{new Date(campaign.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-400">End Date</span>
              <span className="text-white">{new Date(campaign.endDate).toLocaleDateString()}</span>
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
              <span className="text-white">
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
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-3 border border-slate-700">
              <span className="text-slate-400 text-sm">Ad Image Preview</span>
            </div>
            <p className="text-white text-sm mb-2">{campaign.creative.copyText}</p>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-pink-400 hover:to-orange-400 transition-all duration-300">
              {campaign.creative.cta}
            </button>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p><strong className="text-slate-300">Media Type:</strong> {campaign.creative.mediaType}</p>
            <p><strong className="text-slate-300">Character Count:</strong> {campaign.creative.copyText.length}/125</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
        <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
        <div className="flex gap-4">
          {campaign.status === "active" && (
            <>
              <button
                onClick={handlePauseCampaign}
                className="px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl font-semibold hover:bg-yellow-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause Campaign
              </button>
              <button
                onClick={() => setShowStopModal(true)}
                className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop Campaign
              </button>
            </>
          )}
          {campaign.status === "paused" && (
            <button
              onClick={handlePauseCampaign}
              className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-semibold hover:bg-green-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Resume Campaign
            </button>
          )}
          {campaign.status === "completed" && (
            <div className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Campaign Stopped
            </div>
          )}
        </div>
      </div>

      {/* Stop Campaign Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Stop Campaign</h2>
            <p className="text-slate-400 mb-6">
              Are you sure you want to stop this campaign? The unused budget of ${(campaign.totalBudget - campaign.totalSpend).toFixed(2)} will be refunded to your wallet.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowStopModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleStopCampaign}
                className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
