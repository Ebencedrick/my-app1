"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  TrendingUp, 
  Layers, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { useTheme, THEME_PALETTES, ThemeConfig } from "@/context/ThemeContext";

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const { theme, setTheme, saving } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const activePalette: ThemeConfig = 
    THEME_PALETTES.find((p: ThemeConfig) => p.id === selectedTheme) || 
    THEME_PALETTES.find((p: ThemeConfig) => p.id === theme) || 
    THEME_PALETTES[0];

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    setSaveSuccess(false);
    setSaveError(null);
    // Instant live preview by updating DOM attribute temporarily
    document.documentElement.setAttribute("data-theme", themeId);
  };

  const handleSaveTheme = async () => {
    setSaveError(null);
    const success = await setTheme(selectedTheme);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setSaveError("Failed to save theme to your account. Please try again.");
    }
  };

  const handleResetDefault = async () => {
    setSelectedTheme("sunset");
    await setTheme("sunset");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              Color Themes & Appearance
            </h1>
            <p className="text-slate-400 text-sm">
              Customize the platform's visual accent. Your chosen color theme syncs to your database profile and persists across logouts and logins.
            </p>
          </div>

          <button
            onClick={handleResetDefault}
            className="self-start sm:self-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong className="font-semibold">Color theme updated successfully!</strong>
            <p className="text-xs text-emerald-400/80">Saved to your database profile. This color theme will automatically remain when you log out and log back in.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {saveError}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Color Palette Choices */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-1">Choose Your Platform Color Palette</h2>
            <p className="text-xs text-slate-400 mb-6">
              Select one of the curated multi-color palettes below. The ambient glow, buttons, and accents will update across all pages.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {THEME_PALETTES.map((palette: ThemeConfig) => {
                const isSelected = selectedTheme === palette.id;
                return (
                  <div
                    key={palette.id}
                    onClick={() => handleSelectTheme(palette.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group text-left ${
                      isSelected
                        ? "border-white/80 bg-slate-800/90 shadow-xl ring-2 ring-white/20"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Active Checkmark */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Gradient Swatch */}
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${palette.gradientClass} shadow-lg transition-transform group-hover:scale-105`}
                        style={{ boxShadow: `0 0 16px ${palette.glowColor}` }}
                      ></div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          {palette.name}
                          {palette.isLight ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">White</span>
                          ) : palette.id === "dark" ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold uppercase">Dark</span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-slate-400">{palette.subtitle}</div>
                      </div>
                    </div>

                    {/* Mini Color Bars Preview */}
                    <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden bg-slate-800">
                      <div 
                        className="flex-1 rounded-full" 
                        style={{ backgroundColor: palette.fromColor }}
                      ></div>
                      <div 
                        className="flex-1 rounded-full" 
                        style={{ backgroundColor: palette.toColor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Persistent Notice */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="text-white font-medium">Cloud Database Synchronization:</span> When you click &ldquo;Save &amp; Update Color Theme&rdquo;, your preference is written directly to your user record in MongoDB Atlas. If you log out and return on another browser or device, your custom color theme will automatically load.
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                disabled={saving}
                onClick={handleSaveTheme}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save &amp; Update Color Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interface Mockup Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Live Simulator Preview</h3>
                <p className="text-xs text-slate-400">See how {activePalette.name} looks in action</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {activePalette.id}
              </span>
            </div>

            {/* Mock Dashboard Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-4 shadow-2xl">
              {/* Mock Topbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${activePalette.gradientClass} flex items-center justify-center text-white text-[10px] font-black shadow-md`}>
                    A
                  </div>
                  <span className="text-xs font-semibold text-white">AdPlatform</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activePalette.gradientClass} animate-pulse`}></div>
                  <span className="text-[10px] text-slate-400">Live Active</span>
                </div>
              </div>

              {/* Mock Stat Pill */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Available Balance</span>
                  <span className="text-base font-bold text-white">$450.00</span>
                </div>
                <button 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${activePalette.gradientClass} shadow-md`}
                >
                  Deposit
                </button>
              </div>

              {/* Mock Campaign Performance Card */}
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Summer Blitz Promo</span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +24% CTR
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${activePalette.gradientClass} rounded-full`}
                    style={{ width: "68%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>14,200 Impressions</span>
                  <span>920 Clicks</span>
                </div>
              </div>

              {/* Mock Action Pill */}
              <div className="flex items-center gap-2">
                <button className={`flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${activePalette.gradientClass} shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  + Create Campaign
                </button>
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
