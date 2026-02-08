"use client";
import { DateCellProps } from "@/components/Calender";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { FormatDateNode } from "@/components/FormatDateNode";
import { SupabaseBooking } from "@/types";

const MAX_VISIBLE = 3;

interface DateCellPropsWithData extends DateCellProps {
  bookings: SupabaseBooking[];
}

export const DateCell = ({ bookings }: DateCellPropsWithData) => {
  const bookingsList = bookings || [];
  const sortedBookings = [...bookingsList].sort((a, b) =>
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
};
