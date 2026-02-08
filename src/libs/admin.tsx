import { Route } from "@/types";

export const routes: Route[] = [
  {
    label: "主頁",
    url: "/",
    isActive: (pathname: string) => pathname === "/admin/dashboard",
  },
  {
    label: "預約管理",
    url: "/booking",
  },
  {
    label: "設定",
    url: "/settings",
  },
];
