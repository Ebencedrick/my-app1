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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 overflow-hidden">
      {/* Hero Background Illustration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#FF77A9" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FFB77A" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#g1)" />

          {/* Network nodes and links */}
          <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
            <line x1="8%" y1="20%" x2="30%" y2="10%" />
            <line x1="30%" y1="10%" x2="60%" y2="18%" />
            <line x1="60%" y1="18%" x2="85%" y2="8%" />
            <line x1="12%" y1="70%" x2="40%" y2="65%" />
            <line x1="40%" y1="65%" x2="70%" y2="72%" />
            <line x1="70%" y1="72%" x2="92%" y2="60%" />
          </g>

          <g fill="#fff" fillOpacity="0.07">
            <circle cx="8%" cy="20%" r="60" />
            <circle cx="30%" cy="10%" r="48" />
            <circle cx="60%" cy="18%" r="72" />
            <circle cx="85%" cy="8%" r="40" />
            <circle cx="12%" cy="70%" r="56" />
            <circle cx="40%" cy="65%" r="64" />
            <circle cx="70%" cy="72%" r="52" />
            <circle cx="92%" cy="60%" r="36" />
          </g>

          <rect width="100%" height="100%" fill="url(#g2)" />
        </svg>
      </div>

      <LandingHeader />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg mb-4 animate-fade-in">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-pink-400 font-medium">Now supporting TikTok Ads</span>
                </div>

                <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <div className="relative w-full max-w-[760px] h-[160px] md:h-[200px]">
                    <Image
                      src="/adflux-logo.png"
                      alt="AdFlux logo"
                      fill
                      priority
                      className="object-contain object-left"
                    />
                  </div>
                </div>

                <p className="text-base text-slate-400 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Launch viral campaigns on Facebook, Instagram, and TikTok with Mobile Money payments. 
                  Turn your content into engagement and sales.
                </p>
                
                <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Link href="/signup" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2 group">
                    Start Your Campaign
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold">JD</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold">AK</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold">MN</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">Trusted by 500+ businesses</p>
                  </div>
                </div>
              </div>

              {/* Hero Visual - Realistic phone mockup visible on both desktop and mobile */}
              <div className="relative animate-fade-in my-8 md:my-0" style={{ animationDelay: '0.3s' }}>
                <div className="relative mx-auto w-[290px] sm:w-[330px] md:w-[360px] lg:w-[390px]">
                  <div className="absolute -left-8 top-20 hidden sm:block animate-float" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-3 border border-blue-500/30">
                      <Facebook className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="absolute -right-8 top-28 hidden sm:block animate-float" style={{ animationDelay: '0.6s' }}>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full p-3 border border-pink-500/30">
                      <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                  </div>
                  <div className="absolute -left-4 bottom-24 hidden sm:block animate-float" style={{ animationDelay: '0.9s' }}>
                    <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 border border-white/20">
                      <TikTokIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="relative mx-auto w-full h-[520px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[2.5rem] border-[3px] border-slate-700 shadow-[0_30px_80px_rgba(236,72,153,0.25)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-b-2xl border border-slate-800/80"></div>

                    <div className="absolute inset-4 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1a0d35] via-[#120e41] to-[#0b1736]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.22),transparent_34%)]" />

                      <div className="relative p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-cyan-500/30">A</div>
                            <div>
                              <div className="text-white text-[11px] font-semibold">AdFlux Studio</div>
                              <div className="text-cyan-300 text-[10px]">@adflux</div>
                            </div>
                          </div>
                          <div className="rounded-full bg-pink-500/15 p-2">
                            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-3 shadow-inner shadow-cyan-500/10">
                          <div className="flex items-center justify-between text-[10px] text-cyan-200 mb-2">
                            <span>Campaign live</span>
                            <span className="rounded-full bg-green-500/15 px-1.5 py-0.5 text-green-300">Live</span>
                          </div>
                          <div className="text-white text-sm font-semibold leading-snug">Launch your next viral brand push for 4x more attention.</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-white text-base font-bold">18.6K</div>
                            <div className="text-cyan-300 text-[9px] uppercase tracking-wide">Reach</div>
                          </div>
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-white text-base font-bold">2.4%</div>
                            <div className="text-pink-300 text-[9px] uppercase tracking-wide">CTR</div>
                          </div>
                          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-center">
                            <div className="text-white text-base font-bold">3.8x</div>
                            <div className="text-violet-300 text-[9px] uppercase tracking-wide">ROAS</div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Audience</div>
                            <div className="text-[10px] text-emerald-300">+28% this week</div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                                <span>18-34</span>
                                <span>74%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[74%] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                                <span>Interest match</span>
                                <span>89%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[89%] bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/12 to-cyan-500/12 p-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-white text-xs font-semibold">Attention score up 234%</span>
                          </div>
                        </div>

                        <div className="relative h-24 rounded-2xl border border-slate-700 bg-slate-900/50 p-3">
                          <div className="absolute inset-x-3 bottom-3 flex items-end gap-2 h-14">
                            {[38, 52, 44, 68, 78, 92, 88].map((height, idx) => (
                              <div
                                key={idx}
                                className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-500 via-blue-500 to-pink-500"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2">
                            <div className="bg-pink-500/20 p-1.5 rounded-full"><Heart className="w-3 h-3 text-pink-400 fill-pink-400" /></div>
                            <div className="bg-purple-500/20 p-1.5 rounded-full"><ThumbsUp className="w-3 h-3 text-purple-300" /></div>
                            <div className="bg-orange-500/20 p-1.5 rounded-full"><MessageCircle className="w-3 h-3 text-orange-300" /></div>
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
        <section className="py-20 border-y border-slate-800/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="text-center text-sm text-slate-400 mb-12 font-medium uppercase tracking-wider">Run ads on all major platforms</p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 items-center">
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
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Powerful features designed for African businesses</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Smartphone className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">Mobile Money Payments</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Pay with MTN MoMo, Orange Money, and other local mobile money services. No international cards needed.</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Target className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Smart Targeting</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">AI-powered targeting reaches your ideal audience across demographics, interests, and behaviors.</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <BarChart3 className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">Real-Time Analytics</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Track performance across all platforms with unified dashboards and detailed reports.</p>
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
