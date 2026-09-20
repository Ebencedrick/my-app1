"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Mail, Lock, Chrome, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Invalid email or password. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      const user = data.user;
      try {
        localStorage.setItem("mock_session", user.email);
        localStorage.setItem("mock_user", JSON.stringify(user));
        localStorage.setItem("mock_onboarding", user.onboardingComplete ? "true" : "false");
        if (user.role === "admin") {
          localStorage.setItem("mock_admin", "true");
        } else {
          localStorage.removeItem("mock_admin");
        }
      } catch {}

      if (user.onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/business-profile");
      }
    } catch {
      setErrorMessage("Unable to connect to the server right now. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow ambient circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-8 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 focus:outline-none">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">AdPlatform</span>
          </Link>
          <p className="text-xs text-slate-400">Sign in to your cross-network advertising manager</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 mb-5 text-xs">Enter your credentials to access your dashboard</p>

          {/* Inline Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 text-sm transition-all"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-pink-500 border-slate-700 rounded focus:ring-pink-500 bg-slate-950"
                />
                <span className="ml-2 text-xs text-slate-400">Keep me signed in</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
