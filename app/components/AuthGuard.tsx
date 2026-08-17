"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Guard = "PUBLIC" | "ONBOARDING" | "APP" | "ADMIN";

export default function AuthGuard({
  guard,
  children,
}: {
  guard: Guard;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Mock session flags for scaffolding/demo purposes.
    // Replace with NextAuth/session calls in real implementation.
    const session = typeof window !== "undefined" ? localStorage.getItem("mock_session") : null;
    const onboardingComplete = typeof window !== "undefined" ? localStorage.getItem("mock_onboarding") === "true" : false;
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
