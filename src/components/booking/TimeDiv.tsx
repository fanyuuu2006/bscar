import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { getDaysArray, isSameDate } from "@/utils/date";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DistributiveOmit } from "fanyucomponents";
import { useMemo, useState } from "react";

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

  const days = useMemo(() => {
    return getDaysArray(viewDate.getFullYear(), viewDate.getMonth());
  }, [viewDate]);

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
          {days.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />;

            const isSelected = selectedDate
              ? isSameDate(date, selectedDate)
              : false;

            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  booking.setBookingData("time", date);
                }}
                className={cn(
                  "flex items-center justify-center text-sm",
                  isSelected
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "hover:bg-gray-100 dark:hover:bg-white/10"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
