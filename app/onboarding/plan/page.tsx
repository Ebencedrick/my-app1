"use client";

import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();

  const handleContinue = () => {
    localStorage.setItem("mock_onboarding", "true");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-4">
      <div className="max-w-2xl w-full bg-slate-800/60 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="mb-4">
          <p className="text-pink-300 text-xs uppercase tracking-[0.2em] font-medium">Platform access</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">This platform is free to use</h1>
          <p className="text-slate-400 mt-2 text-sm">
            We do not charge monthly subscriptions or plan fees. Your campaigns only incur a 5% platform fee on the budget you deploy.
          </p>
        </div>

        <div className="rounded-2xl border border-pink-500/40 bg-pink-500/10 p-5 mb-5">
          <p className="text-pink-300 text-xs uppercase tracking-[0.15em] mb-2">Fee model</p>
          <p className="text-3xl font-bold text-white">5%</p>
          <p className="text-slate-300 mt-1 text-sm">of the campaign budget you choose to spend</p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

