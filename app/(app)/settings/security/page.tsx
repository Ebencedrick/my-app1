"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securityState, setSecurityState] = useState({
    twoFactor: true,
    loginAlerts: true,
    deviceApproval: false,
    sessionTimeout: true,
  });
  const [saved, setSaved] = useState(false);

  const updateSecurityState = (key: keyof typeof securityState) => {
    setSecurityState({ ...securityState, [key]: !securityState[key] });
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = async () => {
    setErrorMessage("");
    if (passwords.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswords({ current: "", newPassword: "", confirmPassword: "" });
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setErrorMessage(data.error || "Failed to update password");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Network error updating password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Security</h1>
        <p className="text-slate-400">Protect your account, sessions, and sensitive campaign data.</p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-2xl border border-green-500/40 bg-green-500/10 text-green-300 flex items-center gap-3">
          <Check className="w-5 h-5" />
          Password updated successfully in database.
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300 flex items-center gap-3">
          {errorMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <LockKeyhole className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Password</h2>
              <p className="text-sm text-slate-400">Keep account access secure.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Current password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">New password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500"
                placeholder="Create a new password"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Confirm password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500"
                placeholder="Repeat new password"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={isUpdating}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all disabled:opacity-50"
            >
              {isUpdating ? "Updating password..." : "Update password"}
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Protection</h2>
              <p className="text-sm text-slate-400">Security preferences for your account.</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(securityState).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-sm text-slate-400">
                    {key === "twoFactor" && "Require verification code on new devices"}
                    {key === "loginAlerts" && "Alert when a sign-in happens"}
                    {key === "deviceApproval" && "Approve trusted devices before access"}
                    {key === "sessionTimeout" && "Auto sign-out after inactivity"}
                  </p>
                </div>
                <button
                  onClick={() => updateSecurityState(key as keyof typeof securityState)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-gradient-to-r from-pink-500 to-orange-500" : "bg-slate-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-5xl bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium">Active devices</p>
            <p className="text-sm text-slate-400">2 trusted devices connected</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-slate-600 text-slate-100 rounded-xl hover:bg-slate-700 transition-colors">
          Review devices
        </button>
      </div>
    </div>
  );
}
