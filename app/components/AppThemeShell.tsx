"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AppThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen theme-bg transition-colors duration-500">
        {children}
      </div>
    </ThemeProvider>
  );
}
