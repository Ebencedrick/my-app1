"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Palette, Sparkles } from "lucide-react";

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [density, setDensity] = useState("comfortable");
  const [accent, setAccent] = useState("pink");

  const accentOptions = [
    { name: "pink", className: "bg-gradient-to-r from-pink-500 to-orange-500" },
    { name: "violet", className: "bg-gradient-to-r from-violet-500 to-purple-500" },
    { name: "teal", className: "bg-gradient-to-r from-teal-500 to-cyan-500" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Appearance</h1>
        <p className="text-slate-400">Customize how your dashboard looks and feels while you work.</p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 max-w-5xl">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Theme preferences</h2>
              <p className="text-sm text-slate-400">Adjust the look for your everyday dashboard flow.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-200 mb-3">Interface mode</p>
              <div className="grid grid-cols-2 gap-3">
                {['dark', 'light'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setTheme(option)}
                    className={`py-3 rounded-xl border transition-all ${
                      theme === option
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-slate-700 bg-slate-900 text-slate-300"
                    }`}
                  >
                    {option === "dark" ? "Dark mode" : "Light mode"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200 mb-3">Density</p>
              <div className="grid grid-cols-3 gap-3">
                {['compact', 'comfortable', 'spacious'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setDensity(option)}
                    className={`py-3 rounded-xl border capitalize transition-all ${
                      density === option
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-slate-700 bg-slate-900 text-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200 mb-3">Accent color</p>
              <div className="flex gap-3">
                {accentOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setAccent(option.name)}
                    className={`relative w-12 h-12 rounded-full ${option.className} border-2 ${
                      accent === option.name ? "border-white" : "border-transparent"
                    }`}
                  >
                    {accent === option.name && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Preview</h2>
              <p className="text-sm text-slate-400">Live style overview.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <div className={`h-2 w-20 rounded-full ${accentOptions.find((item) => item.name === accent)?.className}`} />
            <div className="mt-4 space-y-3">
              <div className="h-8 rounded-xl bg-slate-800" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded-xl bg-slate-800" />
                <div className="h-16 rounded-xl bg-slate-800" />
              </div>
              <div className="h-20 rounded-xl bg-slate-800" />
            </div>
          </div>

          <button className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all">
            Save appearance
          </button>
        </div>
      </div>
    </div>
  );
}
