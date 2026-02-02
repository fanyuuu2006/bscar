"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/libs/admin";
import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/utils/className";
import { useEffect, useRef, useState } from "react";
import { SupabaseLocation } from "@/types";
import { getLocationById } from "@/utils/backend";

type AsideBarProps = React.HTMLAttributes<HTMLElement>;

export const AsideBar = ({ className, ...rest }: AsideBarProps) => {
  const pathname = usePathname();
  const { admin, loading } = useAdmin();
  const [location, setLocation] = useState<SupabaseLocation | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      if (loading || !admin) return;
      getLocationById(admin.location_id)
        .then((res) => {
          if (res.success) {
            setLocation(res.data || null);
          }
        })
        .catch(() => {
          setLocation(null);
        });
    };
    fetchLocation();
  }, [admin, loading]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
  }, []);

  return (
    <aside className={cn("relative", className)} {...rest}>
      <div className="absolute left-full top-0 flex items-center">
        <button
          onClick={() => setCollapse((prev) => !prev)}
        >
          {collapse ? "▶" : "◀"}
        </button>
      </div>
      <div
        ref={ref}
        className="h-full will-change-[max-width] overflow-hidden"
        style={{
          maxWidth: collapse ? "0" : undefined,
        }}
      >
        <div className="h-full flex flex-col bg-(--background) border-r border-(--border) w-50 p-4">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold tracking-tight text-(--foreground)">
              {location ? `${location.city}-${location.branch}店` : "管理後台"}
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
        </div>
      </div>
    </aside>
  );
};
