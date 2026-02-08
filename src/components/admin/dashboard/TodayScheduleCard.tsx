import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { statusMap } from "@/libs/booking";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";

type TodayScheduleCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    booking: SupabaseBooking;
    service?: SupabaseService;
  }
>;

export const TodayScheduleCard = ({
  booking,
  service,
  className,
  ...props
}: TodayScheduleCardProps) => {
  const startTime = new Date(booking.booking_time);
  
  const statusInfo = statusMap[booking.status];


  return (
    <div
      className={cn(
        `card rounded-xl p-4 flex justify-between items-center group cursor-pointer hover:border-primary/50`,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="font-bold text-(--foreground) text-lg truncate flex items-center gap-2">
            {service?.name || "未知服務"}
        </h3>
        <div className="flex flex-col gap-1 text-xs text-(--muted)">
             <div className="flex items-center gap-1.5">
                <UserOutlined className="text-[10px]" />
                <span>{booking.customer_name}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <PhoneOutlined className="text-[10px]" />
                <span className="font-mono">{booking.customer_phone}</span>
             </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-bold font-mono text-(--foreground)">
          {startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>

        <span
          className={cn(
            "px-2.5 py-0.5 text-xs font-medium rounded-full border",
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
};