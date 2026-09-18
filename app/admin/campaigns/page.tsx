"use client";

import { useMemo, useState, useEffect } from "react";

type AdminCampaign = { name: string; brand?: string; status: string; spend: number; fee: number; platform?: string };

export default function AdminCampaignsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/campaigns')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const list = (data?.campaigns || []).map((c: any) => ({
          name: c.name,
          brand: c.owner || 'Unknown',
          status: c.status || 'Pending',
          spend: c.budget || 0,
          fee: Math.round((c.budget || 0) * 0.05),
          platform: (c.platforms || []).join(', '),
        }));
        setCampaigns(list);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = `${campaign.name} ${campaign.brand}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Operations</p>
          <h1 className="text-4xl font-bold text-white">Campaigns</h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search campaign or brand"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
          >
            <option value="all">All statuses</option>
            <option value="Live">Live</option>
            <option value="Pending">Pending</option>
            <option value="Paused">Paused</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Spend</th>
              <th className="px-4 py-3">5% fee</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.name} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4 font-medium">{campaign.name}</td>
                <td className="px-4 py-4 text-slate-300">{campaign.brand}</td>
                <td className="px-4 py-4">{campaign.platform}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      campaign.status === "Live"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : campaign.status === "Pending"
                          ? "bg-yellow-500/15 text-yellow-300"
                          : "bg-slate-500/15 text-slate-300"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-4">${campaign.spend.toLocaleString()}</td>
                <td className="px-4 py-4 text-pink-300">${campaign.fee.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
