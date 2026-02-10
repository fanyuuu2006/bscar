import { FormatDateNode } from "@/components/FormatDateNode";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";

type BookingBadgeProps = OverrideProps<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    booking: SupabaseBooking;
  }
>;
export const BookingBadge = ({
  booking,
  className,
  ...rest
}: BookingBadgeProps) => {
  const status = statusMap[booking.status] ?? {
    label: booking.status,
    className: "",
  };
  return (
    <span
      className={cn(
        "flex items-center border gap-1 truncate rounded-md p-px px-0.5 font-medium",
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
    </span>
  );
};
