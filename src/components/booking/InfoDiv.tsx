import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";

type InfoDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoDiv = ({ className, ...rest }: InfoDivProps) => {
  const booking = useBooking();
  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      <h2 className="text-lg font-medium mb-4">預約資訊</h2>
      <div className="text-center text-(--muted)">
        服務項目: {booking.data.service ? booking.data.service.name : "未選擇"}
        <br />
        地點:{" "}
        {booking.data.location
          ? `${booking.data.location.city} ${booking.data.location.branch}`
          : "未選擇"}
        <br />
        時間:{" "}
        {booking.data.time
          ? formatDate("YYYY/MM/DD HH:mm", booking.data.time)
          : "未選擇"}
      </div>
    </div>
  );
};
