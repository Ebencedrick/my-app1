"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Flame, Menu, X } from "lucide-react";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // do not automatically close the menu on small scrolls; only update scrolled state
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      // focus the first link in the mobile menu reliably
      setTimeout(() => {
        const first = document.querySelector('#mobile-menu a') as HTMLElement | null;
        first?.focus();
      }, 50);
    }
  }, [isMenuOpen]);

  return (
    <nav role="navigation" aria-label="Main" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-sm bg-slate-900/70 border-b border-slate-800/30 shadow-sm' : 'bg-transparent'} `}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white leading-tight">AdPlatform</div>
                <div className="text-xs text-amber-200 -mt-0.5">Ads + Mobile Money</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6 ml-6">
              <Link href="#features" className="text-sm text-amber-200 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-amber-200 hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm text-amber-200 hover:text-white transition-colors">Company</Link>
              <Link href="/contact" className="text-sm text-amber-200 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm text-amber-100 hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-300 hover:to-amber-400 transition-all shadow-md">Get Started</Link>
            </div>

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 bg-slate-800/40 rounded-md text-white relative z-[9999]"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((s) => !s);
              }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute left-0 right-0 top-full mt-0 z-60 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/30">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-3">
                <Link href="#features" ref={firstLinkRef} className="block text-sm text-amber-200 hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="block text-sm text-amber-200 hover:text-white transition-colors">Pricing</Link>
                <Link href="/about" className="block text-sm text-amber-200 hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="block text-sm text-amber-200 hover:text-white transition-colors">Contact</Link>
                <div className="pt-2">
                  <Link href="/signup" className="block w-full text-center px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg">Get Started</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
