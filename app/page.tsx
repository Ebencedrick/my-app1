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
  PlayCircle,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  X,
  Menu,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Flame,
  Sparkles
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/25">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-white tracking-tight">AdPlatform</div>
            </div>
            
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">Pricing</Link>
              <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
              <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all shadow-lg shadow-pink-500/25">
                Get Started
              </Link>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <Link href="/pricing" className="block text-sm text-slate-300 hover:text-white transition-colors font-medium">Pricing</Link>
              <Link href="/login" className="block text-sm text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
              <Link href="/signup" className="block px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all text-center">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

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
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up">
                  Amplify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400">Social Presence</span>.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">Across Africa.</span>
                </h1>
                
                <p className="text-base text-slate-400 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Launch viral campaigns on Facebook, Instagram, and TikTok with Mobile Money payments. 
                  Turn your content into engagement and sales.
                </p>
                
                <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Link href="/signup" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2 group">
                    Start Your Campaign
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/pricing" className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    View Pricing
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

              {/* Hero Visual - Phone with Social Media Engagement */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative mx-auto w-72 h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] border-4 border-slate-700 shadow-2xl shadow-pink-500/20">
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
                    
                    {/* Phone Screen */}
                    <div className="absolute inset-4 bg-gradient-to-br from-purple-900 to-pink-900 rounded-[2rem] overflow-hidden">
                      {/* Social Media Content */}
                      <div className="p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full"></div>
                            <div>
                              <div className="text-white text-xs font-semibold">YourBrand</div>
                              <div className="text-pink-300 text-xs">@yourbrand</div>
                            </div>
                          </div>
                          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                        </div>

                        {/* Post Content */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-3">
                          <div className="text-white text-sm mb-2">🔥 Flash Sale! 50% OFF everything!</div>
                          <div className="text-slate-300 text-xs">Limited time offer. Don't miss out!</div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex justify-around bg-slate-800/30 rounded-xl p-3">
                          <div className="text-center">
                            <div className="text-white text-lg font-bold">12.4K</div>
                            <div className="text-pink-300 text-xs">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white text-lg font-bold">3.2K</div>
                            <div className="text-purple-300 text-xs">Comments</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white text-lg font-bold">8.9K</div>
                            <div className="text-orange-300 text-xs">Shares</div>
                          </div>
                        </div>

                        {/* Floating Engagement Icons */}
                        <div className="relative h-32">
                          <div className="absolute top-2 left-4 animate-float" style={{ animationDelay: '0s' }}>
                            <div className="bg-pink-500/20 backdrop-blur-sm rounded-full p-2">
                              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                            </div>
                          </div>
                          <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '0.5s' }}>
                            <div className="bg-purple-500/20 backdrop-blur-sm rounded-full p-2">
                              <ThumbsUp className="w-6 h-6 text-purple-500" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-8 animate-float" style={{ animationDelay: '1s' }}>
                            <div className="bg-orange-500/20 backdrop-blur-sm rounded-full p-2">
                              <MessageCircle className="w-6 h-6 text-orange-500" />
                            </div>
                          </div>
                          <div className="absolute bottom-8 right-4 animate-float" style={{ animationDelay: '1.5s' }}>
                            <div className="bg-pink-500/20 backdrop-blur-sm rounded-full p-2">
                              <Share2 className="w-6 h-6 text-pink-500" />
                            </div>
                          </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <div className="text-white text-xs font-semibold">+234% Engagement</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Social Icons Around Phone */}
                  <div className="absolute -left-8 top-20 animate-float" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-3 border border-blue-500/30">
                      <Facebook className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="absolute -right-8 top-32 animate-float" style={{ animationDelay: '0.6s' }}>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full p-3 border border-pink-500/30">
                      <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                  </div>
                  <div className="absolute -left-4 bottom-32 animate-float" style={{ animationDelay: '0.9s' }}>
                    <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 border border-white/20">
                      <PlayCircle className="w-6 h-6 text-white" />
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
            <div className="flex justify-center gap-16 items-center">
              <div className="group relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                  <Facebook className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Facebook Ads</div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                  <Instagram className="w-12 h-12 text-pink-500" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Instagram Ads</div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-black/10 border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
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

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-slate-900/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your business needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Pay-as-you-go */}
              <div className="group relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-slate-300 transition-colors">Pay-as-you-go</h3>
                    <p className="text-sm text-slate-400">Perfect for testing</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">15%</div>
                    <div className="text-sm text-slate-400">management fee</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      No monthly subscription
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      All ad platforms included
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Basic support
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Mobile Money & crypto
                    </li>
                  </ul>
                  <Link href="/signup" className="block w-full py-3 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors text-center group-hover:shadow-lg group-hover:shadow-slate-500/25">
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Growth - Featured */}
              <div className="group relative bg-gradient-to-br from-pink-600/20 to-orange-600/20 border-2 border-pink-500/50 rounded-2xl p-8 transform md:scale-105 shadow-2xl shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold animate-pulse">
                  Most Popular
                </div>
                <div className="relative">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">Growth</h3>
                    <p className="text-sm text-slate-400">For growing businesses</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">$29<span className="text-lg font-normal text-slate-400">/mo</span></div>
                    <div className="text-sm text-slate-400">+ 10% fee</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Everything in Pay-as-you-go
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Priority support
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Advanced analytics
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      A/B testing features
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Custom reporting
                    </li>
                  </ul>
                  <Link href="/signup" className="block w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-400 hover:to-orange-400 transition-all text-center shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40">
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Agency */}
              <div className="group relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-slate-300 transition-colors">Agency</h3>
                    <p className="text-sm text-slate-400">For marketing agencies</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">$99<span className="text-lg font-normal text-slate-400">/mo</span></div>
                    <div className="text-sm text-slate-400">+ 8% fee</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Everything in Growth
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      White-label reporting
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      API access
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Custom integrations
                    </li>
                  </ul>
                  <Link href="/signup" className="block w-full py-3 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors text-center group-hover:shadow-lg group-hover:shadow-slate-500/25">
                    Contact Sales
                  </Link>
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

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white tracking-tight">AdPlatform</div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The easiest way to run ads across Africa with Mobile Money and crypto payments.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/campaigns" className="text-sm text-slate-400 hover:text-white transition-colors">Campaigns</Link></li>
                <li><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Instagram</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-500">&copy; 2024 AdPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
