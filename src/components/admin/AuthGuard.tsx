"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 如果正在載入中，什麼都不做
    if (loading) return;

    // 如果沒有管理員權限，且不在登入頁面，導向登入頁
    if (!admin && pathname !== "/admin") {
      router.replace("/admin");
    }
    
    // 如果已經有管理員權限，且在登入頁面，導向儀表板
    if (admin && pathname === "/admin") {
      router.replace("/admin/dashboard");
    }
  }, [admin, loading, pathname, router]);

  // 處理載入中狀態 (可選：加入 Loading Spinner)
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 如果沒有登入且不在登入頁，顯示保留(防閃爍)或null
  if (!admin && pathname !== "/admin") {
    return null;
  }

  return <>{children}</>;
};
