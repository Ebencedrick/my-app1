import AuthGuard from "../components/AuthGuard";

export const metadata = { title: "Campaigns" };

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard guard="APP">{children}</AuthGuard>;
}
