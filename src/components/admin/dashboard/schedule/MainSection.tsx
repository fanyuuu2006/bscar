"use client";
import { Calendar, DateCellProps } from "@/components/Calendar";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";
import { useMemo, useCallback } from "react";
import { useAdminToken } from "@/hooks/useAdminToken";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { bookingsByAdmin, getServices } from "@/utils/backend";
import { formatDate, getDaysInMonth } from "@/utils/date";
import { SupabaseBooking, SupabaseService } from "@/types";
import { BookingBadge } from "./BookingBadge";
import { CalendarOutlined } from "@ant-design/icons";
import { ScheduleCard } from "../ScheduleCard";
import { FormatDateNode } from "@/components/FormatDateNode";

const MAX_VISIBLE = 2;
const VALID_STATUS: SupabaseBooking['status'][] = ["pending", "confirmed", "completed"];

export const MainSection = () => {
  const { token } = useAdminToken();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewDate = useMemo(() => {
    const dateStr = searchParams.get("date");
    if (dateStr && !isNaN(Date.parse(dateStr))) {
      return new Date(dateStr);
    }
    return new Date();
  }, [searchParams]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const range = useMemo(() => {
    const lastDay = getDaysInMonth(year, month);
    const start = formatDate("YYYY-MM-DD", new Date(year, month, 1));
    const end = formatDate("YYYY-MM-DD", new Date(year, month, lastDay));
    return { start, end };
  }, [year, month]);

  const { data: resp } = useSWR(
    token ? ["admin-bookings-month", token, range.start, range.end] : null,
    () =>
      bookingsByAdmin(token!, {
        start_date: range.start,
        end_date: range.end,
        status: VALID_STATUS,
      }),
  );

  const { data: servicesResp } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    if (servicesResp?.data) {
      servicesResp.data.forEach((s) => map.set(s.id, s));
    }
    return map;
  }, [servicesResp]);

  const bookings = useMemo(() => resp?.data || [], [resp]);

  const bookingsMap = useMemo(() => {
    const map: Record<string, SupabaseBooking[]> = {};
    bookings.forEach((b) => {
      const dateStr = formatDate("YYYY-MM-DD", b.booking_time);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(b);
    });
    return map;
  }, [bookings]);

  const selectedBookings = useMemo(() => {
    const dateStr = formatDate("YYYY-MM-DD", viewDate);
    if (!bookingsMap[dateStr]) return [];
    return bookingsMap[dateStr].sort((a, b) =>
      a.booking_time.localeCompare(b.booking_time),
    );
  }, [bookingsMap, viewDate]);

  const handleChange = useCallback(
    (date: Date) => {
      const params = new URLSearchParams(searchParams);
      params.set("date", formatDate("YYYY-MM-DD", date));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const DateCell = useCallback(
    ({ date }: DateCellProps) => {
      const dateStr = formatDate("YYYY-MM-DD", date);
      const sortedBookings = [...(bookingsMap[dateStr] || [])].sort((a, b) =>
        a.booking_time.localeCompare(b.booking_time),
      );

      const visibleBookings = sortedBookings.slice(0, MAX_VISIBLE);
      const remainingCount = sortedBookings.length - MAX_VISIBLE;

      return (
        <div className="flex h-20 w-full flex-col gap-1 overflow-hidden py-1 px-0.5">
          {visibleBookings.map((booking) => (
            <BookingBadge
              className="w-full text-[10px]"
              key={booking.id}
              booking={booking}
            />
          ))}
          {remainingCount > 0 && (
            <span className="w-full rounded-md truncate bg-(--background) border border-(--border) py-0.5 text-center text-[10px] text-(--muted) font-medium">
              還有 {remainingCount} 筆
            </span>
          )}
        </div>
      );
    },
    [bookingsMap],
  );

  return (
    <section className="w-full flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">行事曆</h1>
        <div className="card px-4 py-2 rounded-full flex items-center justify-between gap-2">
          {VALID_STATUS.map((status) => {
            const statusInfo = statusMap[status];
            return (
            <div key={statusInfo.label} className="flex items-center gap-1">
              <span
                className={cn("h-3 w-3 rounded-full border", statusInfo.className)}
              />
              <span className="text-sm">{statusInfo.label}</span>
            </div>
          )})}
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ===== 日曆 ===== */}
        <div className="w-full">
          <Calendar
            className="sticky top-0 text-base"
            pastDateDisabled={false}
            value={viewDate}
            onChange={handleChange}
            DateCell={DateCell}
          />
        </div>
        {/* ===== 行程列表 ===== */}
        <div id="schedule-list" className="w-full h-full">
          <div className="card min-h-full flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-(--border)">
              <h2 className="text-lg font-bold text-(--foreground) flex items-center gap-2">
                <FormatDateNode date={[viewDate]}>MM月DD日</FormatDateNode>
              </h2>
              <span className="text-xs font-medium text-(--muted) bg-(--background) px-2.5 py-1 rounded-full border border-(--border)">
                共 {selectedBookings.length} 筆
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {selectedBookings.length > 0 ? (
                selectedBookings.map((b) => (
                  <ScheduleCard
                    key={b.id}
                    booking={b}
                    service={servicesMap.get(b.service_id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-(--muted)">
                  <div className="w-16 h-16 rounded-full bg-(--background) flex items-center justify-center mb-3 border border-(--border) border-dashed">
                    <CalendarOutlined className="text-2xl" />
                  </div>
                  <span className="text-sm font-medium">本日暫無預約</span>
                  <span className="text-xs mt-1">請選擇其他日期查看</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
