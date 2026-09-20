"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "../components/AuthGuard";
import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CreditCard,
  Megaphone,
  ShieldCheck,
  Ticket,
  Users,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/deposits", label: "Deposits", icon: CreditCard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/review-queue", label: "Review queue", icon: BellRing },
  { href: "/admin/pricing", label: "Pricing", icon: ShieldCheck },
  { href: "/admin/support", label: "Support", icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Never apply AuthGuard to the admin login page itself!
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard guard="ADMIN">
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 shadow-sm shadow-pink-500/25">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300 font-semibold">Admin Panel</p>
              <h2 className="text-sm font-bold text-white leading-none">AdPlatform</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>App</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle admin navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="fixed inset-y-0 right-0 w-72 max-w-[80vw] bg-slate-900 border-l border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-pink-400" />
                    <span className="font-bold text-white text-sm">Admin Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-colors ${
                          active
                            ? "border-pink-500/40 bg-pink-500/10 text-white font-semibold"
                            : "border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-pink-500/40 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-pink-400" />
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs text-center block transition-colors border border-slate-700"
                >
                  Return to User Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Fixed Sidebar */}
        <aside className="hidden md:block fixed left-0 top-0 h-screen w-72 border-r border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl z-30">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink-300 font-semibold">Admin</p>
                <h1 className="text-xl font-bold">AdPlatform</h1>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 transition-colors"
              title="Return to user dashboard"
            >
              Exit
            </Link>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs transition-colors ${
                    active
                      ? "border-pink-500/40 bg-pink-500/10 text-white font-semibold shadow-sm"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-pink-500/40 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-pink-400" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-orange-500/10 p-3.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300 font-semibold">Revenue Model</p>
            <p className="mt-1 text-xs text-slate-300 leading-snug">5% fee automated on campaign activation.</p>
          </div>
        </aside>

        {/* Main Admin Content Container */}
        <main className="md:ml-72 min-h-screen p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
