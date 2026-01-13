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
  const { location, service, time } = booking.data;

  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      {...rest}
    >
      {/* 預約資訊 */}
      <div className="card rounded-2xl p-4 md:p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold border-b border-gray-200 pb-4">
          預約資訊確認
        </h2>

        {/* Location */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900">地點</h3>
            <p className="text-lg font-medium">
              {location?.city} {location?.branch}
            </p>
            <p className="text-sm text-(--muted)">{location?.address}</p>
          </div>
        </div>

        {/* Service */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900">服務</h3>
            <p className="text-lg font-medium">{service?.name}</p>
            <p className="text-sm text-(--muted) line-clamp-2">
              {service?.description}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900">時間</h3>
            <p className="text-xl font-bold text-(--primary)">
              {time ? formatDate("YYYY/MM/DD HH:mm", time) : "尚未選擇"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
