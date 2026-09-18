"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Wallet, Megaphone, FileText, Settings, LogOut, Flame } from "lucide-react";
import { getWalletBalance } from "@/lib/wallet";

export default function DesktopPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("mock_session");
    localStorage.removeItem("mock_user");
    localStorage.removeItem("mock_onboarding");
    localStorage.removeItem("mock_admin");
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/billing", label: "Billing", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; name?: string };
        setUserName(parsed.name || parsed.email || "Account");
      }
    } catch (e) {
      setUserName(null);
    }

    try {
      const b = getWalletBalance();
      setBalance(b);
    } catch (e) {
      setBalance(0);
    }

    fetch("/api/wallet/balance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.availableBalance === "number") {
          setBalance(data.availableBalance);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-72 md:z-50 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6">
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <Link href="/dashboard" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Account</p>
              <h2 className="text-lg font-bold">AdPlatform</h2>
            </div>
          </Link>

          <div className="mt-4 rounded-lg bg-gradient-to-br from-white/3 to-white/2 p-3 border border-white/6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300">Signed in as</p>
                <p className="truncate text-sm font-medium text-white">{userName ?? "Account"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-300">Wallet</p>
                <p className="text-sm font-semibold text-white">${balance.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href="/wallet" className="flex-1 rounded-md bg-pink-600/10 px-3 py-2 text-sm text-pink-300 text-center hover:bg-pink-600/15">Wallet</Link>
              <Link href="/campaigns/new" className="rounded-md bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-2 text-sm text-white">New</Link>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-600/10 to-orange-500/8 shadow-[0_8px_24px_rgba(236,72,153,0.06)]'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive ? 'bg-pink-600/20 text-pink-400' : 'bg-slate-800 text-slate-300 group-hover:bg-pink-500/10 group-hover:text-pink-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                      {/* subtle affordance */}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/40 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-orange-500/10 transition-all"
          >
            <LogOut className="h-4 w-4 text-slate-300" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
