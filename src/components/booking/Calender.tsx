import { cn } from "@/utils/className";
import { getDaysArray, isSameDate } from "@/utils/date";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useMemo, useRef, useState } from "react";

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
  pastDateDisabled = true,
  ...rest
}: CalenderProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(value ?? new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    return getDaysArray(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
  };

  return (
    <div
      className={cn(
        "card flex flex-col gap-2 p-4 md:p-6 rounded-2xl",
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          className="text-[1.2em] text-(--muted) flex items-center justify-center"
          onClick={() => handleMonthChange(-1)}
          aria-label="上個月"
        >
          <LeftOutlined />
        </button>
        <button
          type="button"
          className="group relative flex items-center justify-center"
          onClick={() => {
            inputRef.current?.showPicker();
          }}
          aria-label="選擇月份"
        >
          <input
            ref={inputRef}
            type="month"
            className="absolute opacity-0 pointer-events-none"
            value={`${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}`}
            onChange={(e) => {
              const value = e.target.value || today.toISOString().slice(0, 7);
              const [year, month] = value.split("-").map(Number);
              setCurrentDate(new Date(year, month - 1, 1));
            }}
          />
          <h2 className="text-[1.5em] font-bold text-(--secondary) tracking-tight group-hover:opacity-70 transition-opacity select-none">
            {`${currentDate.getFullYear()} 年 ${currentDate.getMonth() + 1} 月`}
          </h2>
        </button>

        <button
          type="button"
          className="text-[1.2em] text-(--muted) flex items-center justify-center"
          onClick={() => handleMonthChange(1)}
          aria-label="下個月"
        >
          <RightOutlined />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-(--border) pb-2">
        {WEEKDAYS.map((day) => {
          const isWeekend = day === "日" || day === "六";
          return (
            <div
              key={day}
              className={cn(
                "text-[1.2em] text-center sm:text-xs font-extrabold",
                {
                  "text-red-700": isWeekend,
                }
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const isSelected = value ? isSameDate(date, value) : false;
          const isToday = isSameDate(date, today);
          const isDisabled =
            pastDateDisabled && date.getTime() < today.getTime();

          return (
            <div
              key={date.toISOString()}
              className="flex items-center justify-center"
            >
              <button
                type="button"
                disabled={isDisabled}
                className={cn(
                  "h-full p-2 aspect-square rounded-full flex flex-col items-center justify-center transition-all",
                  "text-[1em] font-medium",
                  {
                    "bg-(--primary) text-white": isSelected,
                    "font-extrabold": isToday,
                  }
                )}
                onClick={() => {
                  setCurrentDate(date);
                  onChange?.(date);
                }}
              >
                <span>{date.getDate()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
