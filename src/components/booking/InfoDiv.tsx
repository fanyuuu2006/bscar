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
        detail: booking.data.location?.branch,
        key: "location",
      },
      {
        icon: StarOutlined,
        label: "服務",
        value: getDisplayValue("service", booking.data.service),
        detail: booking.data.service?.description,
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
    <div className={cn("w-full grid grid-cols-1 md:grid-cols-2 gap-4", className)} {...rest}>
      <div className="card flex flex-col gap-4 p-4 md:p-6 overflow-hidden rounded-2xl">
        <h2 className="text-2xl font-bold text-(--foreground) border-b border-(--border) pb-4">
          預約摘要
        </h2>

        <div className="flex flex-col gap-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--primary) text-(--primary-foreground) shrink-0">
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-sm font-medium text-(--muted) mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-lg font-bold text-(--foreground)">
                    {item.value || (
                      <span className="opacity-50 font-normal">尚未選擇</span>
                    )}
                  </div>
                  {item.detail && (
                    <div className="text-sm text-(--muted) mt-1 flex flex-col gap-1">
                      {item.detail.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
