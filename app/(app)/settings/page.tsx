"use client";

import Link from "next/link";
import { User, Bell, CreditCard, Shield, Globe, Palette, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const settingsNav = [
    { href: "/settings/profile", label: "Profile", icon: User, description: "Personal information and business identity", color: "from-pink-500/20 to-orange-500/20" },
    { href: "/settings/notifications", label: "Notifications", icon: Bell, description: "Manage email, SMS, and campaign alerts", color: "from-blue-500/20 to-purple-500/20" },
    { href: "/settings/security", label: "Security", icon: Shield, description: "Password, sessions, and access control", color: "from-red-500/20 to-orange-500/20" },
    { href: "/settings/integrations", label: "Integrations", icon: Globe, description: "Connect your analytics and marketing tools", color: "from-purple-500/20 to-pink-500/20" },
    { href: "/settings/appearance", label: "Appearance", icon: Palette, description: "Customize your dashboard theme and layout", color: "from-yellow-500/20 to-orange-500/20" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <p className="text-pink-300 text-sm uppercase tracking-[0.2em] font-medium">Workspace</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Settings</h1>
        <p className="text-base text-slate-400">Manage your account, preferences, billing, and security settings.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
              {item.label}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

