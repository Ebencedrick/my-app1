"use client";

import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();

  const handleContinue = async () => {
    try {
      const res = await fetch('/api/onboarding/plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planId: 'pay_as_you_go' }),
      });

      const data = await res.json().catch(() => ({}));
      if (data.user) {
        localStorage.setItem("mock_user", JSON.stringify(data.user));
      } else {
        const storedUser = localStorage.getItem("mock_user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user) {
          user.onboardingComplete = true;
          localStorage.setItem("mock_user", JSON.stringify(user));
        }
      }
    } catch (err) {
      console.error("Plan onboarding error:", err);
    } finally {
      localStorage.setItem("mock_onboarding", "true");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-4">
      <div className="max-w-2xl w-full bg-slate-800/60 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="mb-4">
          <p className="text-pink-300 text-xs uppercase tracking-[0.2em] font-medium">Step 2 of 2</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">100% Free Account Access</h1>
          <p className="text-slate-400 mt-2 text-sm">
            We do not charge monthly subscriptions or recurring plan fees. You only deposit what you choose to spend on your ad campaigns.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-500/40 bg-pink-500/10 p-5 mb-5">
          <p className="text-pink-300 text-xs uppercase tracking-[0.15em] mb-1 font-semibold">Membership Tier</p>
          <p className="text-3xl font-bold text-white">$0 / Free Forever</p>
          <p className="text-slate-300 mt-1 text-sm">Zero subscription commitments. Full access to Meta & TikTok ads.</p>
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

