"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    businessName: "",
    industry: "E-commerce",
    website: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFormData({
              email: data.user.email || "",
              phone: data.user.phone || "",
              businessName: data.user.businessName || "",
              industry: data.user.industry || "E-commerce",
              website: data.user.website || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          industry: formData.industry,
          website: formData.website,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user) {
          localStorage.setItem("mock_user", JSON.stringify(data.user));
          localStorage.setItem("mock_session", data.user.email);
        }
        setSuccessMessage("Account credentials and business profile updated successfully in the database!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Failed to update profile credentials");
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setErrorMessage("Network error updating credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long!");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Security password updated successfully in the database!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setErrorMessage("Network error updating password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-pink-400 hover:text-pink-300 mb-2 flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Profile & Credentials</h1>
        <p className="text-base text-slate-400">Manage your login credentials, personal details, and business settings</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300 text-sm">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="ml-auto text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="ml-auto text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Profile & Contact Credentials */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-pink-400" />
            </div>
            Account Credentials
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Login Email Address *
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11"
                  placeholder="name@example.com"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Updating your email updates your login credentials across the entire platform.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number (Mobile Money)
              </label>
              <div className="relative">
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11"
                  placeholder="+237 6XX XXX XXX"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business Name
              </label>
              <div className="relative">
                <input
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11"
                  placeholder="Your business or brand name"
                />
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300 cursor-pointer"
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Technology">Technology</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Website / Social Page
                </label>
                <div className="relative">
                  <input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11"
                    placeholder="https://yourwebsite.com"
                  />
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Credentials...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile & Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-pink-400" />
            </div>
            Change Security Password
          </h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11 pr-11"
                  placeholder="Enter current password"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                New Password (min 8 characters) *
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength={8}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11 pr-11"
                  placeholder="Enter new password"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength={8}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300 pl-11 pr-11"
                  placeholder="Repeat new password"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full py-3 border-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPasswordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password in Database...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
