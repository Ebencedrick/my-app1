"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Wallet, Megaphone, FileText, Settings, LogOut, Flame, Eye, EyeOff, X, Loader2, Check, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { getWalletBalance } from "@/lib/wallet";

export default function DesktopPanel() {
  const pathname = usePathname();
  const router = useRouter();
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

  const [isAccountHidden, setIsAccountHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hide_account_balance") === "true";
    }
    return false;
  });
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [topUpPhone, setTopUpPhone] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const toggleHideAccount = () => {
    setIsAccountHidden((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("hide_account_balance", next ? "true" : "false");
      }
      return next;
    });
  };

  const handleQuickDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount <= 0) return;
    setIsDepositing(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: topUpAmount,
          gateway: "momo",
          phone: topUpPhone || "+237 600 000 000",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.balance !== undefined) {
          setBalance(data.balance);
        } else {
          setBalance((prev) => prev + Number(topUpAmount));
        }
        setDepositSuccess(true);
        setTimeout(() => {
          setDepositSuccess(false);
          setShowTopUpModal(false);
        }, 1500);
      } else {
        router.push("/wallet");
        setShowTopUpModal(false);
      }
    } catch {
      router.push("/wallet");
      setShowTopUpModal(false);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <aside className="hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-72 md:z-50 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5">
      <div className="flex h-full flex-col">
        <div className="mb-3">
          <Link href="/dashboard" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400">
            <BrandLogo compact />
          </Link>

          {/* Compact Wallet & Actions Card - Email Removed */}
          <div className="mt-3 rounded-xl bg-slate-800/40 p-2.5 border border-slate-700/50 shadow-sm backdrop-blur-sm">
            {/* Balance Header with Hide Account Button */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-pink-400" />
                Account Balance
              </span>
              <button
                type="button"
                onClick={toggleHideAccount}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
                title={isAccountHidden ? "Show account balance" : "Hide account balance"}
                aria-label={isAccountHidden ? "Show account balance" : "Hide account balance"}
              >
                {isAccountHidden ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            {/* Displayed Balance */}
            <div className="mb-2">
              <span className="text-base font-bold text-emerald-400 font-mono tracking-tight">
                {isAccountHidden ? "••••••" : `$${balance.toFixed(2)}`}
              </span>
            </div>

            {/* Functional Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="py-1 px-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-xs font-medium text-slate-200 text-center transition-colors border border-slate-600/40 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Top up</span>
              </button>
              <Link
                href="/campaigns/new"
                className="py-1 px-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-xs font-semibold text-white shadow-sm shadow-pink-500/20 text-center transition-all flex items-center justify-center gap-0.5"
              >
                <span>+ Campaign</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Top-Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Up Wallet</h3>
                    <p className="text-[11px] text-slate-400">Instant Mobile Money deposit</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {depositSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">Deposit Successful!</p>
                  <p className="text-xs text-slate-400">${topUpAmount}.00 added to your account</p>
                </div>
              ) : (
                <form onSubmit={handleQuickDeposit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Amount (USD)</label>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {[25, 50, 100, 250].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTopUpAmount(amt)}
                          className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            topUpAmount === amt
                              ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                              : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={5}
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-pink-500 focus:outline-none"
                      placeholder="Custom amount"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">MoMo Phone Number</label>
                    <input
                      type="tel"
                      value={topUpPhone}
                      onChange={(e) => setTopUpPhone(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isDepositing}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isDepositing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Confirm $${topUpAmount}`
                      )}
                    </button>
                    <Link
                      href="/wallet"
                      onClick={() => setShowTopUpModal(false)}
                      className="py-2 px-3 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
                    >
                      All Options
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

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

        <div className="border-t border-slate-800 p-3 space-y-1.5">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 justify-center rounded-lg px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/40 hover:bg-slate-800 transition-all border border-slate-700/50 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
