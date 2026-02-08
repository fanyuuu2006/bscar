"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin, getServices } from "@/utils/backend";
import { useEffect, useMemo, useState } from "react";
import { SummaryCard, SummaryCardProps } from "./SummaryCard";
import {
  AlertOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import { formatDate, formatRelativeTime } from "@/utils/date";
import { SupabaseService } from "@/types";
import { FormatDateNode } from "@/components/FormatDateNode";
import { cn } from "@/utils/className";

export const MainSection = () => {
  const { token } = useAdminToken();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = 60 * 1000; // 每分鐘更新一次
    // 每更新一次時間，讓倒數計時保持準確
    const timer = setInterval(() => {
      setNow(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const { data: pendingRes, isLoading: pendingIsLoading } = useSWR(
    token ? ["admin-booking-pending", token] : null,
    () =>
      bookingsByAdmin(token!, {
        status: ["pending"],
      }),
  );
  const strToday = useMemo(() => formatDate("YYYY-MM-DD", new Date()), []);

  const { data: todayRes, isLoading: todayIsLoading } = useSWR(
    token ? ["admin-booking-today", token] : null,
    () => {
      return bookingsByAdmin(token!, {
        start_date: strToday,
        end_date: strToday,
        status: ["confirmed", "completed"],
      });
    },
  );

  // Next Booking Logic
  const { data: bookingsRequest, isLoading: nextBookingIsLoading } = useSWR(
    token ? ["admin-next-booking", token] : null,
    () => {
      return bookingsByAdmin(token!, {
        start_date: strToday,
        status: ["confirmed"],
        count: 50,
      });
    },
    {
      refreshInterval: 60 * 1000, // 每分鐘自動刷新
    },
  );

  const { data: servicesRequest } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    if (servicesRequest?.data) {
      servicesRequest.data.forEach((s) => map.set(s.id, s));
    }
    return map;
  }, [servicesRequest]);

  const nextBooking = useMemo(() => {
    if (!bookingsRequest?.data) return null;

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
  }, [bookingsRequest, now]);

  const service = nextBooking ? servicesMap.get(nextBooking.service_id) : null;

  const timeDisplay = useMemo(() => {
    if (!nextBooking) return "";
    return formatRelativeTime(nextBooking.booking_time, now);
  }, [nextBooking, now]);

  const summarys: SummaryCardProps[] = useMemo(() => {
    const pendingCount = pendingRes?.data?.length ?? 0;
    const todayCount = todayRes?.data?.length ?? 0;
    return [
      {
        label: "待處理預約",
        Icon: AlertOutlined,
        href: `/admin/dashboard/booking?status=pending`,
        children: pendingIsLoading ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-red-600 tracking-tight font-mono">
                {pendingCount}
              </span>
              <span className="text-base text-(--muted) font-medium">筆</span>
            </div>
          </div>
        ),
      },
      {
        label: "今日預約總數",
        Icon: CalendarOutlined,
        href: `/admin/dashboard/booking?start_date=${strToday}&end_date=${strToday}&status=confirmed&status=completed`,
        children: todayIsLoading ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-blue-600 tracking-tight font-mono">
                {todayCount}
              </span>
              <span className="text-base text-(--muted) font-medium">筆</span>
            </div>
          </div>
        ),
      },
      {
        label: "下一筆預約",
        Icon: ClockCircleOutlined,
        href: nextBooking
          ? `/admin/dashboard/booking/${nextBooking.id}`
          : "/admin/dashboard/booking", // Fallback link
        children: nextBookingIsLoading ? (
          <div className="flex-1 animate-pulse flex flex-col justify-center space-y-3">
            <div className="h-8 w-24 bg-gray-100 rounded-md" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          </div>
        ) : nextBooking ? (
          <div className="flex-1 flex flex-col justify-center gap-2">
            {/* 時間顯示 */}
            <div className="flex flex-col gap-1">
              <FormatDateNode
                date={[nextBooking.booking_time]}
                className="flex flex-wrap items-baseline gap-2"
              >
                <span className="text-4xl font-bold text-green-600 tracking-tight font-mono">
                  HH:mm
                </span>

                <span className="text-sm text-(--muted) font-medium mt-1">
                  YYYY/MM/DD
                </span>
              </FormatDateNode>

              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-900/15 px-2.5 py-1 rounded-full w-fit">
                {timeDisplay}
              </span>
            </div>

            {/* 資訊顯示 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-(--muted)">
              {[
                {
                  icon: UserOutlined,
                  value: nextBooking.customer_name || "-",
                },
                {
                  icon: PhoneOutlined,
                  value: nextBooking.customer_phone || "-",
                },
                {
                  icon: StarOutlined,
                  value: service ? service.name : "-",
                },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center gap-1.5")}>
                  <item.icon className="shrink-0 text-[10px]" />
                  <span
                    className={"font-medium font-mono truncate max-w-[7em]"}
                    title={item.value}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-4 text-(--muted)">
            <ClockCircleOutlined className="text-3xl mb-2 opacity-20" />
            <span className="text-sm">暫無預約</span>
          </div>
        ),
      },
    ];
  }, [
    pendingRes?.data?.length,
    todayRes?.data?.length,
    pendingIsLoading,
    strToday,
    todayIsLoading,
    nextBooking,
    nextBookingIsLoading,
    timeDisplay,
    service,
  ]);

  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">主頁</h1>
      {/* ===== 統計卡片 ===== */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {summarys.map((summary) => (
          <SummaryCard key={summary.label} {...summary} />
        ))}
      </div>
    </section>
  );
};
