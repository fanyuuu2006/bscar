"use client";
import { Calendar, DateCellProps } from "@/components/Calendar";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";
import { useMemo, useCallback } from "react";
import { useAdminToken } from "@/hooks/useAdminToken";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { bookingsByAdmin } from "@/utils/backend";
import { formatDate, getDaysInMonth, isSameDate } from "@/utils/date";
import { SupabaseBooking } from "@/types";
import { BookingBadge } from "./BookingBadge";
import { ScheduleListCard } from "./ScheduleListCard";

const MAX_VISIBLE = 2;
const VALID_STATUS: SupabaseBooking["status"][] = [
  "pending",
  "confirmed",
  "completed",
];

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

  const bookings = useMemo(() => resp?.data || [], [resp]);

  const bookingsMap = useMemo(() => {
    const map: Record<string, SupabaseBooking[]> = {};
    bookings.forEach((b) => {
      const dateStr = formatDate("YYYY-MM-DD", b.booking_time);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(b);
    });

    // 預先排序，避免在 DateCell 或 selectedBookings 中重複運算
    Object.values(map).forEach((list) => {
      list.sort((a, b) => a.booking_time.localeCompare(b.booking_time));
    });

    return map;
  }, [bookings]);

  const selectedBookings = useMemo(() => {
    const dateStr = formatDate("YYYY-MM-DD", viewDate);
    return bookingsMap[dateStr] || [];
  }, [bookingsMap, viewDate]);

  const handleChange = useCallback(
    (date: Date) => {
      if (isSameDate(date, viewDate)) return;
      const params = new URLSearchParams(searchParams?.toString());
      params.set("date", formatDate("YYYY-MM-DD", date));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [viewDate, searchParams, router, pathname],
  );

  const DateCell = useCallback(
    ({ date }: DateCellProps) => {
      const dateStr = formatDate("YYYY-MM-DD", date);
      // 使用已預先排序的資料
      const sortedBookings = bookingsMap[dateStr] || [];

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
                  className={cn(
                    "h-3 w-3 rounded-full border",
                    statusInfo.className,
                  )}
                />
                <span className="text-sm">{statusInfo.label}</span>
              </div>
            );
          })}
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
        <div className="w-full h-full">
          <ScheduleListCard
            className="min-h-full"
            bookings={selectedBookings}
            title={formatDate("YYYY年MM月DD日", viewDate)}
          />
        </div>
      </div>
    </section>
  );
};
