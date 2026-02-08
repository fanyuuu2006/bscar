"use client";
import { DateCellProps } from "@/components/Calender";
import { useAdminToken } from "@/hooks/useAdminToken";
import useSWR from "swr";
import { statusMap } from "@/libs/booking";
import { bookingsByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { FormatDateNode } from "@/components/FormatDateNode";

export const DateCell = ({ date }: DateCellProps) => {
  const { token } = useAdminToken();
  const { data: resp } = useSWR(
    token ? ["admin-booking-by-date", token, date] : null,
    () => {
      const strDate = formatDate("YYYY-MM-DD", date);
      return bookingsByAdmin(token!, {
        start_date: strDate,
        end_date: strDate,
      });
    },
  );

  const bookings = resp?.data || [];

  // Sort bookings by time
  const sortedBookings = [...bookings].sort((a, b) =>
    a.booking_time.localeCompare(b.booking_time),
  );

  const MAX_VISIBLE = 3;
  const visibleBookings = sortedBookings.slice(0, MAX_VISIBLE);
  const remainingCount = sortedBookings.length - MAX_VISIBLE;

  return (
    <div className="flex h-28 w-full flex-col gap-1 overflow-hidden px-1 py-1">
      {visibleBookings.map((booking) => {
        const status = statusMap[booking.status];
        return (
          <div
            key={booking.id}
            className={cn(
              "group flex items-center gap-1 overflow-hidden truncate rounded-md px-1.5 py-1 text-[11px] font-medium",
              status.className,
              "border-0", // Remove border to reduce visual noise
            )}
            title={`${formatDate("HH:mm", booking.booking_time)} - ${booking.customer_name} (${status.label})`}
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
          還有 {remainingCount} 筆行程
        </div>
      )}
    </div>
  );
};
