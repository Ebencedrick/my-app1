"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  ShieldCheck,
  User,
  Sparkles,
  CheckCircle2,
  Bell,
} from "lucide-react";

interface TicketReply {
  senderRole: "admin" | "user";
  senderName: string;
  message: string;
  createdAt: string;
}

interface UserTicket {
  _id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  unreadByUser: boolean;
  replies: TicketReply[];
  createdAt: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSupportData = useCallback(async () => {
    try {
      let email = "";
      try {
        email = localStorage.getItem("mock_session") || "";
      } catch {}

      const url = email ? `/api/support?email=${encodeURIComponent(email)}` : "/api/support";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const currentTicket: UserTicket | null = data.ticket;

        // Check if admin sent a new message that user hasn't seen
        if (currentTicket && data.unreadByUser && !hasUnread) {
          setHasUnread(true);
          setToastNotification("New message from Support Team!");
          setTimeout(() => setToastNotification(null), 6000);
        }

        setTicket(currentTicket);
      }
    } catch {
      // offline or network hiccup, fallback quietly
    }
  }, [hasUnread]);

  // Initial load and recurring background poll (every 10 seconds)
  useEffect(() => {
    loadSupportData();
    const interval = setInterval(loadSupportData, 10000);
    return () => clearInterval(interval);
  }, [loadSupportData]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (hasUnread) {
        setHasUnread(false);
        // Clear unread flag on server
        fetch("/api/support", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: ticket?._id }),
        }).catch(() => {});
      }
    }
  }, [isOpen, hasUnread, ticket?._id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setSending(true);
      let email = "";
      try {
        email = localStorage.getItem("mock_session") || "";
      } catch {}

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText.trim(),
          email,
          subject: "Live Dashboard Chat",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
        setInputText("");
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Toast Notification Alert when closed */}
      {toastNotification && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="mb-3 flex items-center gap-2.5 px-4 py-3 bg-slate-900/95 border border-pink-500/50 rounded-2xl shadow-2xl text-xs text-white cursor-pointer animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="font-semibold text-pink-300">Support Desk:</span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold text-xs shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open Live Chat Support"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Live Support</span>

          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 text-[10px] items-center justify-center font-bold text-white">
                !
              </span>
            </span>
          )}
        </button>
      )}

      {/* Live Chat Modal Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-80px)] rounded-3xl border border-slate-700 bg-slate-900/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">AdPlatform Live Desk</h3>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>Support Team</span> • <span>Online</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40 text-xs">
            {/* Automated Welcome */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700/60 text-slate-200 max-w-[82%] leading-relaxed">
                <p className="font-medium text-pink-300 text-[11px] mb-0.5">AdPlatform Specialist</p>
                Hello! Need help with funding your wallet, creating campaigns, or tracking ad performance? Send us a message and an admin will respond right away.
              </div>
            </div>

            {/* Conversation History */}
            {ticket && (
              <>
                {/* Initial user question */}
                <div className="flex justify-end">
                  <div className="p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-pink-600 to-orange-600 text-white max-w-[82%] leading-relaxed shadow-sm">
                    {ticket.message}
                    <p className="text-[9px] text-pink-200/80 text-right mt-1 font-mono">
                      {new Date(ticket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {/* Replies */}
                {(ticket.replies || []).map((r, i) => {
                  const isAdmin = r.senderRole === "admin";
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 ${isAdmin ? "" : "justify-end"}`}
                    >
                      {isAdmin && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl leading-relaxed max-w-[82%] ${
                          isAdmin
                            ? "rounded-tl-sm bg-slate-800 border border-slate-700 text-slate-100"
                            : "rounded-tr-sm bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-sm"
                        }`}
                      >
                        {isAdmin && (
                          <p className="font-semibold text-emerald-400 text-[10px] mb-0.5">
                            {r.senderName || "Support Desk"}
                          </p>
                        )}
                        <p className="whitespace-pre-line">{r.message}</p>
                        <p
                          className={`text-[9px] text-right mt-1 font-mono ${
                            isAdmin ? "text-slate-400" : "text-pink-200/80"
                          }`}
                        >
                          {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about ads or deposits..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-pink-500 text-xs"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold disabled:opacity-40 hover:from-pink-600 hover:to-orange-600 transition-all flex items-center justify-center cursor-pointer"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
