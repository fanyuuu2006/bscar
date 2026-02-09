"use client";
import { cn } from "@/utils/className";
import { getDaysArray, isSameDate } from "@/utils/date";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useMemo, useRef, useState, useEffect } from "react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"] as const;

export type DateCellProps = {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
};

type CalendarProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    value?: Date;
    onChange?: (date: Date) => void;
    pastDateDisabled?: boolean;
    styles?: {
      weekday?: {
        default?: React.CSSProperties;
        weekend?: React.CSSProperties;
      };
      day?: {
        default?: React.CSSProperties;
        selected?: React.CSSProperties;
        today?: React.CSSProperties;
      };
    };
    /**
     * 自定義日期單元格內容渲染
     * 可以用來顯示當日的額外資訊（如：價格、狀態點等）
     */
    DateCell?: (props: DateCellProps) => React.ReactNode;
  }
>;

export const Calendar = ({
  value,
  onChange,
  className,
  pastDateDisabled = true,
  styles,
  DateCell,
  ...rest
}: CalendarProps) => {
  const [viewDate, setViewDate] = useState<Date>(value ?? new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    return getDaysArray(viewDate.getFullYear(), viewDate.getMonth());
  }, [viewDate]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + offset,
      1,
    );
    setViewDate(newDate);
    onChange?.(newDate);
  };

  useEffect(() => {
    if (value && !isSameDate(value, viewDate)) {
      const timer = setTimeout(() => setViewDate(value), 0);
      return () => clearTimeout(timer);
    }
  }, [value, viewDate]);

  return (
    <div
      className={cn(
        "card flex flex-col gap-2 p-4 rounded-xl",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between px-1 mb-2">
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
          className="relative flex items-center justify-center gap-1 text-nowrap"
          onClick={() => {
            inputRef.current?.showPicker();
          }}
          aria-label="選擇月份"
        >
          <input
            ref={inputRef}
            type="month"
            className="sr-only"
            value={`${viewDate.getFullYear()}-${String(
              viewDate.getMonth() + 1,
            ).padStart(2, "0")}`}
            onChange={(e) => {
              const value = e.target.value || today.toISOString().slice(0, 7);
              const [year, month] = value.split("-").map(Number);
              setViewDate(new Date(year, month - 1, 1));
            }}
          />
          <h2 className="text-[1.5em] font-bold tracking-tight">
            {`${viewDate.getFullYear()} 年 ${viewDate.getMonth() + 1} 月`}
          </h2>
          <CaretDownOutlined />
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
                "text-[0.8em] flex items-center justify-center font-extrabold",
                {
                  "text-red-700": isWeekend,
                },
              )}
              style={{
                ...styles?.weekday?.default,
                ...(isWeekend ? styles?.weekday?.weekend : {}),
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const isSelected = isSameDate(date, viewDate);
          const isToday = isSameDate(date, today);
          const isDisabled =
            pastDateDisabled && date.getTime() < today.getTime();

          return (
            <div
              key={date.toISOString()}
              className="w-full grid grid-cols-1 items-center justify-center"
            >
              <button
                  disabled={isDisabled}
               className="flex justify-center items-center"
                  onClick={() => {
                    setViewDate(date);
                    onChange?.(date);
                  }}>
                <span
                  className={cn(
                    "tabular-nums font-mono relative h-[2em] aspect-square rounded-full flex flex-col items-center justify-center",
                    "text-[1em] font-medium",
                    {
                      "border-(--primary) border-2": isSelected,
                      "font-black text-(--primary)": isToday,
                    },
                  )}
                  style={{
                    ...styles?.day?.default,
                    ...(isSelected ? styles?.day?.selected : {}),
                    ...(isToday ? styles?.day?.today : {}),
                  }}
                >
                  <span>{date.getDate()}</span>
                </span>
              </button>
              {DateCell ? (
                <DateCell
                  date={date}
                  isSelected={isSelected}
                  isToday={isToday}
                  isDisabled={isDisabled}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
