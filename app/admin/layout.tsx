"use client";

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
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/deposits", label: "Deposits", icon: CreditCard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/ad-accounts", label: "Ad accounts", icon: BriefcaseBusiness },
  { href: "/admin/review-queue", label: "Review queue", icon: BellRing },
  { href: "/admin/pricing", label: "Pricing", icon: ShieldCheck },
  { href: "/admin/support", label: "Support", icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard guard="ADMIN">
      <div className="min-h-screen bg-slate-950 text-white">
        <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Admin</p>
              <h1 className="text-xl font-bold">AdPlatform</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    active
                      ? "border-pink-500/40 bg-pink-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-pink-500/40 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-pink-400" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-orange-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Platform</p>
            <p className="mt-2 text-sm text-slate-300">Free access model with a 5% fee on campaign spend.</p>
          </div>
        </aside>

        <main className="ml-72 min-h-screen p-6 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
