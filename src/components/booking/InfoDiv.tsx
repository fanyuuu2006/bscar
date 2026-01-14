import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import {
  EnvironmentOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { getDisplayValue } from "../../utils/booking";

type InfoDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoDiv = ({ className, ...rest }: InfoDivProps) => {
  const booking = useBooking();
  const items = useMemo(
    () => [
      {
        icon: EnvironmentOutlined,
        label: "地點",
        value: getDisplayValue("location", booking.data.location),
        key: "location",
      },
      {
        icon: StarOutlined,
        label: "服務",
        value: getDisplayValue("service", booking.data.service),
        key: "service",
      },
      {
        icon: ClockCircleOutlined,
        label: "時間",
        value: getDisplayValue("time", booking.data.time),
        key: "time",
      },
    ],
    [booking.data]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8",
        className
      )}
      {...rest}
    >
      {/* 預約資訊卡片 */}
      <div className="card p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col h-full">
        <h2 className="text-xl font-bold mb-6">預約摘要</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center gap-4 p-4 rounded-xl border border-(--border) hover:border-(--primary) transition-colors bg-(--background)/30"
              >
                <div className="flex justify-center items-center text-2xl text-(--background) bg-(--primary) border-2 border-(--foreground)/20 rounded-full p-2 shrink-0">
                  <Icon />
                </div>
                <div>
                  <div className="text-sm font-medium text-(--muted) mb-1">
                    預約{item.label}
                  </div>
                  <div className="text-lg font-bold text-(--foreground) wrap-break-word line-clamp-2">
                    {item.value || "未選擇"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
