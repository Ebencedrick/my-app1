"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft, Mail, Lock, Chrome, TrendingUp, Shield, Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - replace with NextAuth in production
    setTimeout(() => {
      localStorage.setItem("mock_session", "true");
      const onboardingComplete = localStorage.getItem("mock_onboarding") === "true";
      
      if (onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/business-profile");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">AdPlatform</span>
              </Link>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">AdPlatform</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Sign in to manage your advertising campaigns across Facebook, Instagram, and TikTok.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-pink-500/30 flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Scale Your Business</h3>
                  <p className="text-slate-400 text-sm">Reach millions of customers across Africa with targeted campaigns.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Secure & Trusted</h3>
                  <p className="text-slate-400 text-sm">Your data and payments are protected with enterprise-grade security.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Lightning Fast Setup</h3>
                  <p className="text-slate-400 text-sm">Launch your first campaign in minutes with our AI-powered platform.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-sm">
            <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
            <p className="text-slate-400 mb-4 text-sm">Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-3.5 h-3.5 text-pink-500 border-slate-600 rounded focus:ring-pink-500 bg-slate-900" />
                  <span className="ml-2 text-xs text-slate-400">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-800/50 text-slate-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-slate-900 border border-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <Chrome className="w-4 h-4" />
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
