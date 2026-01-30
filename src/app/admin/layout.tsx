import { AdminProvider } from "@/contexts/AdminContext";
import { Metadata } from "next";
import { AsideBar } from "@/components/admin/AsideBar";

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
      <div className="flex h-full">
        <AsideBar className="hidden md:block shrink-0 sticky left-0 h-full" />
        <div role="main" className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </AdminProvider>
  );
}
