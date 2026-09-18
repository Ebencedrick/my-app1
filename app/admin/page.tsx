"use client";

import { useMemo, useState } from "react";

const ranges = {
  "7d": { users: "12.4K", campaigns: "486", revenue: "$28,460", reviews: "21" },
  "30d": { users: "18.2K", campaigns: "642", revenue: "$41,890", reviews: "28" },
  "90d": { users: "32.7K", campaigns: "912", revenue: "$96,540", reviews: "37" },
};

const transactions = [
  { name: "MoMo Deposit", user: "Amina Kofi", amount: "$1,200", time: "10 mins ago", status: "Completed" },
  { name: "Campaign Spend", user: "Nadia Wambui", amount: "$430", time: "28 mins ago", status: "Processing" },
  { name: "Campaign Launch", user: "Daniel Mensah", amount: "$920", time: "2 hours ago", status: "Approved" },
  { name: "Withdrawal", user: "Kehinde Bello", amount: "$300", time: "4 hours ago", status: "Completed" },
];

const campaigns = [
  { name: "Summer Sale Push", status: "Live", budget: "$2.5K", spend: "$1.8K" },
  { name: "Brand Awareness Booster", status: "Review", budget: "$1.2K", spend: "$480" },
  { name: "Geo Retargeting", status: "Paused", budget: "$800", spend: "$620" },
];

export default function AdminOverviewPage() {
  const [range, setRange] = useState<keyof typeof ranges>("30d");
  const stats = useMemo(() => [
    { label: "Total users", value: ranges[range].users, delta: "+18.2%", tone: "emerald" },
    { label: "Active campaigns", value: ranges[range].campaigns, delta: "+9.4%", tone: "pink" },
    { label: "Platform revenue", value: ranges[range].revenue, delta: "+12.7%", tone: "amber" },
    { label: "Pending reviews", value: ranges[range].reviews, delta: "-3.1%", tone: "blue" },
  ], [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Overview</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Platform dashboard</h1>
        </div>

        <div className="flex gap-2">
          {Object.keys(ranges).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key as keyof typeof ranges)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                range === key ? "bg-pink-500/15 text-pink-300 ring-1 ring-pink-500/40" : "bg-slate-800 text-slate-300"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{stat.label}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
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
            <p className="mt-6 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent platform activity</h2>
            <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-pink-500/40 hover:text-white">
              Export
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((item) => (
              <div key={item.name + item.time} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.user} • {item.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{item.amount}</p>
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Campaign health</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-white">{campaign.name}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      campaign.status === "Live"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : campaign.status === "Review"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Budget</span>
                  <span>{campaign.budget}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-slate-400">
                  <span>Spend</span>
                  <span>{campaign.spend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
