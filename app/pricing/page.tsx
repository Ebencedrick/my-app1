import Link from "next/link";
import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";
import {
  ArrowRight,
  Flame,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <LandingHeader />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20 pt-28">
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            100% Free Platform Access
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            No subscription fees. Deposit and run your ads freely.
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create an account with zero commitments. No international credit card required. Deposit your ad budget via Mobile Money or crypto, and we handle campaign delivery on Facebook, Instagram, and TikTok.
          </p>
        </section>

        <section className="mb-16 rounded-3xl border border-slate-700 bg-slate-900/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-pink-300 mb-2">How it works</p>
              <h3 className="text-3xl font-bold">Built for simple execution, not subscription lock-ins.</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
              <div className="w-11 h-11 rounded-xl bg-pink-500/15 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-pink-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Fund your wallet</h4>
              <p className="text-sm text-slate-300">Deposit only what you want to spend on ads via MTN MoMo, Orange, or crypto.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Build your ad</h4>
              <p className="text-sm text-slate-300">Upload your image or video, set your daily budget, and choose target audience.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
              <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Launch</h4>
              <p className="text-sm text-slate-300">The user sees the exact campaign cost and proceeds to go live.</p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-orange-400 transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
