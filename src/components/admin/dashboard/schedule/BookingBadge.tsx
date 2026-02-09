import { FormatDateNode } from "@/components/FormatDateNode";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useCallback } from "react";

type BookingBadgeProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    booking: SupabaseBooking;
  }
>;
export const BookingBadge = ({
  booking,
  className,
  onClick,
  ...rest
}: BookingBadgeProps) => {
  const status = statusMap[booking.status] ?? {
    label: booking.status,
    className: "",
  };
  const modal = useBookingModal();
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      modal.open(booking);
      if (onClick) {
        onClick(e);
      }
    },
    [modal, booking, onClick],
  );
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center border gap-1 truncate rounded-md p-1 font-medium",
        status.className,
        className,
      )}
      title={`${booking.customer_name} - ${status.label} - ${formatDate("YYYY/MM/DD HH:mm", booking.booking_time)}`}
      {...rest}
    >
      <FormatDateNode
        date={[booking.booking_time]}
        className="shrink-0 font-bold"
      >
        HH:mm
      </FormatDateNode>
      <span className="truncate">{booking.customer_name}</span>
    </button>
  );
};
