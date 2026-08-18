"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
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

    // Mock save - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Notification preferences saved successfully!");
    }, 500);
  };

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key],
    });
  };

  const handleSmsToggle = (key: keyof typeof smsNotifications) => {
    setSmsNotifications({
      ...smsNotifications,
      [key]: !smsNotifications[key],
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
        >
          ← Back to Settings
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notification Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure how and when you receive notifications</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📧</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === "campaignUpdates" && "Get notified when your campaign status changes"}
                    {key === "spendAlerts" && "Receive alerts when spend reaches thresholds"}
                    {key === "budgetExceeded" && "Alert when campaign budget is exceeded"}
                    {key === "campaignCompleted" && "Notification when campaign ends"}
                    {key === "weeklyReports" && "Weekly performance summary"}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailToggle(key as keyof typeof emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📱</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">SMS Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(smsNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === "campaignUpdates" && "Get notified when your campaign status changes"}
                    {key === "spendAlerts" && "Receive alerts when spend reaches thresholds"}
                    {key === "budgetExceeded" && "Alert when campaign budget is exceeded"}
                    {key === "campaignCompleted" && "Notification when campaign ends"}
                  </p>
                </div>
                <button
                  onClick={() => handleSmsToggle(key as keyof typeof smsNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
