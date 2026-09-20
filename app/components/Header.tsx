"use client";

import Link from "next/link";
import { 
  Bell, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCheck,
  ExternalLink
} from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  read?: boolean;
  time?: string;
  type?: "deposit" | "campaign" | "system" | "warning";
  link?: string;
}

export default function Header() {
  const [initials, setInitials] = useState("U");
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fetch real authenticated user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.email) {
            setUserEmail(data.user.email);
            setInitials(data.user.email.split("@")[0].slice(0, 2).toUpperCase());
          }
        }
      } catch {
        // Fallback to localStorage if offline
        const stored = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.email) {
              setUserEmail(parsed.email);
              setInitials(parsed.email.split("@")[0].slice(0, 2).toUpperCase());
            }
          } catch {}
        }
      }
    };
    fetchUser();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize notifications from localStorage or defaults
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("mock_notifications");
      if (raw) {
        setNotifications(JSON.parse(raw));
        return;
      }

      const initialNotifs: AppNotification[] = [
        { 
          id: "n1", 
          title: "Deposit Confirmed", 
          body: "$150.00 credited to your available wallet balance via Mobile Money.", 
          read: false, 
          time: "5m ago",
          type: "deposit",
          link: "/wallet"
        },
        { 
          id: "n2", 
          title: "Ad Delivery Live", 
          body: "Your campaign 'Spring Conversion Blitz' is actively delivering across Facebook & Instagram.", 
          read: false, 
          time: "1h ago",
          type: "campaign",
          link: "/campaigns"
        },
        { 
          id: "n3", 
          title: "CTR Optimization Applied", 
          body: "Automated audience bid adjustment increased click-through rate by +14%.", 
          read: true, 
          time: "1d ago",
          type: "system",
          link: "/dashboard"
        },
      ];
      localStorage.setItem("mock_notifications", JSON.stringify(initialNotifs));
      setNotifications(initialNotifs);
    } catch {
      // ignore
    }
  }, []);

  // Listen for custom notification update events
  useEffect(() => {
    const onUpdate = () => {
      try {
        const raw = localStorage.getItem("mock_notifications");
        if (raw) setNotifications(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener("mock_notifications:update", onUpdate);
    return () => window.removeEventListener("mock_notifications:update", onUpdate);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    try {
      localStorage.setItem("mock_notifications", JSON.stringify(next));
    } catch {}
  };

  const markAllRead = () => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(next);
    try {
      localStorage.setItem("mock_notifications", JSON.stringify(next));
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    try {
      localStorage.removeItem("mock_session");
      localStorage.removeItem("mock_user");
      localStorage.removeItem("mock_onboarding");
      localStorage.removeItem("mock_admin");
    } catch {}
    setMenuOpen(false);
    router.push("/login");
  };

  const getNotifIcon = (type?: string) => {
    switch (type) {
      case "deposit":
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case "campaign":
        return <CheckCircle2 className="w-4 h-4 text-pink-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <TikTokIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none tracking-tight">AdPlatform</span>
              <span className="text-[11px] text-slate-400 -mt-0.5 font-normal">Cross-network ad manager</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                aria-label="Notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  notifOpen
                    ? "bg-slate-800 text-white border-slate-600"
                    : "text-slate-300 hover:text-white bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-pink-500 text-white rounded-full ring-2 ring-slate-950 shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead} 
                          className="text-[11px] text-pink-400 hover:text-pink-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                      <button 
                        onClick={() => setNotifOpen(false)} 
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3.5 transition-colors ${
                            n.read ? "bg-slate-900/40 opacity-75" : "bg-slate-900/90 hover:bg-slate-850"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getNotifIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <h4 className={`text-xs font-semibold truncate ${n.read ? "text-slate-300" : "text-white"}`}>
                                  {n.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {n.time}
                                </span>
                              </div>
                              {n.body && (
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                  {n.body}
                                </p>
                              )}

                              <div className="mt-2 flex items-center gap-3 text-[11px]">
                                {!n.read && (
                                  <button 
                                    onClick={() => markRead(n.id)} 
                                    className="text-pink-400 hover:text-pink-300 font-medium cursor-pointer"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                {n.link && (
                                  <button 
                                    onClick={() => {
                                      setNotifOpen(false);
                                      router.push(n.link || "/dashboard");
                                    }} 
                                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>View details</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-expanded={menuOpen}
                className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5 hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {initials}
                </div>
                <div className="hidden sm:flex sm:flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                    {userEmail ? userEmail.split("@")[0] : "Account"}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">Business</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-800 text-xs">
                    <p className="text-slate-400 text-[10px]">Signed in as</p>
                    <p className="text-white font-medium truncate">{userEmail || "user@adplatform.com"}</p>
                  </div>
                  <Link 
                    href="/settings/profile" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    Edit Profile Credentials
                  </Link>
                  <Link 
                    href="/settings/appearance" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    Appearance & Themes
                  </Link>
                  <Link 
                    href="/settings" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    All Settings
                  </Link>

                  <div className="border-t border-slate-800 my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
