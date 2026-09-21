"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@adplatform.com");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

    const adminEmail = email.trim().toLowerCase();
    const adminUser = {
      email: adminEmail,
      role: "admin",
      onboardingComplete: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("mock_admin", "true");
    localStorage.setItem("mock_session", adminEmail);
    localStorage.setItem("mock_user", JSON.stringify(adminUser));
    localStorage.setItem("mock_onboarding", "true");

    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-pink-500/10 backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Access</p>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-pink-500"
              placeholder="admin@adplatform.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-pink-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:from-pink-400 hover:to-orange-400"
          >
            <Lock className="h-4 w-4" />
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
