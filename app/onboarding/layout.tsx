import AuthGuard from "../components/AuthGuard";

export const metadata = { title: "Onboarding" };

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard guard="ONBOARDING">{children}</AuthGuard>;
}
