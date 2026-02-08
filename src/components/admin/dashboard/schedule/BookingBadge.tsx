import { FormatDateNode } from "@/components/FormatDateNode";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";

type BookingBadgeProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
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
    <div
      key={booking.id}
      className={cn(
        "flex items-center border gap-1 overflow-hidden truncate rounded-md px-1.5 py-1 font-medium",
        status.className,
        className,
      )}
      title={`${formatDate("HH:mm", booking.booking_time)} - ${booking.customer_name}`}
      {...rest}
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
};
