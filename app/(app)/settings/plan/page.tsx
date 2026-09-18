"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function PlanSettingsPage() {
  const router = useRouter();

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Platform Fee Policy</h1>
        <p className="text-slate-400">The platform is free for users. We only take a small fee from the campaign budget you deploy.</p>
      </div>

      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-orange-500 rounded-2xl p-6 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-pink-100 mb-2">Current policy</p>
            <p className="text-3xl font-bold mb-1">5% platform fee</p>
            <p className="text-pink-100">Applied to your campaign budget only</p>
          </div>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">How it works</h2>
        <ul className="space-y-3 text-slate-300">
          <li>• No monthly subscription or plan upgrade is required.</li>
          <li>• Users can create campaigns without choosing a plan.</li>
          <li>• The system earns 5% of the budget the user allocates to a campaign.</li>
          <li>• This keeps the platform free while allowing consistent monetization.</li>
        </ul>
      </div>
    </div>
  );
}

