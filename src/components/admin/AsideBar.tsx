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
    <aside
      className={cn(
        className,
      )}
      {...rest}
    >
      <div className="h-full flex flex-col bg-(--background) border-r border-(--border) w-64 p-4">
        <nav className="w-full flex flex-col gap-1">
          {routes.map((route) => {
            const href = `/admin${route.url}`;
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={route.url}
                href={href}
                className={cn(
                  "px-4 py-2.5 font-medium text-sm text-(--muted) flex items-center",
                  {
                    'text-(--foreground)': isActive,
                  }
                )}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto border-t border-(--border)">
          <button
            onClick={logOut}
            className="w-full px-4 py-2.5 text-sm font-medium text-(--muted) transition-colors rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center gap-2 group"
          >
            <span className="group-hover:translate-x-1 transition-transform">
              登出
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
