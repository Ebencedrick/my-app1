"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Guard = "PUBLIC" | "ONBOARDING" | "APP" | "ADMIN";

type StoredUser = {
  email: string;
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

  useEffect(() => {
    const session = typeof window !== "undefined" ? localStorage.getItem("mock_session") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("mock_user") : null;
    const parsedUser = storedUser ? (JSON.parse(storedUser) as StoredUser | null) : null;
    const onboardingComplete =
      typeof window !== "undefined"
        ? parsedUser?.onboardingComplete || localStorage.getItem("mock_onboarding") === "true"
        : false;
    const isAdmin = typeof window !== "undefined" ? localStorage.getItem("mock_admin") === "true" : false;

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
  }, [guard, router]);

  return <>{children}</>;
}

