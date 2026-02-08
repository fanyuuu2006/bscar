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
        // 恢復 card 樣式，移除 p-0 改為適當 padding
        `card rounded-xl p-3 flex items-center gap-4`,
        className,
      )}
      {...props}
    >
      {/* 1. 時間 */}
      <div className="shrink-0 w-16 text-center">
        <FormatDateNode
          date={[booking.booking_time]}
          className="text-xl font-bold font-mono text-(--foreground) tracking-tight"
        >
          HH:mm
        </FormatDateNode>
      </div>

      {/* 2. 資訊區域 - 與時間在同一行 */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline md:gap-3 gap-1">
        {/* 服務名稱 */}
        <h3 className="font-bold text-(--foreground) text-lg truncate leading-none">
          {service?.name || "未知服務"}
        </h3>

        {/* 顧客資訊 - 在大螢幕時接在服務名稱後面 */}
        <div className="flex items-center gap-2 text-sm text-(--muted) truncate">
          <span className="hidden md:inline text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <UserOutlined className="text-[12px]" />
            <span>{booking.customer_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PhoneOutlined className="text-[12px]" />
            <span className="font-mono">{booking.customer_phone}</span>
          </div>
        </div>
      </div>

      {/* 3. 狀態標籤 - 靠右 */}
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
