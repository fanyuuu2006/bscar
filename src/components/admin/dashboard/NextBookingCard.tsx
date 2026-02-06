"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseService } from "@/types";
import { bookingsByAdmin, getServices } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";

type NextBookingCardProps = React.HTMLAttributes<HTMLDivElement>;

export const NextBookingCard = ({
  className,
  ...rest
}: NextBookingCardProps) => {
  const { token } = useAdminToken();

  // 1. 獲取預約資料
  const { data: bookingsRequest, isLoading } = useSWR(
    token ? ["admin-next-booking", token] : null,
    () => {
      const today = new Date();
      // 使用 YYYY-MM-DD 格式，讓後端從今天開始抓取
      const dateStr = formatDate("YYYY-MM-DD", today);
      return bookingsByAdmin(token!, {
        start_date: dateStr,
        status: "confirmed",
        count: 50, 
      });
    },
    {
      refreshInterval: 60 * 1000, // 每分鐘自動刷新
    },
  );

  // 2. 獲取服務列表 (用於顯示服務名稱)
  const { data: servicesRequest } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    if (servicesRequest?.data) {
      servicesRequest.data.forEach((s) => map.set(s.id, s));
    }
    return map;
  }, [servicesRequest]);

  // 3. 計算下一筆預約
  const nextBooking = useMemo(() => {
    if (!bookingsRequest?.data) return null;

    const now = new Date();
    const validBookings = bookingsRequest.data.filter((b) => {
      const bookingTime = new Date(b.booking_time);
      return bookingTime > now;
    });

    // 依時間排序 (最近的在前)
    validBookings.sort(
      (a, b) =>
        new Date(a.booking_time).getTime() - new Date(b.booking_time).getTime(),
    );

    return validBookings[0] || null;
  }, [bookingsRequest]);

  const service = nextBooking ? servicesMap.get(nextBooking.service_id) : null;

  // 4. 計算相對時間顯示 (例如：2 小時後)
  const timeDisplay = useMemo(() => {
    if (!nextBooking) return "";
    const bookingTime = new Date(nextBooking.booking_time);
    const now = new Date();
    const diffMs = bookingTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins} 分鐘後`;
    if (diffHours < 24) return `${diffHours} 小時 ${diffMins % 60} 分鐘後`;
    return formatDate("MM/DD HH:mm", bookingTime);
  }, [nextBooking]);

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">下一筆預約</h3>
          {nextBooking && (
            <Link
              href={`/admin/dashboard/booking/${nextBooking.id}`}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              查看詳情 <RightOutlined />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-gray-100 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="h-16 bg-gray-100 rounded w-full"></div>
          </div>
        ) : nextBooking ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 font-mono">
                  {formatDate("HH:mm", nextBooking.booking_time)}
                </div>
                <div className="text-xs font-medium mt-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full w-fit">
                  {timeDisplay}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatDate("YYYY/MM/DD", nextBooking.booking_time)}
                </div>
                <div
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full inline-block mt-1",
                    nextBooking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700",
                  )}
                >
                  {nextBooking.status === "confirmed" ? "已確認" : "待處理"}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-(--border) my-1"></div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <UserOutlined className="text-(--muted)" />
                <span className="font-medium">{nextBooking.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <PhoneOutlined className="text-(--muted)" />
                <span>{nextBooking.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarOutlined className="text-(--muted)" />
                <span>{service?.name || "未知服務"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-(--muted)">
            <ClockCircleOutlined className="text-4xl mb-2 opacity-20" />
            <span className="text-sm">目前無即將到來的預約</span>
          </div>
        )}
      </div>
    </div>
  );
};
