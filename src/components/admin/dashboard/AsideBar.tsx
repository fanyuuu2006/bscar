"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/libs/admin";
import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/utils/className";

type AsideBarProps = React.HTMLAttributes<HTMLElement>;

export const AsideBar = ({ className, ...rest }: AsideBarProps) => {
  const pathname = usePathname();
  const { admin, logOut, loading } = useAdmin();

  // 如果正在讀取中或未登入，不顯示側邊欄
  if (loading || !admin) return null;

  return (
    <aside className={cn(className)} {...rest}>
      <div className="h-full flex flex-col bg-(--background) border-r border-(--border) w-50 p-4">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight text-(--foreground)">
            管理後台
          </h2>
        </div>

        <nav className="w-full flex flex-col gap-2">
          {routes.map((route) => {
            const href = `/admin/dashboard${route.url}`;
            const isActive = route.isActive
              ? route.isActive(pathname)
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={route.url}
                href={href}
                className={cn(
                  "font-medium text-sm text-(--muted) flex items-center",
                  {
                    "text-(--foreground)": isActive,
                  },
                )}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto border-t border-(--border) flex items-center justify-center">
          <button
            onClick={logOut}
            className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-(--accent) text-(--background)"
          >
            登出
          </button>
        </div>
      </div>
    </aside>
  );
};
