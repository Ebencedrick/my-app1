"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Ticket,
  Search,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Send,
  Loader2,
  Check,
  ShieldCheck,
  User,
  Mail,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface TicketReply {
  senderRole: "admin" | "user";
  senderName: string;
  message: string;
  createdAt: string;
}

interface SupportTicketItem {
  _id: string;
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  unreadByAdmin?: boolean;
  unreadByUser?: boolean;
  replies: TicketReply[];
  createdAt: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/support", {
        headers: { "x-mock-admin": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        const list: SupportTicketItem[] = data.tickets || [];
        setTickets(list);
        if (list.length > 0 && !selectedTicket) {
          setSelectedTicket(list[0]);
        }
      } else {
        showToast("Failed to fetch support tickets", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error loading tickets", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedTicket]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });

      if (res.ok) {
        showToast(`Ticket status updated to ${newStatus}`);
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus as any } : t))
        );
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        showToast("Failed to update status", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error updating ticket", "error");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    try {
      setSendingReply(true);
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-admin": "true",
        },
        body: JSON.stringify({
          ticketId: selectedTicket._id,
          message: replyText.trim(),
          senderName: "Operations Support Desk",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast("Reply sent! User has been notified in their dashboard.");
        setReplyText("");
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          setTickets((prev) =>
            prev.map((t) => (t._id === data.ticket._id ? data.ticket : t))
          );
        }
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to post reply", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error submitting reply", "error");
    } finally {
      setSendingReply(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const target = `${t.userName || ""} ${t.userEmail} ${t.subject}`.toLowerCase();
      const matchesSearch = target.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, query, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Communications</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
              {tickets.filter((t) => t.status === "open").length} open threads
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">Live Support & Inquiries</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search user or subject..."
              className="w-48 sm:w-60 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={loadTickets}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Modern Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">
        {/* Left Column: Ticket Conversations List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 space-y-2 max-h-[740px] overflow-y-auto backdrop-blur-sm">
          {loading && tickets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-pink-400 mx-auto mb-2" />
              <span>Loading customer conversations...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No conversations found.
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isSelected = selectedTicket?._id === t._id;
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 border-pink-500/50 shadow-md shadow-pink-500/10"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-xs truncate">
                        {t.userName || t.userEmail}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{t.userEmail}</p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase flex-shrink-0 ${
                        t.status === "open"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : t.status === "in_progress"
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="font-medium text-slate-200 text-xs mt-2 line-clamp-1">
                    {t.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {t.replies && t.replies.length > 0
                      ? t.replies[t.replies.length - 1].message
                      : t.message}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    <span>{(t.replies?.length || 0) + 1} messages</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Conversation Stream & Dual-Reply Composer */}
        {selectedTicket ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden min-h-[740px]">
            {/* Conversation Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {(selectedTicket.userName || selectedTicket.userEmail)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {selectedTicket.userName || "Customer"}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{selectedTicket.userEmail}</span>
                    <span>•</span>
                    <span className="text-pink-400 font-medium">{selectedTicket.subject}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Option to Reply directly via Email */}
                <a
                  href={`mailto:${selectedTicket.userEmail}?subject=Re:%20${encodeURIComponent(selectedTicket.subject)}&body=Hello%20${encodeURIComponent(selectedTicket.userName || "there")},%0A%0AIn%20reference%20to%20your%20inquiry:%20%22${encodeURIComponent(selectedTicket.message.slice(0, 100))}%22%0A%0A`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  title="Compose reply in your default email client"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>Reply via Email</span>
                </a>

                {/* Status Selector */}
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium outline-none focus:border-pink-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-950/40 text-xs">
              {/* Original User Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 text-slate-200 max-w-[85%] leading-relaxed shadow-sm">
                  <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400 mb-1.5 font-medium">
                    <span className="text-white font-semibold">
                      {selectedTicket.userName || selectedTicket.userEmail}
                    </span>
                    <span className="font-mono">
                      {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Message Thread */}
              {(selectedTicket.replies || []).map((reply, idx) => {
                const isAdmin = reply.senderRole === "admin";

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isAdmin ? "justify-end" : ""}`}
                  >
                    {!isAdmin && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl leading-relaxed max-w-[85%] shadow-sm ${
                        isAdmin
                          ? "rounded-tr-sm bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40 text-slate-100"
                          : "rounded-tl-sm bg-slate-900 border border-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[11px] mb-1.5">
                        <span className={`font-semibold ${isAdmin ? "text-pink-300" : "text-white"}`}>
                          {reply.senderName}
                        </span>
                        <span className="font-mono text-slate-400">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">{reply.message}</p>
                    </div>

                    {isAdmin && (
                      <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center flex-shrink-0 text-pink-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* In-System Reply Composer */}
            <form onSubmit={handleSendReply} className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write an official support response to ${selectedTicket.userName || selectedTicket.userEmail}...`}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-pink-500 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTicket._id, "resolved")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Email Action */}
                  <a
                    href={`mailto:${selectedTicket.userEmail}?subject=Re:%20${encodeURIComponent(selectedTicket.subject)}&body=${encodeURIComponent(replyText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                    title="Send via personal email app"
                  >
                    <Mail className="w-3.5 h-3.5 text-pink-400" />
                    <span>Send as Email</span>
                  </a>

                  {/* System Reply button */}
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-pink-500/20"
                  >
                    {sendingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Reply in System (Notifies User)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-xs min-h-[500px] flex flex-col items-center justify-center">
            <MessageSquare className="w-8 h-8 text-pink-400 mb-2 opacity-60" />
            <p className="font-semibold text-white">Select a conversation</p>
            <p className="text-slate-400 mt-1">Choose a ticket from the left panel to reply in-system or via email.</p>
          </div>
        )}
      </div>
    </div>
  );
}
