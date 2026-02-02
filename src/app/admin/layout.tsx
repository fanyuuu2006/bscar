import { AdminProvider } from "@/contexts/AdminContext";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "後台",
  description: "後台頁面",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProvider>
      <AuthGuard>{children}</AuthGuard>
    </AdminProvider>
  );
}
