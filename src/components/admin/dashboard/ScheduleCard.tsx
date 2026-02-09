import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import { statusMap } from "@/libs/booking";
import { PhoneOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { FormatDateNode } from "@/components/FormatDateNode";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { useMemo } from "react";

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

  const infoItems = useMemo(
    () =>
      [
        {
          icon: UserOutlined,
          key: "name",
        },
        {
          icon: PhoneOutlined,
          key: "phone",
        },
        {
          icon: () => (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0M5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002.002.002a.15.15 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157m.791-2.924a.156.156 0 0 0-.156.156v3.486c0 .086.07.155.156.155h.562c.086 0 .155-.07.155-.155V4.918a.156.156 0 0 0-.155-.156zm3.863 0a.156.156 0 0 0-.156.156v2.07L7.923 4.832l-.013-.015v-.001l-.01-.01-.003-.003-.011-.009h-.001L7.88 4.79l-.003-.002-.005-.003-.008-.005h-.002l-.003-.002-.01-.004-.004-.002-.01-.003h-.002l-.003-.001-.009-.002h-.006l-.003-.001h-.004l-.002-.001h-.574a.156.156 0 0 0-.156.155v3.486c0 .086.07.155.156.155h.56c.087 0 .157-.07.157-.155v-2.07l1.6 2.16a.2.2 0 0 0 .039.038l.001.001.01.006.004.002.008.004.007.003.005.002.01.003h.003a.2.2 0 0 0 .04.006h.56c.087 0 .157-.07.157-.155V4.918a.156.156 0 0 0-.156-.156zm3.815.717v-.56a.156.156 0 0 0-.155-.157h-2.242a.16.16 0 0 0-.108.044h-.001l-.001.002-.002.003a.16.16 0 0 0-.044.107v3.486c0 .041.017.08.044.107l.002.003.002.002a.16.16 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156Z"></path>
            </svg>
          ),
          key: "line",
        },
      ] as const,
    [],
  );
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
          {infoItems.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5 min-w-0">
              <item.icon className="shrink-0" />
              <span className="truncate max-w-[10em]" title={booking[`customer_${item.key}`] || "-"}>
                {booking[`customer_${item.key}`] || "-"}
              </span>
            </div>
          ))}
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
