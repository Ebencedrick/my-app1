"use client";

import Link from "next/link";
import { User, Bell, CreditCard, Shield, Globe, Palette } from "lucide-react";

export default function SettingsPage() {
  const settingsNav = [
    { href: "/settings/profile", label: "Profile", icon: User, description: "Manage your personal information", color: "from-pink-500/20 to-orange-500/20" },
    { href: "/settings/notifications", label: "Notifications", icon: Bell, description: "Configure notification preferences", color: "from-blue-500/20 to-purple-500/20" },
    { href: "/settings/plan", label: "Plan", icon: CreditCard, description: "Manage your subscription plan", color: "from-green-500/20 to-teal-500/20" },
    { href: "/settings/security", label: "Security", icon: Shield, description: "Manage security settings", color: "from-red-500/20 to-orange-500/20" },
    { href: "/settings/integrations", label: "Integrations", icon: Globe, description: "Connect external services", color: "from-purple-500/20 to-pink-500/20" },
    { href: "/settings/appearance", label: "Appearance", icon: Palette, description: "Customize your experience", color: "from-yellow-500/20 to-orange-500/20" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Settings</h1>
        <p className="text-base text-slate-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-pink-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
              {item.label}
            </h3>
            <p className="text-slate-400 text-xs">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
