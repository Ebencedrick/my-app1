"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Mail, Lock, Chrome, TrendingUp, Shield, Zap, Eye, EyeOff } from "lucide-react";

type StoredUser = {
  email: string;
  password: string;
  phone?: string;
  onboardingComplete?: boolean;
  businessName?: string;
  industry?: string;
  website?: string;
  campaignGoal?: string;
  audience?: string;
  budget?: string;
  platformFocus?: string[];
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawUsers = localStorage.getItem("adplatform_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
      const user = users.find(
        (entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password
      );

      if (!user) {
        alert("No account matches these credentials. Please sign up first.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("mock_session", user.email);
      localStorage.setItem("mock_user", JSON.stringify(user));
      localStorage.setItem("mock_onboarding", user.onboardingComplete ? "true" : "false");

      if (user.onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/business-profile");
      }
    } catch {
      alert("Unable to sign in right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="w-full flex justify-center">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-xl w-full sm:max-w-md md:max-w-sm mx-auto">
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
