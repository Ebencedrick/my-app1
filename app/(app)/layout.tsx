import AuthGuard from "../components/AuthGuard";
import AppNav from "../components/AppNav";

export const metadata = { title: "Dashboard" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard guard="APP">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950">
        <AppNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
