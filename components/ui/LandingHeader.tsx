"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const savedMode = localStorage.getItem("adflux-landing-theme");
    const nextMode = savedMode ? savedMode === "dark" : true;
    setIsDarkMode(nextMode);
    document.documentElement.setAttribute("data-theme", nextMode ? "dark" : "light");

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    document.documentElement.setAttribute("data-theme", nextMode ? "dark" : "light");
    localStorage.setItem("adflux-landing-theme", nextMode ? "dark" : "light");
  };

  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      setTimeout(() => {
        const first = document.querySelector('#mobile-menu a') as HTMLElement | null;
        first?.focus();
      }, 50);
    }
  }, [isMenuOpen]);

  const navClasses = isDarkMode
    ? "backdrop-blur-xl bg-slate-950/60 border-slate-800/40 text-white"
    : "backdrop-blur-xl bg-white/80 border-slate-200/80 text-slate-900 shadow-sm";

  const linkClasses = isDarkMode ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-slate-950";
  const buttonClasses = isDarkMode
    ? "bg-slate-900/80 text-slate-100 border border-slate-700/70 hover:border-slate-500"
    : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300";

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navClasses} ${scrolled ? "shadow-[0_12px_25px_rgba(15,23,42,0.08)]" : "shadow-none"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-40 sm:h-12 sm:w-52 lg:h-14 lg:w-64">
                <Image
                  src="/adflux-logo.png"
                  alt="AdFlux logo"
                  fill
                  priority
                  className="object-contain object-left select-none"
                  unoptimized
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6 ml-4">
              <Link href="#features" className={`text-sm font-medium transition-colors ${linkClasses}`}>Features</Link>
              <Link href="/pricing" className={`text-sm font-medium transition-colors ${linkClasses}`}>Pricing</Link>
              <Link href="/about" className={`text-sm font-medium transition-colors ${linkClasses}`}>Company</Link>
              <Link href="/contact" className={`text-sm font-medium transition-colors ${linkClasses}`}>Contact</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={toggleTheme}
              className={`hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${buttonClasses}`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${linkClasses}`}>
                Sign in
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:brightness-110">
                Get Started
              </Link>
            </div>

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-md border border-slate-700/60 bg-slate-900/60 text-white relative z-[9999]"
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
          <div id="mobile-menu" className="md:hidden absolute left-0 right-0 top-full z-60 border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-3">
                <Link href="#features" ref={firstLinkRef} className="block text-sm text-slate-200 hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="block text-sm text-slate-200 hover:text-white transition-colors">Pricing</Link>
                <Link href="/about" className="block text-sm text-slate-200 hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="block text-sm text-slate-200 hover:text-white transition-colors">Contact</Link>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-700 bg-slate-900 text-slate-100"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <Link href="/login" className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-center text-sm font-medium text-slate-100">
                    Sign in
                  </Link>
                </div>
                <Link href="/signup" className="block w-full text-center rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
