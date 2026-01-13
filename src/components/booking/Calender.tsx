import { cn } from "@/utils/className";
import { getDaysArray, isSameDate } from "@/utils/date";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useMemo, useState } from "react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"] as const;

type CalenderProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    value?: Date;
    onChange?: (date: Date) => void;
    pastDateDisabled?: boolean;
  }
>;

export const Calender = ({
  value,
  onChange,
  className,
  pastDateDisabled,
  ...rest
}: CalenderProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(value ?? new Date());
  const now = useMemo(() => new Date(), []);
  const days = useMemo(() => {
    return getDaysArray(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);
  return (
    <div className={cn("card p-6 rounded-xl", className)} {...rest}>
      <div className="text-[1.5em] w-full flex items-center justify-between">
        <button
          className="p-2 rounded-full"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentDate(newDate);
          }}
        >
          <LeftOutlined />
        </button>
        <h2 className="font-semibold">
          {`${currentDate.getFullYear()} 年 ${currentDate.getMonth() + 1} 月`}
        </h2>
        <button
          className="p-2 rounded-full"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentDate(newDate);
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

          const isInView = value ? isSameDate(date, value) : false;
          now.setHours(0, 0, 0, 0);
          const isDisabled = pastDateDisabled
            ? date.getTime() < now.getTime()
            : false;
          return (
            <div
              key={date.toISOString()}
              className={cn("flex items-center justify-center")}
            >
              <button
                disabled={isDisabled}
                className={cn(
                  "h-full aspect-square p-2 rounded-full flex items-center justify-center ",
                  { "bg-(--primary) text-(--background)": isInView }
                )}
                onClick={() => {
                  setCurrentDate(date);
                  onChange?.(date);
                }}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
