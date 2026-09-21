"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Guard = "PUBLIC" | "ONBOARDING" | "APP" | "ADMIN";

type StoredUser = {
  email: string;
  role?: string;
  onboardingComplete?: boolean;
};

// Safe storage access for private browsing modes on iOS Safari & mobile Chrome
const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, val: string) => {
  try {
    if (typeof window !== "undefined") localStorage.setItem(key, val);
  } catch {}
};

const safeRemoveItem = (key: string) => {
  try {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  } catch {}
};

export default function AuthGuard({
  guard,
  children,
}: {
  guard: Guard;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Server and client initial state must match to prevent React hydration mismatch
  const [checked, setChecked] = useState<boolean>(guard === "PUBLIC");

  useEffect(() => {
    let isMounted = true;

    async function evaluateAuth() {
      let session = safeGetItem("mock_session");
      const rawUser = safeGetItem("mock_user");
      let parsedUser: StoredUser | null = null;
      try {
        if (rawUser) parsedUser = JSON.parse(rawUser);
      } catch {}

      let onboardingComplete = parsedUser?.onboardingComplete || safeGetItem("mock_onboarding") === "true";
      let isAdmin = parsedUser?.role === "admin" || safeGetItem("mock_admin") === "true";

      // 1. If fast local check immediately satisfies criteria, allow render
      if (guard === "APP" && session && onboardingComplete) {
        if (isMounted) setChecked(true);
      } else if (guard === "ONBOARDING" && session && !onboardingComplete) {
        if (isMounted) setChecked(true);
      } else if (guard === "ADMIN" && (isAdmin || session)) {
        if (isMounted) setChecked(true);
      } else if (guard === "PUBLIC" && !session) {
        if (isMounted) setChecked(true);
      }

      // 2. Validate / revalidate asynchronously in background with server cookie
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            session = data.user.email;
            parsedUser = data.user;
            onboardingComplete = data.user.onboardingComplete;
            if (data.user.role === "admin" || safeGetItem("mock_admin") === "true") {
              isAdmin = true;
              safeSetItem("mock_admin", "true");
            }

            safeSetItem("mock_session", data.user.email);
            safeSetItem("mock_user", JSON.stringify(data.user));
            safeSetItem("mock_onboarding", onboardingComplete ? "true" : "false");
          }
        } else if (res.status === 401) {
          // If in explicit mock admin mode, keep admin active for testing
          if (safeGetItem("mock_admin") !== "true") {
            session = null;
            parsedUser = null;
            onboardingComplete = false;
            isAdmin = false;
            safeRemoveItem("mock_session");
            safeRemoveItem("mock_user");
            safeRemoveItem("mock_onboarding");
          }
        }
      } catch {
        // network failure, fallback to cached state
      }

      if (!isMounted) return;

      // 3. Apply final authoritative routing if mismatch detected
      if (guard === "PUBLIC" && session) {
        startTransition(() => router.replace("/dashboard"));
        return;
      }

      if (guard === "ONBOARDING") {
        if (!session) {
          startTransition(() => router.replace("/login"));
          return;
        }
        if (session && onboardingComplete) {
          startTransition(() => router.replace("/dashboard"));
          return;
        }
      }

      if (guard === "APP") {
        if (!session) {
          startTransition(() => router.replace("/login"));
          return;
        }
        if (session && !onboardingComplete) {
          startTransition(() => router.replace("/onboarding/business-profile"));
          return;
        }
      }

      if (guard === "ADMIN" && !isAdmin && !session) {
        startTransition(() => router.replace("/admin/login"));
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
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 animate-pulse font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
