"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-transparent/10">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm">
              <span className="text-sm font-semibold text-white">AP</span>
            </div>
            <div className="text-sm text-[var(--text)]">AdPlatform</div>
            <div className="ml-3 hidden text-xs text-[var(--subtle)] sm:block">Ads + Mobile Money</div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/pricing" className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent hover:opacity-90">Pricing</Link>
            <span className="text-[var(--subtle)]">•</span>
            <Link href="/about" className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent hover:opacity-90">About</Link>
            <span className="text-[var(--subtle)]">•</span>
            <Link href="/contact" className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent hover:opacity-90">Support</Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--subtle)]">
            <Link href="/terms" className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent hover:opacity-90">Terms</Link>
            <Link href="/privacy" className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent hover:opacity-90">Privacy</Link>
            <div className="hidden sm:block">© 2024 AdPlatform</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
