import AuthGuard from "../components/AuthGuard";
import AppNav from "../components/AppNav";
import Header from "../components/Header";
import AppThemeShell from "../components/AppThemeShell";
import LiveChatWidget from "../components/LiveChatWidget";

export const metadata = { title: "Dashboard" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard guard="APP">
      <AppThemeShell>
        <AppNav />
        <main className="min-h-screen md:ml-72 pb-20">
          <Header />
          <div className="pt-16 dashboard-compact">{children}</div>
        </main>
        <LiveChatWidget />
      </AppThemeShell>
    </AuthGuard>
  );
}

