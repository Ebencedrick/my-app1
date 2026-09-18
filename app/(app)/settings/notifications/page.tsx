"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BellRing, Mail, Smartphone, ShieldCheck } from "lucide-react";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    campaignUpdates: true,
    spendAlerts: true,
    budgetExceeded: true,
    campaignCompleted: true,
    weeklyReports: false,
  });

  const [smsNotifications, setSmsNotifications] = useState({
    campaignUpdates: false,
    spendAlerts: true,
    budgetExceeded: true,
    campaignCompleted: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Notification preferences saved successfully.");
    }, 500);
  };

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({ ...emailNotifications, [key]: !emailNotifications[key] });
  };

  const handleSmsToggle = (key: keyof typeof smsNotifications) => {
    setSmsNotifications({ ...smsNotifications, [key]: !smsNotifications[key] });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Notification Settings</h1>
        <p className="text-slate-400">Configure how and when you want to receive updates about your campaigns.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
              <p className="text-sm text-slate-400">Receive updates in your inbox.</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-sm text-slate-400">
                    {key === "campaignUpdates" && "Status changes and campaign milestones"}
                    {key === "spendAlerts" && "Spend thresholds and performance alerts"}
                    {key === "budgetExceeded" && "Budget limit warnings and overruns"}
                    {key === "campaignCompleted" && "Completion and win-loss summary updates"}
                    {key === "weeklyReports" && "Weekly performance and insight report"}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailToggle(key as keyof typeof emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-gradient-to-r from-pink-500 to-orange-500" : "bg-slate-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">SMS Notifications</h2>
              <p className="text-sm text-slate-400">Fast alerts for uptime and important events.</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(smsNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-sm text-slate-400">
                    {key === "campaignUpdates" && "SMS updates on campaign changes"}
                    {key === "spendAlerts" && "Warning when your monthly spend is rising"}
                    {key === "budgetExceeded" && "High-priority spend limit alerts"}
                    {key === "campaignCompleted" && "Flag critical campaign completion events"}
                  </p>
                </div>
                <button
                  onClick={() => handleSmsToggle(key as keyof typeof smsNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-gradient-to-r from-pink-500 to-orange-500" : "bg-slate-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-white font-medium">Delivery priority</p>
              <p className="text-sm text-slate-400">Critical alerts always delivered first</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

