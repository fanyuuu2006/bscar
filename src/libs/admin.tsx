import { Route } from "@/types";

export const routes: Route[] = [
  {
    label: "儀表板",
    url: "/",
    isActive: (pathname: string) => pathname === "/admin/dashboard",
  },
  {
    label: "預約管理",
    url: "/booking",
  },
  {
    label: "行事曆",
    url: "/schedule"
  },
  {
    label: "設定",
    url: "/settings",
  },
];
