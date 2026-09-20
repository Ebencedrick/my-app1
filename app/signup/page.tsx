"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Mail, Lock, Phone, Chrome, TrendingUp, Zap, Globe, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to create your account right now.");
        setIsLoading(false);
        return;
      }

      // Store client cache
      try {
        localStorage.setItem("mock_session", data.user.email);
        localStorage.setItem("mock_user", JSON.stringify(data.user));
        localStorage.setItem("mock_onboarding", "false");
      } catch {}

      router.push("/onboarding/business-profile");
    } catch {
      setErrorMessage("Network error. Unable to reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Glow ambient spots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Form Column - Displayed first on Mobile (order-1), second on Desktop (lg:order-2) */}
          <div className="order-1 lg:order-2 bg-slate-900/80 border border-slate-800 p-5 sm:p-7 rounded-2xl shadow-2xl backdrop-blur-xl w-full sm:max-w-md mx-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-slate-400 text-xs">Start running ads on Facebook, Instagram &amp; TikTok</p>
            </div>

            {/* Inline Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Required for Mobile Money deposits and alerts</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[46px] py-3 mt-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Marketing Column - Displayed second on Mobile (order-2), first on Desktop (lg:order-1) */}
          <div className="order-2 lg:order-1 space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-6 focus:outline-none">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">AdPlatform</span>
              </Link>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                Scale Ads Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Social Networks</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Launch, monitor, and optimize your ads on Facebook, Instagram, and TikTok with local currency and Mobile Money wallet integration.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="w-9 h-9 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/30 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-semibold mb-0.5">High Conversion Campaigns</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Targeted audience sets customized for African &amp; global markets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-semibold mb-0.5">Unified Ad Reach</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Publish to Meta and TikTok from a single synchronized interface.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-semibold mb-0.5">Instant Mobile Money</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Direct MTN &amp; Orange MoMo balance top-ups with zero hassle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
