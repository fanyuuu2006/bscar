"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { useMemo } from "react";
import { SummaryCard, SummaryCardProps } from "./SummaryCard";
import { AlertOutlined, CalendarOutlined, } from "@ant-design/icons";
import useSWR from "swr";
import { formatDate } from "@/utils/date";

export const MainSection = () => {
  const { token } = useAdminToken();

  const { data: pendingRes, isLoading: pendingIsLoading } = useSWR(
    token ? ["admin-booking-pending", token] : null,
    () =>
      bookingsByAdmin(token!, {
        status: "pending",
      }),
  );
  const strToday = useMemo(() => formatDate("YYYY-MM-DD", new Date()), []);

  const { data: todayRes, isLoading: todayIsLoading } = useSWR(
    token ? ["admin-booking-today", token] : null,
    () => {
      return bookingsByAdmin(token!, {
        start_date: strToday,
        end_date: strToday,
        status: "confirmed",
      });
    },
  );

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
        href: `/admin/dashboard/booking?start_date=${strToday}&end_date=${strToday}`,
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
    ];
  }, [
    pendingRes?.data?.length,
    todayRes?.data?.length,
    pendingIsLoading,
    strToday,
    todayIsLoading,
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
