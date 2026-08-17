import AuthGuard from "../components/AuthGuard";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard guard="ADMIN">{children}</AuthGuard>;
}
