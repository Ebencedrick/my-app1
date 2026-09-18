"use client";

import Link from "next/link";
import { Bell, ChevronDown, X } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [initials, setInitials] = useState("U");
  const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Array<{id:string;title:string;body?:string;read?:boolean;time?:string;}>>([]);
    const notifRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setInitials(parsed.email.split("@")[0].slice(0,2).toUpperCase());
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!notifRef.current) return;
      if (notifRef.current.contains(e.target as Node)) return;
      setNotifOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    try {
      localStorage.removeItem("mock_session");
      localStorage.removeItem("mock_user");
      localStorage.removeItem("mock_onboarding");
      localStorage.removeItem("mock_admin");
    } catch (e) {
      // ignore
    }
    setMenuOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("mock_notifications");
      if (raw) {
        setNotifications(JSON.parse(raw));
        return;
      }

      const sample = [
        { id: "n1", title: "Campaign ready", body: "Your campaign 'Spring Sale' is live.", read: false, time: "2m" },
        { id: "n2", title: "Low balance", body: "Your wallet balance is below $5.", read: false, time: "1h" },
        { id: "n3", title: "Payment received", body: "We received your deposit of $50.", read: true, time: "1d" },
      ];
      localStorage.setItem("mock_notifications", JSON.stringify(sample));
      setNotifications(sample);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onUpdate = () => {
      try {
        const raw = localStorage.getItem("mock_notifications");
        setNotifications(raw ? JSON.parse(raw) : []);
      } catch (e) {}
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
    } catch (e) {
      // ignore
    }
  };

  const markAllRead = () => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(next);
    try {
      localStorage.setItem("mock_notifications", JSON.stringify(next));
    } catch (e) {}
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-slate-950/30 via-purple-900/10 to-pink-900/10 backdrop-blur-sm border-b border-slate-800/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 shadow-md">
              <TikTokIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-none">AdPlatform</span>
              <span className="text-[11px] text-slate-400 -mt-0.5">Run ads seamlessly</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button
                aria-label="notifications"
                onClick={() => setNotifOpen((s) => !s)}
                className="relative text-slate-300 hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded-full ring-2 ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                  <div ref={notifRef} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                      <span className="text-sm text-slate-200">Notifications</span>
                      <div className="flex items-center gap-2">
                        <button onClick={markAllRead} className="text-xs text-slate-400 hover:text-white">Mark all</button>
                        <button onClick={() => setNotifOpen(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.length === 0 && <div className="p-3 text-sm text-slate-400">No notifications</div>}
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 ${n.read ? "opacity-70" : ""}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm text-slate-200 font-medium">{n.title}</div>
                              {n.body && <div className="text-xs text-slate-400">{n.body}</div>}
                            </div>
                            <div className="text-xs text-slate-400 ml-3">{n.time}</div>
                          </div>
                          {!n.read && (
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => markRead(n.id)} className="text-xs text-pink-400 hover:text-pink-300">Mark read</button>
                              <button onClick={() => { setNotifOpen(false); router.push('/dashboard'); }} className="text-xs text-slate-400 hover:text-white">View</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-expanded={menuOpen}
                className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1 hover:bg-slate-900/80"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">{initials}</div>
                <div className="hidden sm:flex sm:flex-col">
                  <span className="text-sm text-white">Account</span>
                  <span className="text-xs text-slate-400">Business</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-lg py-1 z-50">
                  <Link href="/settings/profile" className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Profile</Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-800">Logout</button>
                </div>
              )}
            </div>

            {/* mobile menu removed — dashboard uses AppNav for navigation */}
          </div>
        </div>
      </div>
    </header>
  );
}
