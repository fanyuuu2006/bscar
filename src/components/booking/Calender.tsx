import { cn } from "@/utils/className";
import { getDaysArray, isSameDate } from "@/utils/date";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useMemo } from "react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"] as const;

type CalenderProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    value: Date;
    onChange: (date: Date) => void;
  }
>;

export const Calender = ({
  value,
  onChange,
  className,
  ...rest
}: CalenderProps) => {
  const days = useMemo(() => {
    return getDaysArray(value.getFullYear(), value.getMonth());
  }, [value]);
  return (
    <div className={cn("card p-6 rounded-xl", className)} {...rest}>
      <div className="w-full flex items-center justify-between">
        <button
          className="p-2 rounded-full"
          onClick={() => {
            if (!value) return;
            const newDate = new Date(value);
            newDate.setMonth(newDate.getMonth() - 1);
            onChange(newDate);
          }}
        >
          <LeftOutlined />
        </button>
        <h2 className="text-lg font-semibold">
          {`${value.getFullYear()} 年 ${value.getMonth() + 1} 月`}
        </h2>
        <button
          className="p-2 rounded-full"
          onClick={() => {
            if (!value) return;
            const newDate = new Date(value);
            newDate.setMonth(newDate.getMonth() + 1);
            onChange(newDate);
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
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const currentDate = new Date(date);
          currentDate.setHours(0, 0, 0, 0);
          const isDisabled = currentDate.getTime() < today.getTime();

          return (
            <div
              key={date.toISOString()}
              className={cn("flex items-center justify-center text-sm")}
            >
              <button
                disabled={isDisabled}
                className={cn(
                  "h-full aspect-square p-2 rounded-full flex items-center justify-center ",
                  { "bg-(--primary) text-(--background)": isInView },
                  { "opacity-50 cursor-not-allowed text-(--muted)": isDisabled }
                )}
                onClick={() => {
                  if (!isDisabled) {
                    onChange(date);
                  }
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
