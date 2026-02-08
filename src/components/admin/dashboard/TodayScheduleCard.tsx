import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { statusMap } from "@/libs/booking";
import { UserOutlined } from "@ant-design/icons";

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
        `card rounded-xl p-3 flex items-center gap-4`,
        className,
      )}
      {...props}
    >
      {/* 1. 時間區塊 - 強調顯示 */}
      <div className="flex items-center justify-center bg-gray-50 border border-gray-100 rounded-md px-3 py-2 min-w-20 shrink-0">
         <span className="text-xl font-bold font-mono text-(--foreground) tracking-tight">
          {startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>

      {/* 2. 資訊區塊 - 佔用剩餘空間 */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] items-center gap-2 min-w-0 px-2">
        <h3 className="font-bold text-(--foreground) text-xl truncate leading-tight">
            {service?.name || "未知服務"}
        </h3>
        <div className="flex items-center gap-3 text-sm text-(--muted) truncate md:justify-end">
             <div className="flex items-center gap-1.5 font-medium text-gray-600">
                <UserOutlined />
                <span>{booking.customer_name}</span>
             </div>
             <span className="text-gray-300">|</span>
             <span className="font-mono text-gray-500">{booking.customer_phone}</span>
        </div>
      </div>
      
      {/* 3. 狀態標籤 - 固定在右側 */}
      <div className="shrink-0 flex items-center">
        <span
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-md border",
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
};