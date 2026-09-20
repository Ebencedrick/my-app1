"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  fromColor: string;
  toColor: string;
  gradientClass: string;
  glowColor: string;
  borderClass: string;
  bgGlow: string;
  isLight?: boolean;
}

export const THEME_PALETTES: ThemeConfig[] = [
  {
    id: "dark",
    name: "Midnight Dark",
    subtitle: "Deep Slate & Pure Onyx",
    fromColor: "#38bdf8",
    toColor: "#818cf8",
    gradientClass: "from-slate-700 to-slate-900",
    glowColor: "rgba(56, 189, 248, 0.25)",
    borderClass: "border-slate-700/60",
    bgGlow: "from-slate-800/20 to-slate-950/30",
    isLight: false,
  },
  {
    id: "light",
    name: "Daylight White",
    subtitle: "Pure White & Crisp Slate",
    fromColor: "#ec4899",
    toColor: "#f97316",
    gradientClass: "from-slate-100 to-white",
    glowColor: "rgba(236, 72, 153, 0.2)",
    borderClass: "border-slate-300",
    bgGlow: "from-pink-500/10 to-orange-500/10",
    isLight: true,
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    subtitle: "Pink & Radiant Orange",
    fromColor: "#ec4899",
    toColor: "#f97316",
    gradientClass: "from-pink-500 to-orange-500",
    glowColor: "rgba(236, 72, 153, 0.35)",
    borderClass: "border-pink-500/40",
    bgGlow: "from-pink-500/10 to-orange-500/10",
    isLight: false,
  },
  {
    id: "cosmic",
    name: "Cosmic Nebula",
    subtitle: "Electric Purple & Indigo",
    fromColor: "#8b5cf6",
    toColor: "#6366f1",
    gradientClass: "from-purple-500 to-indigo-500",
    glowColor: "rgba(139, 92, 246, 0.35)",
    borderClass: "border-purple-500/40",
    bgGlow: "from-purple-500/10 to-indigo-500/10",
    isLight: false,
  },
  {
    id: "ocean",
    name: "Ocean Cyan",
    subtitle: "Deep Cyan & Sky Blue",
    fromColor: "#06b6d4",
    toColor: "#3b82f6",
    gradientClass: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.35)",
    borderClass: "border-cyan-500/40",
    bgGlow: "from-cyan-500/10 to-blue-500/10",
    isLight: false,
  },
  {
    id: "emerald",
    name: "Emerald Aurora",
    subtitle: "Vibrant Mint & Forest Emerald",
    fromColor: "#10b981",
    toColor: "#14b8a6",
    gradientClass: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.35)",
    borderClass: "border-emerald-500/40",
    bgGlow: "from-emerald-500/10 to-teal-500/10",
    isLight: false,
  },
  {
    id: "solar",
    name: "Solar Ember",
    subtitle: "Warm Gold & Fiery Crimson",
    fromColor: "#f59e0b",
    toColor: "#ef4444",
    gradientClass: "from-amber-500 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.35)",
    borderClass: "border-amber-500/40",
    bgGlow: "from-amber-500/10 to-red-500/10",
    isLight: false,
  },
  {
    id: "rose",
    name: "Rose Quartz",
    subtitle: "Vivid Fuchsia & Rose",
    fromColor: "#d946ef",
    toColor: "#f43f5e",
    gradientClass: "from-fuchsia-500 to-rose-500",
    glowColor: "rgba(217, 70, 239, 0.35)",
    borderClass: "border-fuchsia-500/40",
    bgGlow: "from-fuchsia-500/10 to-rose-500/10",
    isLight: false,
  },
];

interface ThemeContextType {
  theme: string;
  themeData: ThemeConfig;
  setTheme: (newTheme: string) => Promise<boolean>;
  themes: ThemeConfig[];
  saving: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "sunset",
  themeData: THEME_PALETTES[0],
  setTheme: async () => false,
  themes: THEME_PALETTES,
  saving: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setActiveTheme] = useState<string>("sunset");
  const [saving, setSaving] = useState(false);

  // Apply theme to DOM
  const applyThemeToDom = (t: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
    }
  };

  useEffect(() => {
    // 1. Initial load from localStorage for zero-flicker experience
    const local = localStorage.getItem("app_theme");
    if (local && THEME_PALETTES.some((p) => p.id === local)) {
      setActiveTheme(local);
      applyThemeToDom(local);
    }

    // 2. Fetch authenticated user's DB theme preference
    const fetchUserTheme = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          const dbTheme = data?.user?.themePreference;
          if (dbTheme && THEME_PALETTES.some((p) => p.id === dbTheme)) {
            setActiveTheme(dbTheme);
            applyThemeToDom(dbTheme);
            localStorage.setItem("app_theme", dbTheme);
          }
        }
      } catch {
        // silent fail on network or guest mode
      }
    };

    fetchUserTheme();
  }, []);

  const setTheme = async (newTheme: string): Promise<boolean> => {
    if (!THEME_PALETTES.some((p) => p.id === newTheme)) return false;

    // Instant local feedback
    setActiveTheme(newTheme);
    applyThemeToDom(newTheme);
    localStorage.setItem("app_theme", newTheme);

    // Save to MongoDB User collection
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themePreference: newTheme }),
      });
      setSaving(false);
      return res.ok;
    } catch {
      setSaving(false);
      return false;
    }
  };

  const themeData = THEME_PALETTES.find((p) => p.id === theme) || THEME_PALETTES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeData,
        setTheme,
        themes: THEME_PALETTES,
        saving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
