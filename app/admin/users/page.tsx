"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  UserCheck,
  Eye,
  AlertCircle,
  Mail,
  Send,
  Megaphone,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface AdminUser {
  _id: string;
  email: string;
  businessName?: string;
  industry?: string;
  phone?: string;
  website?: string;
  role: "user" | "admin";
  planId?: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  phoneVerified?: boolean;
  campaignsCount: number;
  totalSpend: number;
  walletBalance: number;
  createdAt: string;
}

interface UserCampaign {
  _id: string;
  name: string;
  objective: string;
  platforms: string[];
  status: string;
  dailyBudget: number;
  days: number;
  totalAdSpend: number;
  startDate?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Selected User Modal state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userCampaigns, setUserCampaigns] = useState<UserCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        showToast("Failed to fetch users", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error loading users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenUserModal = async (user: AdminUser) => {
    setSelectedUser(user);
    setUserCampaigns([]);
    setMessageText("");
    try {
      setLoadingCampaigns(true);
      const res = await fetch(`/api/admin/users?userId=${user._id}`, {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        setUserCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !messageText.trim()) return;

    try {
      setSendingMessage(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          message: messageText.trim(),
          subject: "Important Notice regarding your AdPlatform Account",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Message sent to user's live chat desk!");
        setMessageText("");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to send message", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error sending message", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleToggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
        );
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, role: newRole as any } : null));
        }
        showToast(`Role updated to ${newRole}`);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to toggle role", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchTarget = `${user.email} ${user.businessName || ""} ${user.phone || ""}`.toLowerCase();
      const matchesSearch = searchTarget.includes(query.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, query, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">User Directory</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
              {users.length} accounts
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Accounts & Operations</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email, business name..."
              className="w-56 sm:w-64 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Business Users</option>
            <option value="admin">Administrators</option>
          </select>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Refresh user list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5">User / Business</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Campaigns</th>
                <th className="px-4 py-3.5">Total Spend</th>
                <th className="px-4 py-3.5">Wallet Balance</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                      <span>Loading accounts from MongoDB Atlas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActing = actionLoadingId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="text-slate-200 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name / Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500/20 to-orange-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300 text-xs flex-shrink-0">
                            {(user.businessName || user.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate max-w-[180px]">
                              {user.businessName || "Unnamed Business"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Account</span>
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            user.role === "admin"
                              ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {user.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>

                      {/* Campaigns */}
                      <td className="px-4 py-3.5 text-white font-medium">
                        {user.campaignsCount}
                      </td>

                      {/* Spend */}
                      <td className="px-4 py-3.5 text-white font-medium">
                        ${user.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3.5 text-emerald-400 font-semibold font-mono">
                        ${user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Manage / Inspect Account */}
                          <button
                            onClick={() => handleOpenUserModal(user)}
                            className="px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Inspect campaigns & contact user"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Manage</span>
                          </button>

                          {/* Role Toggle */}
                          <button
                            disabled={isActing}
                            onClick={() => handleToggleAdminRole(user._id, user.role)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                          >
                            {user.role === "admin" ? "Demote" : "Admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Account Management & Campaign Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center font-bold text-white text-base">
                  {(selectedUser.businessName || selectedUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {selectedUser.businessName || "Business Account"}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Direct Email link */}
                <a
                  href={`mailto:${selectedUser.email}?subject=Message%20from%20AdPlatform%20Support&body=Hello%20${encodeURIComponent(selectedUser.businessName || "there")},%0A%0A`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
                  title="Send email via your email client"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>Email User</span>
                </a>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Lifetime Spend</p>
                <p className="text-base font-bold text-white mt-1">
                  ${selectedUser.totalSpend.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Available Balance</p>
                <p className="text-base font-bold text-emerald-400 mt-1">
                  ${selectedUser.walletBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400">Total Campaigns</p>
                <p className="text-base font-bold text-pink-400 mt-1">
                  {selectedUser.campaignsCount}
                </p>
              </div>
            </div>

            {/* User's Campaign Portfolio */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Campaigns by this Advertiser</span>
                </h4>
                <span className="text-[11px] text-slate-400">{userCampaigns.length} campaigns found</span>
              </div>

              {loadingCampaigns ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-pink-400 mx-auto mb-1" />
                  <span>Loading user campaigns...</span>
                </div>
              ) : userCampaigns.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  This user has not launched any campaigns yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {userCampaigns.map((c) => (
                    <div
                      key={c._id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="font-semibold text-white truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {c.days} days • ${(c.dailyBudget || 0).toFixed(2)}/day • Budget: ${(c.totalAdSpend || c.dailyBudget * c.days).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex gap-1">
                          {(c.platforms || []).map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 capitalize"
                            >
                              {p}
                            </span>
                          ))}
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            c.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : c.status === "paused"
                                ? "bg-amber-500/20 text-amber-300"
                                : c.status === "completed"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct In-App Message to User */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-pink-400" />
                  <span>Send Direct In-App Message to User</span>
                </h4>
                <span className="text-[11px] text-emerald-400 font-medium">Delivers to user live chat</span>
              </div>

              <textarea
                rows={3}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Write an administrative message or campaign status update to ${selectedUser.businessName || selectedUser.email}...`}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-pink-500 text-xs resize-none"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={sendingMessage || !messageText.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Message & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
