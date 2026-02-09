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
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  confirmed: {
    label: "已確認",
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  cancelled: {
    label: "已取消",
    className: "bg-rose-100 text-rose-800 border-rose-300",
  },
  completed: {
    label: "已完成",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
};
export const actionMap = {
  edit: {
    label: "編輯",
    className: "bg-violet-100 text-violet-800 border-violet-300",
  },
  delete: {
    label: "刪除",
    className: "bg-rose-200 text-rose-900 border-rose-400",
  },
};
