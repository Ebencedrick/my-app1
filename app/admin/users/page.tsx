"use client";

import { useMemo, useState } from "react";

const users = [
  { name: "Amina Kofi", email: "amina@brandlabs.af", status: "Verified", campaigns: 8, spend: 4200 },
  { name: "Daniel Mensah", email: "daniel@westretail.io", status: "Pending", campaigns: 3, spend: 1850 },
  { name: "Nadia Wambui", email: "nadia@glowstudio.ke", status: "Verified", campaigns: 12, spend: 7600 },
  { name: "Kehinde Bello", email: "kehinde@copperlane.ng", status: "Suspended", campaigns: 1, spend: 420 },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Team</p>
          <h1 className="text-4xl font-bold text-white">Users</h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search user or email"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
          >
            <option value="all">All statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Campaigns</th>
              <th className="px-4 py-3">Spend</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.email} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4 font-medium">{user.name}</td>
                <td className="px-4 py-4 text-slate-300">{user.email}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.status === "Verified"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : user.status === "Pending"
                          ? "bg-yellow-500/15 text-yellow-300"
                          : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4">{user.campaigns}</td>
                <td className="px-4 py-4">${user.spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
