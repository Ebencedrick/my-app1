"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  email: string;
  businessName?: string;
  industry?: string;
  website?: string;
  campaignGoal?: string;
  audience?: string;
  budget?: string;
  platformFocus?: string[];
  onboardingComplete?: boolean;
};

export default function BusinessProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    website: "",
    campaignGoal: "",
    audience: "",
    budget: "",
    platformFocus: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawUser = localStorage.getItem("mock_user");
      const currentUser = rawUser ? (JSON.parse(rawUser) as StoredUser) : null;

      const nextUser = {
        ...(currentUser ?? {}),
        businessName: formData.businessName,
        industry: formData.industry,
        website: formData.website,
        campaignGoal: formData.campaignGoal,
        audience: formData.audience,
        budget: formData.budget,
        platformFocus: formData.platformFocus,
      };

      // persist locally as before
      localStorage.setItem("mock_user", JSON.stringify(nextUser));

      // send onboarding profile to server to create user and seed wallet (dev mode)
      if (nextUser?.email) {
        try {
          await fetch('/api/onboarding/profile', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email: nextUser.email, name: nextUser.businessName || nextUser.email, initialTopUp: 20 }),
          });
        } catch (e) {
          // non-fatal; continue with local flow
          console.warn('onboarding API failed', e);
        }
      }

      router.push("/onboarding/verify");
    } catch (err) {
      console.error(err);
      alert("Your business profile could not be saved. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platformFocus: prev.platformFocus.includes(platform)
        ? prev.platformFocus.filter((item) => item !== platform)
        : [...prev.platformFocus, platform],
    }));
  };

  const industries = [
    "E-commerce",
    "Food & Beverage",
    "Fashion & Apparel",
    "Technology",
    "Health & Wellness",
    "Education",
    "Entertainment",
    "Real Estate",
    "Professional Services",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-4">
      <div className="max-w-3xl w-full">
        <div className="mb-4">
          <p className="text-pink-300 text-xs uppercase tracking-[0.2em] font-medium">Step 1 of 3</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Tell us about your business</h1>
          <p className="text-slate-400 mt-1 text-sm">This helps us understand your market and build a smarter campaign strategy for you.</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-1.5 rounded-full" style={{ width: "33%" }}></div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="businessName" className="block text-xs font-medium text-slate-200 mb-1.5">
                Business Name *
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white placeholder-slate-500 text-sm"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-xs font-medium text-slate-200 mb-1.5">
                Industry *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white text-sm"
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="website" className="block text-xs font-medium text-slate-200 mb-1.5">
                Website or Social Page
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white placeholder-slate-500 text-sm"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label htmlFor="campaignGoal" className="block text-xs font-medium text-slate-200 mb-1.5">
                What are you trying to promote? *
              </label>
              <textarea
                id="campaignGoal"
                name="campaignGoal"
                value={formData.campaignGoal}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white placeholder-slate-500 text-sm resize-none"
                placeholder="Describe the product, service, offer, or campaign you want to advertise."
              />
            </div>

            <div>
              <label htmlFor="audience" className="block text-xs font-medium text-slate-200 mb-1.5">
                Target audience
              </label>
              <input
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white placeholder-slate-500 text-sm"
                placeholder="e.g. Women 25-40 in Accra and Kumasi"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-xs font-medium text-slate-200 mb-1.5">
                Project budget range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white text-sm"
              >
                <option value="">Select your approximate budget</option>
                <option value="Under $200">Under $200</option>
                <option value="$200 - $500">$200 - $500</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                <option value="$3,000+">$3,000+</option>
              </select>
            </div>

            <div>
              <p className="block text-xs font-medium text-slate-200 mb-1.5">Preferred ad platforms</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Facebook', 'Instagram', 'TikTok', 'Google'].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      formData.platformFocus.includes(platform)
                        ? "bg-gradient-to-r from-pink-500 to-orange-500 border-pink-500 text-white"
                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 border border-slate-700 text-slate-200 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

