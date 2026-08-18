"use client";

import Link from "next/link";

export default function SettingsPage() {
  const settingsNav = [
    { href: "/settings/profile", label: "Profile", icon: "👤", description: "Manage your personal information" },
    { href: "/settings/notifications", label: "Notifications", icon: "🔔", description: "Configure notification preferences" },
    { href: "/settings/plan", label: "Plan", icon: "💳", description: "Manage your subscription plan" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {item.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
