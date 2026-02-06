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
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">下一筆預約</h3>
          {isLoading ? (
            <div className="animate-pulse space-y-4 mt-2">
              <div className="h-10 w-32 bg-gray-200 rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>
            </div>
          ) : nextBooking ? (
            <div className="flex flex-col gap-4 mt-1">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600 tracking-tight font-mono">
                    {formatDate("HH:mm", nextBooking.booking_time)}
                  </span>
                  <span className="text-sm font-medium text-(--muted)">
                    {formatDate("YYYY/MM/DD", nextBooking.booking_time)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {timeDisplay}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-(--border)">
                <div className="flex items-center gap-2 text-sm text-(--foreground)">
                  <UserOutlined className="text-(--muted)" />
                  <span className="font-medium">
                    {nextBooking.customer_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-(--muted)">
                  <PhoneOutlined />
                  <span>{nextBooking.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-(--muted)">
                  <CalendarOutlined />
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

        {nextBooking && (
          <div className="mt-auto pt-2">
            <Link
              href={`/admin/dashboard/booking/${nextBooking.id}`}
              className="group flex items-center text-sm font-medium text-(--muted) transition-colors duration-300 hover:text-(--primary)"
            >
              查看詳情
              <RightOutlined className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
