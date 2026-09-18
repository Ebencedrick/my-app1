"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold">AP</span>
            </div>
            <div className="text-sm text-slate-300">AdPlatform</div>
            <div className="hidden sm:block text-xs text-slate-500 ml-3">Ads + Mobile Money</div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/pricing" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 hover:opacity-90">Pricing</Link>
            <span className="text-slate-700">•</span>
            <Link href="/about" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 hover:opacity-90">About</Link>
            <span className="text-slate-700">•</span>
            <Link href="/contact" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 hover:opacity-90">Support</Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/terms" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 hover:opacity-90">Terms</Link>
            <Link href="/privacy" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 hover:opacity-90">Privacy</Link>
            <div className="hidden sm:block text-slate-500">© 2024 AdPlatform</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
