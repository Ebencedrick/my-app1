"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Smartphone,
  Target,
  BarChart3,
  ArrowRight,
  Facebook,
  Instagram,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  Sparkles,
  X,
  Menu,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Flame,
} from "lucide-react";
import Image from "next/image";
import TikTokIcon from "@/components/ui/TikTokIcon";
import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_28%),linear-gradient(135deg,#020817_0%,#0b1220_30%,#111827_100%)] text-slate-50">
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-90">
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.10" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)" />
          <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
            <line x1="8%" y1="18%" x2="28%" y2="14%" />
            <line x1="28%" y1="14%" x2="48%" y2="22%" />
            <line x1="48%" y1="22%" x2="74%" y2="12%" />
            <line x1="18%" y1="74%" x2="42%" y2="68%" />
            <line x1="42%" y1="68%" x2="66%" y2="78%" />
            <line x1="66%" y1="78%" x2="92%" y2="64%" />
          </g>
          <g fill="#ffffff" fillOpacity="0.04">
            <circle cx="8%" cy="18%" r="60" />
            <circle cx="28%" cy="14%" r="52" />
            <circle cx="48%" cy="22%" r="74" />
            <circle cx="74%" cy="12%" r="44" />
            <circle cx="18%" cy="74%" r="58" />
            <circle cx="42%" cy="68%" r="68" />
            <circle cx="66%" cy="78%" r="52" />
            <circle cx="92%" cy="64%" r="38" />
          </g>
        </svg>
      </div>

      <LandingHeader />

      <main className="relative z-10">
        <section className="flex min-h-[calc(100vh-4rem)] items-center pt-16">
          <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 lg:px-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
              <div className="space-y-6 lg:space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-cyan-200 uppercase shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
                  Growth campaigns live
                </div>

                <div className="animate-slide-up">
                  <div className="relative h-[120px] w-full max-w-[760px] sm:h-[150px] md:h-[180px] lg:h-[204px]">
                    <Image
                      src="/adflux-logo.png"
                      alt="AdFlux logo"
                      fill
                      priority
                      className="object-contain object-left select-none"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="max-w-xl space-y-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  <h1 className="text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl md:text-5xl lg:text-[4.1rem] lg:leading-[0.95]">
                    Turn attention into
                    <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-500 bg-clip-text text-transparent">high-converting growth.</span>
                  </h1>
                  <p className="max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                    Build demand, run smarter social campaigns, and manage ad spend from one place designed for modern brands and ambitious teams.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 animate-slide-up" style={{ animationDelay: "0.25s" }}>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(249,115,22,0.35)] transition-transform hover:-translate-y-0.5">
                    Start your campaign
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-slate-500">
                    View pricing
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-2 animate-slide-up" style={{ animationDelay: "0.35s" }}>
                  <div className="flex -space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-pink-500 to-orange-500 text-[10px] font-bold text-white">JD</div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-purple-500 to-pink-500 text-[10px] font-bold text-white">AK</div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-cyan-400 to-blue-500 text-[10px] font-bold text-white">MN</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300">Trusted by 500+ performance-focused teams</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[420px] animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="relative mx-auto w-[290px] sm:w-[330px] md:w-[360px] lg:w-[390px]">
                  <div className="absolute -left-6 top-20 hidden sm:block animate-float">
                    <div className="rounded-full border border-blue-400/30 bg-blue-500/10 p-3 backdrop-blur-sm">
                      <Facebook className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="absolute -right-6 top-28 hidden sm:block animate-float" style={{ animationDelay: "0.6s" }}>
                    <div className="rounded-full border border-pink-400/30 bg-pink-500/10 p-3 backdrop-blur-sm">
                      <Instagram className="h-6 w-6 text-pink-400" />
                    </div>
                  </div>
                  <div className="absolute -left-2 bottom-24 hidden sm:block animate-float" style={{ animationDelay: "1s" }}>
                    <div className="rounded-full border border-white/20 bg-black/20 p-3 backdrop-blur-sm">
                      <TikTokIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="relative h-[520px] rounded-[2.5rem] border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-[#0b1023] shadow-[0_30px_80px_rgba(14,165,233,0.18)]">
                    <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl border border-slate-800 bg-slate-950" />

                    <div className="absolute inset-4 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#130f2e,#0d152d_42%,#121827_100%)]">
                      <div className="relative space-y-4 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 text-[10px] font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.4)]">A</div>
                            <div>
                              <div className="text-[11px] font-semibold text-white">AdFlux Studio</div>
                              <div className="text-[10px] text-cyan-300">@adflux</div>
                            </div>
                          </div>
                          <div className="rounded-full bg-pink-500/15 p-2">
                            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-3 shadow-inner shadow-cyan-500/10">
                          <div className="mb-2 flex items-center justify-between text-[10px] text-cyan-200">
                            <span>Campaign live</span>
                            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">Live</span>
                          </div>
                          <div className="text-sm font-semibold leading-snug text-white">Launch your next growth push with more attention and less guesswork.</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-base font-bold text-white">18.6K</div>
                            <div className="text-[9px] uppercase tracking-[0.18em] text-cyan-300">Reach</div>
                          </div>
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-base font-bold text-white">2.4%</div>
                            <div className="text-[9px] uppercase tracking-[0.18em] text-pink-300">CTR</div>
                          </div>
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-base font-bold text-white">3.8x</div>
                            <div className="text-[9px] uppercase tracking-[0.18em] text-violet-300">ROAS</div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-3">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Audience</div>
                            <div className="text-[10px] text-emerald-300">+28% this week</div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="mb-1 flex justify-between text-[10px] text-slate-300">
                                <span>18-34</span>
                                <span>74%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 flex justify-between text-[10px] text-slate-300">
                                <span>Interest match</span>
                                <span>89%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-white">Attention score up 234%</span>
                          </div>
                        </div>

                        <div className="relative h-24 rounded-2xl border border-slate-700 bg-slate-900/50 p-3">
                          <div className="absolute inset-x-3 bottom-3 flex h-14 items-end gap-2">
                            {[38, 52, 44, 68, 78, 92, 88].map((height, idx) => (
                              <div
                                key={idx}
                                className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-500 via-blue-500 to-pink-500"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                          <div className="absolute right-3 top-3 flex gap-2">
                            <div className="rounded-full bg-pink-500/20 p-1.5"><Heart className="h-3 w-3 fill-pink-400 text-pink-400" /></div>
                            <div className="rounded-full bg-purple-500/20 p-1.5"><ThumbsUp className="h-3 w-3 text-purple-300" /></div>
                            <div className="rounded-full bg-orange-500/20 p-1.5"><MessageCircle className="h-3 w-3 text-orange-300" /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Icons */}
        <section className="relative overflow-hidden border-y border-slate-800/50 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <p className="mb-10 text-center text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Run ads on all major platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
              <div className="group relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6 sm:hover:scale-110 sm:hover:-translate-y-2 transition-all duration-300">
                  <Facebook className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                </div>
                <div className="absolute -bottom-10 sm:-bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Facebook Ads</div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-pink-500/30 rounded-2xl p-4 sm:p-6 sm:hover:scale-110 sm:hover:-translate-y-2 transition-all duration-300">
                  <Instagram className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500" />
                </div>
                <div className="absolute -bottom-10 sm:-bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Instagram Ads</div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-black/10 border border-white/20 rounded-2xl p-4 sm:p-6 sm:hover:scale-110 sm:hover:-translate-y-2 transition-all duration-300">
                  <TikTokIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute -bottom-10 sm:-bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">TikTok Ads</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-14 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Everything you need to grow</h2>
              <p className="mx-auto max-w-2xl text-slate-300">Built to help brands plan campaigns, manage spending, and turn attention into measurable growth.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/55 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-[0_18px_45px_rgba(236,72,153,0.15)]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 to-orange-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 group-hover:rotate-3 group-hover:scale-110 transition-all duration-500">
                    <Smartphone className="h-8 w-8 text-pink-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-pink-400">Mobile Money payments</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Pay with MTN MoMo, Orange Money, and local wallet options without friction.</p>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/55 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_18px_45px_rgba(168,85,247,0.15)]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:rotate-3 group-hover:scale-110 transition-all duration-500">
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-purple-400">Smart targeting</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Reach better-fit audiences across interests, behaviors, and high-intent communities.</p>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/55 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_18px_45px_rgba(249,115,22,0.15)]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 group-hover:rotate-3 group-hover:scale-110 transition-all duration-500">
                    <BarChart3 className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-orange-400">Real-time analytics</h3>
                  <p className="text-sm leading-relaxed text-slate-300">See performance and conversion trends clearly across platforms and channels.</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">Secure Transactions</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Bank-grade encryption protects your payments and data. Your funds are always safe.</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Globe className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">Multi-Country Support</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Launch campaigns across multiple African countries from a single dashboard.</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Flame className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">Instant Launch</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Get your campaigns live within minutes. No complex setup or technical knowledge required.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-slate-900/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5"></div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Built for faster campaign growth</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">From idea to launch, your team gets the tools to plan, fund, and scale social campaigns with less friction and more momentum.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="group relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-pink-300 mb-2">Why teams choose us</p>
                  <div className="text-5xl font-bold text-white mb-2">Faster</div>
                  <div className="text-sm text-slate-400">campaign execution</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Launch campaigns without extra setup friction
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Manage targeting and budget from one place
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Keep momentum with streamlined campaign workflows
                  </li>
                </ul>
                <Link href="/signup" className="block w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all text-center shadow-lg shadow-pink-500/25">
                  Get Started
                </Link>
              </div>

              <div className="group relative bg-gradient-to-br from-pink-600/20 to-orange-600/20 border-2 border-pink-500/50 rounded-2xl p-8 shadow-2xl shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-pink-300 mb-2">Campaign outcomes</p>
                  <div className="text-4xl font-bold text-white mb-2">+234%</div>
                  <div className="text-sm text-slate-400">engagement uplift</div>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
                  Better targeting, faster launch cycles, and clearer campaign reporting for growth-focused teams.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Get started in 4 simple steps</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: 1, title: "Sign Up", desc: "Create your account in seconds", icon: <Sparkles className="w-6 h-6" /> },
                { step: 2, title: "Add Funds", desc: "Deposit via Mobile Money or crypto", icon: <Smartphone className="w-6 h-6" /> },
                { step: 3, title: "Create Campaign", desc: "Set your budget and targeting", icon: <Target className="w-6 h-6" /> },
                { step: 4, title: "Go Live", desc: "We launch and manage your ads", icon: <Flame className="w-6 h-6" /> }
              ].map((item, index) => (
                <div key={index} className="text-center group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40">
                      {item.step}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-100">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-400 group-hover:translate-y-1 transition-transform duration-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
