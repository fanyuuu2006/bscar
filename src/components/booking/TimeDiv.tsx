import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DistributiveOmit } from "fanyucomponents";
import { useState } from "react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const [viewDate, setViewDate] = useState<Date>(
    booking.data.time || new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    booking.data.time
  );
  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      {/* 月曆 */}
      <div className="w-full card p-6 rounded-xl">
        <div className="w-full flex items-center justify-between">
          <button
            className="p-2 rounded-full"
            onClick={() => {
              if (!viewDate) return;
              const newDate = new Date(viewDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setViewDate(newDate);
            }}
          >
            <LeftOutlined />
          </button>
          <h2 className="text-lg font-semibold">
            {`${viewDate.getFullYear()} 年 ${viewDate.getMonth() + 1} 月`}
          </h2>
          <button
            className="p-2 rounded-full"
            onClick={() => {
              if (!viewDate) return;
              const newDate = new Date(viewDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setViewDate(newDate);
            }}
          >
            <RightOutlined />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mt-4">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center font-medium text-(--muted)">
              {day}
            </div>
          ))}
          {/* 日期格子 */}
        </div>
      </div>
    </div>
  );
};
