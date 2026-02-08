"use client";
import { Calender, DateCellProps } from "@/components/Calender";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";
import { useState, useMemo, useCallback } from "react";
import { useAdminToken } from "@/hooks/useAdminToken";
import useSWR from "swr";
import { bookingsByAdmin, getServices } from "@/utils/backend";
import { formatDate, getDaysInMonth } from "@/utils/date";
import { SupabaseBooking, SupabaseService } from "@/types";
import { BookingBadge } from "./BookingBadge";
import { ClockCircleOutlined } from "@ant-design/icons";
import { ScheduleCard } from "../ScheduleCard";

const MAX_VISIBLE = 2;

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

  const { data: resp, mutate } = useSWR(
    token ? ["admin-bookings-month", token, range.start, range.end] : null,
    () =>
      bookingsByAdmin(token!, { start_date: range.start, end_date: range.end }),
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

  const DateCell = useCallback(
    ({ date }: DateCellProps) => {
      const dateStr = formatDate("YYYY-MM-DD", date);
      const sortedBookings = [...(bookingsMap[dateStr] || [])].sort((a, b) =>
        a.booking_time.localeCompare(b.booking_time),
      );

      const visibleBookings = sortedBookings.slice(0, MAX_VISIBLE);
      const remainingCount = sortedBookings.length - MAX_VISIBLE;

      return (
        <div className="text-xs flex w-full h-20 flex-col gap-1 overflow-hidden p-1">
          {visibleBookings.map((booking) => {
            return (
              <BookingBadge
                key={booking.id}
                booking={booking}
                mutate={mutate}
              />
            );
          })}
          {remainingCount > 0 && (
            <button
              onClick={() => setViewDate(date)}
              className="text-(--muted) flex items-center justify-center gap-1 overflow-hidden truncate rounded-md px-1.5 py-1 font-medium"
            >
              (+{remainingCount} 筆預約)
            </button>
          )}
        </div>
      );
    },
    [bookingsMap, mutate],
  );

  return (
    <section className="w-full flex flex-col gap-4 p-4">
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
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ===== 日曆 ===== */}
        <div className="w-full">
          <Calender
            className="text-md"
            pastDateDisabled={false}
            value={viewDate}
            onChange={setViewDate}
            DateCell={DateCell}
          />
        </div>
        {/* ===== 行程列表 ===== */}
        <div id="schedule-list" className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--foreground) flex items-center gap-2">
              <span>{formatDate("MM月DD日", viewDate)}</span>
              <span className="text-(--muted) font-normal text-sm">
                行程列表
              </span>
            </h2>
            <span className="text-xs text-(--muted) bg-(--background) px-2 py-1 rounded-full border border-(--border)">
              {selectedBookings.length} 筆預約
            </span>
          </div>

          <div className="custom-scrollbar flex flex-col gap-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
            {selectedBookings.length > 0 ? (
              selectedBookings.map((b) => (
                <ScheduleCard
                  key={b.id}
                  booking={b}
                  service={servicesMap.get(b.service_id)}
                  mutate={mutate}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-(--muted)">
                <ClockCircleOutlined className="text-3xl mb-2" />
                <span className="text-sm">暫無預約</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
