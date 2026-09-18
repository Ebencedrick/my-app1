"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Guard = "PUBLIC" | "ONBOARDING" | "APP" | "ADMIN";

type StoredUser = {
  email: string;
  role?: string;
  onboardingComplete?: boolean;
};

export default function AuthGuard({
  guard,
  children,
}: {
  guard: Guard;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function evaluateAuth() {
      // 1. Initial fast local check
      let session = typeof window !== "undefined" ? localStorage.getItem("mock_session") : null;
      let storedUser = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null;
      let parsedUser = storedUser ? (JSON.parse(storedUser) as StoredUser | null) : null;
      let onboardingComplete =
        typeof window !== "undefined"
          ? parsedUser?.onboardingComplete || localStorage.getItem("mock_onboarding") === "true"
          : false;
      let isAdmin = typeof window !== "undefined" ? (parsedUser?.role === "admin" || localStorage.getItem("mock_admin") === "true") : false;

      // 2. Verify with server session cookie
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            session = data.user.email;
            parsedUser = data.user;
            onboardingComplete = data.user.onboardingComplete;
            isAdmin = data.user.role === "admin";

            localStorage.setItem("mock_session", data.user.email);
            localStorage.setItem("mock_user", JSON.stringify(data.user));
            localStorage.setItem("mock_onboarding", onboardingComplete ? "true" : "false");
            if (isAdmin) {
              localStorage.setItem("mock_admin", "true");
            } else {
              localStorage.removeItem("mock_admin");
            }
          }
        } else if (res.status === 401) {
          // No active server session
          session = null;
          parsedUser = null;
          onboardingComplete = false;
          isAdmin = false;
          localStorage.removeItem("mock_session");
          localStorage.removeItem("mock_user");
          localStorage.removeItem("mock_onboarding");
          localStorage.removeItem("mock_admin");
        }
      } catch (err) {
        // Network failure; fallback gracefully to cached state
      }

      if (!isMounted) return;

      // 3. Apply route guards
      if (guard === "PUBLIC" && session) {
        router.replace("/dashboard");
        return;
      }

      if (guard === "ONBOARDING") {
        if (!session) {
          router.replace("/login");
          return;
        }
        if (session && onboardingComplete) {
          router.replace("/dashboard");
          return;
        }
      }

      if (guard === "APP") {
        if (!session) {
          router.replace("/login");
          return;
        }
        if (session && !onboardingComplete) {
          router.replace("/onboarding/business-profile");
          return;
        }
      }

      if (guard === "ADMIN" && !isAdmin) {
        router.replace("/admin/login");
        return;
      }

      setChecked(true);
    }

    evaluateAuth();

    return () => {
      isMounted = false;
    };
  }, [guard, router]);

  if (!checked && guard !== "PUBLIC") {
    // Show smooth loading placeholder while validating session
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
