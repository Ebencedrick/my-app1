"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Flame,
  Megaphone,
  Pause,
  Play,
  Plus,
  TrendingUp,
  Wallet,
  Smartphone,
  Bitcoin,
  QrCode,
  X,
  Loader2,
} from "lucide-react";

type CampaignStatus = "live" | "paused" | "draft" | "pending";

type Campaign = {
  id: string | number;
  name: string;
  status: CampaignStatus;
  spend: number;
  reach: number;
  ctr: number;
  budget: number;
  platform: string;
};

type ActivityItem = {
  id: string | number;
  type: "deposit" | "campaign" | "spend";
  description: string;
  amount: string;
  time: string;
};

const initialCampaigns: Campaign[] = [
  { id: "demo_1", name: "Summer Sale Push", status: "live", spend: 1480, reach: 32000, ctr: 4.8, budget: 2500, platform: "TikTok" },
  { id: "demo_2", name: "Brand Awareness", status: "paused", spend: 620, reach: 18000, ctr: 3.2, budget: 1200, platform: "Instagram" },
  { id: "demo_3", name: "Retargeting Boost", status: "draft", spend: 240, reach: 9000, ctr: 2.7, budget: 800, platform: "Meta" },
  { id: "demo_4", name: "Weekend Offer", status: "live", spend: 980, reach: 22000, ctr: 5.1, budget: 1800, platform: "Meta" },
];

const initialActivity: ActivityItem[] = [
  { id: 1, type: "deposit", description: "Mobile Money deposit", amount: "+$500.00", time: "2 hours ago" },
  { id: 2, type: "campaign", description: "Summer Sale campaign approved", amount: "", time: "5 hours ago" },
  { id: 3, type: "spend", description: "Daily ad spend deduction", amount: "-$15.50", time: "1 day ago" },
  { id: 4, type: "campaign", description: "New creative review complete", amount: "", time: "2 days ago" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>("all");
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [activeDepositTab, setActiveDepositTab] = useState<"momo" | "crypto">("momo");
  const [momoPhone, setMomoPhone] = useState("+237 670 000 000");
  const [momoAmount, setMomoAmount] = useState(100);
  const [cryptoAmount, setCryptoAmount] = useState(100);
  const [cryptoCurrency, setCryptoCurrency] = useState("usdt");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(initialCampaigns[0]);
  const [toast, setToast] = useState<string | null>("Dashboard refreshed");

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "all") return campaigns;
    return campaigns.filter((campaign) => campaign.status === statusFilter);
  }, [campaigns, statusFilter]);

  const summary = useMemo(() => {
    const activeCount = campaigns.filter((campaign) => campaign.status === "live").length;
    const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
    const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
    return {
      activeCount,
      totalSpend,
      totalReach,
      avgCtr: campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.ctr, 0) / campaigns.length : 0,
    };
  }, [campaigns]);

  const handleCreateCampaign = () => {
    setToast("Campaign workspace opened");
    router.push("/campaigns/new");
  };

  const handleConfirmDeposit = async (gateway: "momo" | "crypto") => {
    const amount = gateway === "momo" ? Number(momoAmount) : Number(cryptoAmount);
    if (!amount || amount < 5) {
      setDepositError("Minimum deposit amount is $5.00");
      return;
    }
    if (gateway === "momo" && !momoPhone) {
      setDepositError("Please enter your mobile money phone number");
      return;
    }

    try {
      setIsDepositing(true);
      setDepositError(null);
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          gateway,
          phone: gateway === "momo" ? momoPhone : undefined,
          cryptoCurrency: gateway === "crypto" ? cryptoCurrency : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWalletBalance(data.balance || 0);
        localStorage.setItem("mock_wallet_balance", String(data.balance || 0));
        setActivity((current) => [
          {
            id: Date.now(),
            type: "deposit",
            description: `${gateway === "momo" ? "Mobile Money" : cryptoCurrency.toUpperCase()} deposit of $${amount.toFixed(2)}`,
            amount: `+$${amount.toFixed(2)}`,
            time: "Just now",
          },
          ...current,
        ]);
        setToast(`Successfully deposited $${amount.toFixed(2)} into your ledger wallet!`);
        setShowFundsModal(false);
      } else {
        setDepositError(data.error || "Deposit failed");
      }
    } catch (err: any) {
      console.error(err);
      setDepositError("Network error during deposit");
    } finally {
      setIsDepositing(false);
    }
  };

  // Initialize balance, transactions, and live campaigns from MongoDB APIs
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [balRes, txRes, campRes] = await Promise.all([
          fetch("/api/wallet/balance"),
          fetch("/api/wallet/transactions?limit=10"),
          fetch("/api/campaigns"),
        ]);

        if (balRes.ok) {
          const balData = await balRes.json();
          setWalletBalance(balData.availableBalance || 0);
          localStorage.setItem("mock_wallet_balance", String(balData.availableBalance || 0));
        }

        if (txRes.ok) {
          const txData = await txRes.json();
          if (txData.transactions && txData.transactions.length) {
            const formatted: ActivityItem[] = txData.transactions.map((t: any) => ({
              id: t._id,
              type: t.type === "deposit" ? "deposit" : t.type === "settlement" ? "spend" : "campaign",
              description: t.type === "deposit"
                ? `${t.gateway ? t.gateway.toUpperCase() : "Wallet"} deposit`
                : t.type === "hold"
                ? "Campaign budget hold"
                : t.type === "settlement"
                ? "Campaign ad spend"
                : "Hold release",
              amount: t.type === "deposit" || t.type === "holdRelease" || t.type === "refund"
                ? `+$${t.amount.toFixed(2)}`
                : `-$${t.amount.toFixed(2)}`,
              time: new Date(t.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));
            setActivity(formatted);
          }
        }

        if (campRes.ok) {
          const campData = await campRes.json();
          if (campData.campaigns && campData.campaigns.length > 0) {
            const dbCampaigns: Campaign[] = campData.campaigns.map((c: any) => {
              const budget = c.totalCharge || c.totalAdSpend || 0;
              const isLive = c.status === "active";
              const isCompleted = c.status === "completed";
              const spend = isCompleted ? budget : isLive ? Number((budget * 0.35).toFixed(2)) : 0;
              const reach = c.totalAdSpend ? Math.round(c.totalAdSpend * 120) : 0;
              const platforms = Array.isArray(c.platforms) && c.platforms.length ? c.platforms.join(", ") : "Meta";

              let status: CampaignStatus = "draft";
              if (c.status === "active") status = "live";
              else if (c.status === "paused") status = "paused";
              else if (c.status === "pending" || c.status === "in_review") status = "pending";

              return {
                id: c._id,
                name: c.name || "Ad Campaign",
                status,
                spend,
                reach,
                ctr: 3.2,
                budget,
                platform: platforms,
              };
            });
            setCampaigns(dbCampaigns);
            setSelectedCampaign(dbCampaigns[0]);
          }
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      }
    }

    loadDashboardData();
  }, []);

  const handleToggleCampaign = async (id: string | number) => {
    const target = campaigns.find(c => c.id === id);
    if (!target) return;
    const nextStatus: CampaignStatus = target.status === "live" ? "paused" : "live";

    setCampaigns((current) =>
      current.map((campaign) => {
        if (campaign.id !== id) return campaign;
        return { ...campaign, status: nextStatus };
      })
    );

    if (typeof id === "string" && id.length === 24) {
      try {
        await fetch(`/api/campaigns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus === "live" ? "active" : "paused" }),
        });
      } catch (e) {
        console.error("Error updating campaign status:", e);
      }
    }
    setToast(`Campaign status updated to ${nextStatus}`);
  };

  const handleViewDetails = (campaignId: string | number) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleActivityAction = (item: ActivityItem) => {
    if (item.type === "deposit") {
      router.push("/wallet");
    } else if (item.type === "campaign") {
      router.push("/campaigns");
    } else if (item.type === "spend") {
      router.push("/billing");
    } else {
      router.push("/activity");
    }
  };

  return (
    <div className="min-h-screen p-6">
      {toast ? (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">Dashboard</h1>
          <p className="text-base text-slate-400">Campaign overview and live operations center.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowFundsModal(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-pink-600 transition hover:bg-pink-50"
          >
            <Plus className="h-4 w-4" />
            Add funds
          </button>
          <button
            type="button"
            onClick={handleCreateCampaign}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-pink-500/20 transition hover:from-pink-400 hover:to-orange-400"
          >
            <Flame className="h-4 w-4" />
            New campaign
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-3xl bg-gradient-to-br from-pink-600 to-orange-600 p-6 text-white shadow-2xl shadow-pink-500/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-pink-100">Wallet balance</p>
                <p className="text-xs text-pink-100/80">Available funds in MongoDB ledger</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold">{showBalance ? `$${walletBalance.toFixed(2)}` : '•••••'}</p>
              <button
                onClick={() => setShowBalance((s) => !s)}
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                className="text-slate-300 hover:text-white rounded-md p-2"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowFundsModal(true)}
                className="ml-4 px-3 py-2 rounded-md bg-white text-pink-600 text-sm font-medium hover:bg-pink-50"
              >
                Add funds
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm backdrop-blur-sm">
            <p className="text-pink-100">Ledger Status</p>
            <p className="mt-1 text-xl font-semibold">Active & Synced</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10">
              <Megaphone className="h-5 w-5 text-pink-400" />
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Live</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary.activeCount}</p>
          <p className="mt-1 text-sm text-slate-400">Active campaigns</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <DollarSign className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-xs text-slate-300">Total</span>
          </div>
          <p className="text-3xl font-bold text-white">${summary.totalSpend.toFixed(2)}</p>
          <p className="mt-1 text-sm text-slate-400">Total ad spend</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
              <Eye className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-xs text-slate-300">Reach</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary.totalReach.toLocaleString()}</p>
          <p className="mt-1 text-sm text-slate-400">Total audience reach</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-white">Campaign monitor</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "live", "paused", "pending", "draft"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-sm transition capitalize ${
                  statusFilter === filter
                    ? "bg-pink-500/15 text-pink-300 ring-1 ring-pink-500/40"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {filter === "all" ? "All" : filter === "pending" ? "In Review" : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{campaign.name}</p>
                  <p className="text-sm text-slate-400 capitalize">{campaign.platform}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs capitalize ${
                    campaign.status === "live"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : campaign.status === "paused"
                        ? "bg-yellow-500/10 text-yellow-300"
                        : campaign.status === "pending"
                          ? "bg-amber-500/10 text-amber-300"
                          : "bg-slate-500/10 text-slate-300"
                  }`}
                >
                  {campaign.status === "live" ? "Running" : campaign.status === "pending" ? "In Review" : campaign.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Spend</p>
                  <p className="mt-1 font-semibold text-white">${campaign.spend.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Reach</p>
                  <p className="mt-1 font-semibold text-white">{campaign.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">CTR</p>
                  <p className="mt-1 font-semibold text-white">{campaign.ctr}%</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleViewDetails(campaign.id)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-pink-500/40 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleCampaign(campaign.id)}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
                >
                  {campaign.status === "live" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {campaign.status === "live" ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent activity</h2>
            <button type="button" onClick={() => setToast("Activity stream refreshed")} className="text-sm text-pink-300 hover:text-pink-200">
              Refresh
            </button>
          </div>

          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      item.type === "deposit"
                        ? "bg-emerald-500/10"
                        : item.type === "campaign"
                          ? "bg-pink-500/10"
                          : "bg-orange-500/10"
                    }`}
                  >
                    {item.type === "deposit" ? (
                      <CreditCard className="h-4 w-4 text-emerald-400" />
                    ) : item.type === "campaign" ? (
                      <Megaphone className="h-4 w-4 text-pink-400" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-orange-400" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-white">{item.description}</p>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>

                {item.amount ? (
                  <span className={item.amount.startsWith("+") ? "text-emerald-300" : "text-red-300"}>{item.amount}</span>
                ) : (
                  <button type="button" onClick={() => handleActivityAction(item)} className="text-xs text-pink-300 hover:text-pink-200">Preview</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Campaign insights</h2>
            <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-pink-300 hover:text-pink-200">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {selectedCampaign ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Selected campaign</p>
              <p className="mt-2 text-xl font-semibold text-white">{selectedCampaign.name}</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Budget</span>
                  <span>${selectedCampaign.budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Spend</span>
                  <span>${selectedCampaign.spend.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reach</span>
                  <span>{selectedCampaign.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>CTR</span>
                  <span>{selectedCampaign.ctr}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center text-slate-400 text-sm">
              No campaigns to display yet.
            </div>
          )}
        </div>
      </div>

      {showFundsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Add Funds</h2>
                <p className="text-xs text-slate-400 mt-0.5">Deposit directly into your ledger wallet</p>
              </div>
              <button
                onClick={() => setShowFundsModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {depositError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                {depositError}
              </div>
            )}

            {/* Tabs */}
            <div className="flex mb-4 bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setActiveDepositTab("momo")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
                  activeDepositTab === "momo"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile Money
              </button>
              <button
                onClick={() => setActiveDepositTab("crypto")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
                  activeDepositTab === "crypto"
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bitcoin className="w-3.5 h-3.5" />
                Crypto
              </button>
            </div>

            {/* Mobile Money Tab */}
            {activeDepositTab === "momo" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number (MTN / Orange) *
                  </label>
                  <input
                    type="tel"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    value={momoAmount}
                    onChange={(e) => setMomoAmount(Number(e.target.value))}
                    placeholder="100.00"
                    min="5"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={() => handleConfirmDeposit("momo")}
                  disabled={isDepositing}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50 text-sm"
                >
                  {isDepositing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  {isDepositing ? "Processing..." : "Confirm & Deposit"}
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  Funds are instantly credited to your MongoDB ledger wallet.
                </p>
              </div>
            )}

            {/* Crypto Tab */}
            {activeDepositTab === "crypto" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Cryptocurrency
                  </label>
                  <select 
                    value={cryptoCurrency}
                    onChange={(e) => setCryptoCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all text-sm"
                  >
                    <option value="usdt">USDT (TRC20 / ERC20)</option>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(Number(e.target.value))}
                    placeholder="100.00"
                    min="5"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all text-sm"
                  />
                </div>
                <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 text-pink-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Scan QR Code or copy deposit address</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    0x71C...AdsPlatformTreasuryUSD
                  </p>
                </div>
                <button
                  onClick={() => handleConfirmDeposit("crypto")}
                  disabled={isDepositing}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50 text-sm"
                >
                  {isDepositing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  {isDepositing ? "Confirming..." : "Confirm & Deposit"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
