"use client";

import Link from "next/link";
import { 
  Megaphone, 
  DollarSign, 
  Eye, 
  Wallet, 
  Plus, 
  ArrowRight, 
  CreditCard, 
  TrendingUp,
  Flame
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual API calls
  const walletBalance = 1250.00;
  const activeCampaigns = 3;
  const totalSpendToday = 45.50;
  const totalReach = 12500;

  const recentActivity = [
    { id: 1, type: "deposit", description: "Mobile Money deposit", amount: "+$500.00", time: "2 hours ago" },
    { id: 2, type: "campaign", description: "Summer Sale campaign approved", amount: "", time: "5 hours ago" },
    { id: 3, type: "spend", description: "Daily ad spend deduction", amount: "-$15.50", time: "1 day ago" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your campaign overview.</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-2xl shadow-pink-500/25 group hover:shadow-pink-500/40 transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <p className="text-pink-100">Wallet Balance</p>
            </div>
            <p className="text-4xl font-bold group-hover:scale-105 transition-transform duration-300">${walletBalance.toFixed(2)}</p>
          </div>
          <Link
            href="/wallet"
            className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Megaphone className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-sm text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{activeCampaigns}</p>
          <p className="text-slate-400 text-sm">Active Campaigns</p>
        </div>

        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Today</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">${totalSpendToday.toFixed(2)}</p>
          <p className="text-slate-400 text-sm">Total Spend Today</p>
        </div>

        <div className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Eye className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-sm text-slate-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{totalReach.toLocaleString()}</p>
          <p className="text-slate-400 text-sm">Total Reach</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 hover:border-slate-600 transition-all duration-500">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/campaigns/new"
            className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 text-center flex items-center justify-center gap-2 group hover:scale-105 shadow-lg shadow-pink-500/25"
          >
            <Flame className="w-4 h-4" />
            Create New Campaign
          </Link>
          <Link
            href="/campaigns"
            className="flex-1 py-4 border-2 border-pink-500/50 text-pink-400 rounded-lg font-semibold hover:bg-pink-500/10 transition-all duration-300 text-center flex items-center justify-center gap-2 group hover:scale-105"
          >
            View All Campaigns
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all duration-500">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0 group hover:bg-slate-700/30 rounded-lg px-2 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === "deposit" 
                    ? "bg-green-500/20" 
                    : activity.type === "campaign" 
                    ? "bg-pink-500/20" 
                    : "bg-orange-500/20"
                }`}>
                  {activity.type === "deposit" ? (
                    <CreditCard className="w-5 h-5 text-green-400" />
                  ) : activity.type === "campaign" ? (
                    <Megaphone className="w-5 h-5 text-pink-400" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-slate-400 text-sm">{activity.time}</p>
                </div>
              </div>
              {activity.amount && (
                <span className={`font-semibold ${
                  activity.amount.startsWith("+") ? "text-green-400" : "text-red-400"
                }`}>
                  {activity.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
