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
    <div className="theme-shell min-h-screen text-[var(--text)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <LandingHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-28">
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-medium text-pink-300">
            <Sparkles className="h-4 w-4" />
            100% free platform access
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            No subscription fees. Deposit and run your ads freely.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Create an account with zero commitments. No international credit card required. Deposit your ad budget via Mobile Money or crypto, and we handle campaign delivery on Facebook, Instagram, and TikTok.
          </p>
        </section>

        <section className="theme-panel mb-16 rounded-3xl p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.18em] text-pink-300">How it works</p>
              <h3 className="text-3xl font-bold text-[var(--text)]">Built for simple execution, not subscription lock-ins.</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="theme-card rounded-2xl p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/15">
                <Zap className="h-5 w-5 text-pink-400" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-[var(--text)]">1. Fund your wallet</h4>
              <p className="text-sm leading-relaxed text-[var(--muted)]">Deposit only what you want to spend on ads via MTN MoMo, Orange, or crypto.</p>
            </div>

            <div className="theme-card rounded-2xl p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-[var(--text)]">2. Build your ad</h4>
              <p className="text-sm leading-relaxed text-[var(--muted)]">Upload your image or video, set your daily budget, and choose target audience.</p>
            </div>

            <div className="theme-card rounded-2xl p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15">
                <ShieldCheck className="h-5 w-5 text-orange-400" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-[var(--text)]">Launch</h4>
              <p className="text-sm leading-relaxed text-[var(--muted)]">The user sees the exact campaign cost and proceeds to go live.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl text-center">
          <Link
            href="/signup"
            className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:brightness-110"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
