import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { statusMap } from "@/libs/booking";
import { PhoneOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { FormatDateNode } from "@/components/FormatDateNode";
import { useBookingModal } from "@/contexts/BookingModalContext";

type ScheduleCardProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    booking: SupabaseBooking;
    service?: SupabaseService;
  }
>;

export const ScheduleCard = ({
  booking,
  service,
  className,
  ...props
}: ScheduleCardProps) => {
  const statusInfo = statusMap[booking.status];
  const modal = useBookingModal();

  return (
    <button
      className={cn(
        "group card rounded-xl p-4 flex items-center gap-4 text-left transition-all",
        className,
      )}
      {...props}
      onClick={() => modal.open(booking)}
    >
      {/* 1. 時間區塊 - 取消邊框，加大字體與間距 */}
      <div className="shrink-0 flex flex-col justify-center items-center">
        <FormatDateNode
          date={[booking.booking_time]}
          className="text-2xl font-bold font-mono text-(--foreground) tracking-tight transition-colors"
        >
          HH:mm
        </FormatDateNode>
      </div>

      {/* 2. 資訊區域 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 border-l border-(--border) pl-4">
        <h3 className="font-bold text-(--foreground) text-lg truncate leading-tight transition-colors">
          {service?.name || "未知服務"}
        </h3>

        <div className="flex items-center gap-3 text-sm text-(--muted) truncate">
          <div className="flex items-center gap-1.5 min-w-0">
            <UserOutlined className="shrink-0" />
            <span className="truncate">{booking.customer_name}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <PhoneOutlined className="shrink-0" />
            <span className="font-mono truncate">
              {booking.customer_phone}
            </span>
          </div>
        </div>
      </div>

      {/* 3. 狀態標籤與箭頭 */}
      <div className="shrink-0 flex items-center gap-3 pl-2">
        <span
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border",
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
        <RightOutlined className="text-(--muted) group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
