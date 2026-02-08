import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { statusMap } from "@/libs/booking";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { FormatDateNode } from "@/components/FormatDateNode";

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
  const statusInfo = statusMap[booking.status];

  return (
    <div
      className={cn(
        `card rounded-lg px-4 py-2 flex items-center gap-4 group cursor-pointer hover:border-primary/50 transition-colors`,
        className,
      )}
      {...props}
    >
      {/* 1. 時間區塊 - 使用 FormatDateNode 保持一致性 */}
      <div className="shrink-0 w-18 flex justify-center border-r border-gray-100 pr-4 my-1">
        <FormatDateNode
          date={[booking.booking_time]}
          className="text-2xl font-bold font-mono text-(--foreground) tracking-tight"
        >
          HH:mm
        </FormatDateNode>
      </div>

      {/* 2. 資訊區域 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="font-bold text-(--foreground) text-lg truncate leading-tight">
          {service?.name || "未知服務"}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-(--muted) truncate">
           <div className="flex items-center gap-1.5 min-w-0">
              <UserOutlined className="shrink-0" />
              <span className="truncate">{booking.customer_name}</span>
           </div>
           <span className="text-gray-200">|</span>
           <div className="flex items-center gap-1.5 min-w-0">
             <PhoneOutlined className="shrink-0" />
             <span className="font-mono truncate">{booking.customer_phone}</span>
           </div>
        </div>
      </div>

      {/* 3. 狀態標籤 - 使用原有樣式 */}
      <div className="shrink-0 pl-2">
        <span
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border",
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
};
