"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Wallet,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  Flame,
} from "lucide-react";
import DesktopPanel from "./DesktopPanel";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <>
      <DesktopPanel />

      {/* Mobile bottom nav with safe-area support */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
        <div className="max-w-md mx-auto px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl flex justify-between items-center px-2 py-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex-1 focus:outline-none">
                  <div
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                      isActive
                        ? "text-pink-400 bg-pink-500/10 font-semibold"
                        : "text-slate-400 hover:text-slate-200 active:scale-95"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5 block truncate text-center leading-none">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

