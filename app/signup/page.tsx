"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Mail, Lock, Phone, Chrome, TrendingUp, Zap, Globe, Eye, EyeOff } from "lucide-react";

type StoredUser = {
  email: string;
  password: string;
  phone: string;
  onboardingComplete?: boolean;
  businessName?: string;
  industry?: string;
  website?: string;
  campaignGoal?: string;
  audience?: string;
  budget?: string;
  platformFocus?: string[];
};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Unable to create your account right now.");
        setIsLoading(false);
        return;
      }

      // Store fast client cache for UI components while cookies manage session
      localStorage.setItem("mock_session", data.user.email);
      localStorage.setItem("mock_user", JSON.stringify(data.user));
      localStorage.setItem("mock_onboarding", "false");
      router.push("/onboarding/business-profile");
    } catch (err: any) {
      alert("Network error. Unable to reach server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">AdPlatform</span>
              </Link>

              <h1 className="text-4xl font-bold text-white mb-4">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Advertising Journey</span>
              </h1>
              <p className="text-slate-400 text-lg">Create your account and launch your first campaign on Facebook, Instagram, and TikTok in minutes.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-pink-500/30 flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI-Powered Campaigns</h3>
                  <p className="text-slate-400 text-sm">Our AI helps you create optimized campaigns that convert.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Multi-Platform Reach</h3>
                  <p className="text-slate-400 text-sm">Reach audiences across Facebook, Instagram, and TikTok from one dashboard.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Mobile Money Payments</h3>
                  <p className="text-slate-400 text-sm">Pay easily with MTN Mobile Money or cryptocurrency.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-400 text-sm">Already have an account? <Link href="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">Sign in</Link></p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-xl w-full sm:max-w-md md:max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-slate-400 mb-4 text-sm">Start running ads in minutes</p>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm" placeholder="+237 6XX XXX XXX" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Required for Mobile Money verification</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required minLength={8} className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required minLength={8} className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 text-sm" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-2.5 mt-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm">{isLoading ? "Creating account..." : "Create Account"}</button>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-slate-800/50 text-slate-400">Or continue with</span></div>
              </div>

              <button type="button" className="w-full py-2.5 bg-slate-900 border border-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm"><Chrome className="w-4 h-4" />Continue with Google</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
