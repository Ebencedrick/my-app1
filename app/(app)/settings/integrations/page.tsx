"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Chrome, Facebook, Globe, Link2, Sparkles } from "lucide-react";

export default function IntegrationsSettingsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState({
    facebook: true,
    tikTok: true,
    googleAnalytics: false,
    stripe: true,
    slack: false,
  });

  const toggleConnection = (key: keyof typeof connections) => {
    setConnections({ ...connections, [key]: !connections[key] });
  };

  const items = [
    { key: "facebook", label: "Facebook Ads", icon: Facebook, accent: "from-blue-500/20 to-cyan-500/20", active: "text-blue-400" },
    { key: "tikTok", label: "TikTok Ads", icon: Sparkles, accent: "from-pink-500/20 to-orange-500/20", active: "text-pink-400" },
    { key: "googleAnalytics", label: "Google Analytics", icon: Globe, accent: "from-emerald-500/20 to-green-500/20", active: "text-emerald-400" },
    { key: "stripe", label: "Stripe", icon: Link2, accent: "from-violet-500/20 to-indigo-500/20", active: "text-violet-400" },
    { key: "slack", label: "Slack", icon: Chrome, accent: "from-purple-500/20 to-pink-500/20", active: "text-purple-400" },
  ] as const;

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-slate-400">Connect the tools your team uses to measure, automate, and scale marketing performance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        {items.map(({ key, label, icon: Icon, accent, active }) => (
          <div key={key} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${accent} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${active}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{label}</h2>
                  <p className="text-sm text-slate-400">{connections[key] ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <button
                onClick={() => toggleConnection(key)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  connections[key]
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-700 text-slate-200 border border-slate-600"
                }`}
              >
                {connections[key] ? "Connected" : "Connect"}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Sync status</span>
              <span className={`flex items-center gap-2 ${connections[key] ? "text-emerald-400" : "text-slate-500"}`}>
                {connections[key] && <Check className="w-4 h-4" />}
                {connections[key] ? "Live" : "Offline"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
