import AuthGuard from "../components/AuthGuard";
import AppNav from "../components/AppNav";
import Header from "../components/Header";

export const metadata = { title: "Dashboard" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard guard="APP">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950">
        <AppNav />
        <main className="min-h-screen md:ml-72 pb-20">
          <Header />
          <div className="pt-16 dashboard-compact">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
