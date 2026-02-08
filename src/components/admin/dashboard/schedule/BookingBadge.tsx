import { FormatDateNode } from "@/components/FormatDateNode";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { useCallback } from "react";

type BookingBadgeProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    booking: SupabaseBooking;
    mutate: () => void;
  }
>;
export const BookingBadge = ({
  booking,
  className,
  onClick,
  mutate,
  ...rest
}: BookingBadgeProps) => {
  const status = statusMap[booking.status] ?? {
    label: booking.status,
    className: "",
  };
  const modal = useBookingModal();
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    modal.open(booking, {
        onSuccess: mutate,
    });
    if (onClick) {
      onClick(e);
    }
  }, [modal, booking, onClick, mutate]);
  return (
    <button
    onClick={handleClick}
    className={cn(
        "flex items-center border gap-1 overflow-hidden truncate rounded-md px-1.5 py-1 font-medium",
        status.className,
        className,
      )}
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
