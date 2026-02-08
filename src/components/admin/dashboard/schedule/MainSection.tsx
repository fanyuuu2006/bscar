"use client";
import { Calender, DateCellProps } from "@/components/Calender";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";
import { useState, useMemo, useCallback } from "react";
import { useAdminToken } from "@/hooks/useAdminToken";
import useSWR from "swr";
import { bookingsByAdmin } from "@/utils/backend";
import { formatDate, getDaysInMonth } from "@/utils/date";
import { SupabaseBooking } from "@/types";
import { FormatDateNode } from "@/components/FormatDateNode";

const MAX_VISIBLE = 3;

export const MainSection = () => {
  const { token } = useAdminToken();
  const [viewDate, setViewDate] = useState(new Date());

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
      bookingsByAdmin(token!, { start_date: range.start, end_date: range.end }),
  );

  const bookings = useMemo(() => resp?.data || [], [resp]);

  // Group bookings by date
  const bookingsMap = useMemo(() => {
    const map: Record<string, SupabaseBooking[]> = {};
    bookings.forEach((b) => {
      const dateStr = formatDate("YYYY-MM-DD", b.booking_time);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(b);
    });
    return map;
  }, [bookings]);

  const DateCell = useCallback(
    ({ date }: DateCellProps) => {
      const dateStr = formatDate("YYYY-MM-DD", date);
      const sortedBookings = [...(bookingsMap[dateStr] || [])].sort((a, b) =>
        a.booking_time.localeCompare(b.booking_time),
      );

      const visibleBookings = sortedBookings.slice(0, MAX_VISIBLE);
      const remainingCount = sortedBookings.length - MAX_VISIBLE;

      return (
        <div className="flex h-28 w-full flex-col gap-1 overflow-hidden p-1">
          {visibleBookings.map((booking) => {
            const status = statusMap[booking.status];
            return (
              <div
                key={booking.id}
                className={cn(
                  "flex items-center border gap-1 overflow-hidden truncate rounded-md px-1.5 py-1 text-xs font-medium",
                  status.className,
                )}
                title={`${formatDate("HH:mm", booking.booking_time)} - ${booking.customer_name}`}
              >
                <FormatDateNode
                  date={[booking.booking_time]}
                  className="shrink-0 font-bold"
                >
                  HH:mm
                </FormatDateNode>
                <span className="truncate">{booking.customer_name}</span>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className="mt-auto pb-1 text-center text-[10px] font-medium text-(--muted)">
              還有 {remainingCount} 筆預約
            </div>
          )}
        </div>
      );
    },
    [bookingsMap],
  );

  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">日程表</h1>
        <div className="flex flex-wrap gap-3">
          {Object.values(statusMap).map((status) => (
            <div key={status.label} className="flex items-center gap-1.5">
              <span
                className={cn("h-3 w-3 rounded-full border", status.className)}
              />
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-full">
        <Calender
          className="text-lg p-4"
          pastDateDisabled={false}
          value={viewDate}
          onChange={setViewDate}
          DateCell={DateCell}
        />
      </div>
    </section>
  );
};
