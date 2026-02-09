import { SupabaseBooking } from "@/types";

export const bookingSteps = [
  { value: "location", label: "地點" },
  { value: "service", label: "服務" },
  { value: "time", label: "時間" },
  { value: "info", label: "填寫資料" },
] as const;


export const statusMap: Record<
  SupabaseBooking["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "待處理",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  confirmed: {
    className: "bg-blue-50 text-blue-700 border-blue-200",
    label: "已確認",
  },
  cancelled: {
    label: "已取消",
    className: "bg-slate-100 text-slate-600 border-slate-300",
  },
  completed: {
    label: "已完成",
    className: "bg-green-100 text-green-800 border-green-300",
  },
};