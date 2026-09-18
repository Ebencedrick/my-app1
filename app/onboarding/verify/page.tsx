"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.phone) setPhone(user.phone);
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
    }, 800);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/onboarding/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone, kycDocumentName: documentFile?.name }),
      });

      const data = await res.json().catch(() => ({}));
      if (data.user) {
        localStorage.setItem("mock_user", JSON.stringify(data.user));
      } else {
        const storedUser = localStorage.getItem("mock_user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user) {
          user.phoneVerified = true;
          localStorage.setItem("mock_user", JSON.stringify(user));
        }
      }

      router.push("/onboarding/plan");
    } catch (err) {
      console.error("Verification error:", err);
      router.push("/onboarding/plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setDocumentFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 flex items-center justify-center px-4 py-4">
      <div className="max-w-2xl w-full">
        <div className="mb-4">
          <p className="text-pink-300 text-xs uppercase tracking-[0.2em] font-medium">Step 2 of 3</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Verify your account</h1>
          <p className="text-slate-400 mt-1 text-sm">Secure your business profile and confirm your contact details before launching.</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-1.5 rounded-full" style={{ width: "66%" }}></div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-1">Phone Verification</h2>
            <p className="text-slate-400 text-sm">We will send a verification code to confirm your mobile number.</p>
          </div>

          {!isCodeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-slate-200 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white placeholder-slate-500 text-sm"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-xs font-medium text-slate-200 mb-1.5">
                  Enter Verification Code *
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-3 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-white text-center text-xl tracking-[0.4em]"
                  placeholder="000000"
                />
                <p className="text-sm text-slate-400 mt-1">Code sent to {phone}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:from-pink-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => setIsCodeSent(false)}
                className="w-full py-2 text-pink-400 hover:text-pink-300 transition-colors text-sm"
              >
                Change phone number
              </button>
            </form>
          )}

          <div className="border-t border-slate-700 mt-5 pt-4">
            <h3 className="text-base font-semibold text-white mb-2">Optional: Business document</h3>
            <p className="text-slate-400 text-xs mb-3">Upload a registration document for higher account limits and accelerated approvals.</p>

            <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center">
              <input type="file" id="document" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              <label htmlFor="document" className="cursor-pointer">
                <div className="text-3xl mb-1">📄</div>
                {documentFile ? (
                  <p className="text-white font-medium text-sm">{documentFile.name}</p>
                ) : (
                  <>
                    <p className="text-slate-200 font-medium text-sm">Click to upload</p>
                    <p className="text-slate-400 text-xs">PDF, JPG, or PNG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 border border-slate-700 text-slate-200 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => router.push("/onboarding/plan")}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 rounded-lg font-semibold transition-colors text-sm"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

