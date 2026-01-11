import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useMemo, useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const [viewDate, setViewDate] = useState(booking.data.time || new Date());
  const [selectedDay, setSelectedDay] = useState<(typeof booking.data)["time"]>(
    booking.data.time
  );

  // 獲取當前月份的總天數
  // 邏輯：利用 Date 建構函數的特性，下個月的第 0 天即為當月的最後一天
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // 獲取當前月份第一天是星期幾
  // 邏輯：設置日期為當月 1 號，並獲取其星期幾 (0為週日，1為週一...)，用於決定日曆前面的空白格數
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // 切換月份
  // 邏輯：根據 offset 增加或減少月份，Date 對象會自動處理年份進位
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // 填充空白格子
    // 邏輯：根據當月第一天是星期幾，在前面生成相應數量的空白 div，確保日期與星期幾對齊
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // 渲染日期按鈕
    // 邏輯：遍歷當月所有天數，生成日期按鈕
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const isSelected =
        selectedDay && date.toDateString() === selectedDay.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      // 檢查日期是否為過去
      // 邏輯：獲取今天的日期並將時間設為 00:00:00，比較該日期是否小於今天，若是則禁用（防止預約過去時間）
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = date < today;

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => setSelectedDay(date)}
          className={cn(
            "h-10 w-10 text-sm flex items-center justify-center rounded-full transition-colors",
            isSelected ? "bg-[#d32f2f] text-white" : "hover:bg-gray-100",
            isToday && !isSelected ? "text-[#d32f2f] font-bold" : "",
            isPast
              ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
              : "text-gray-700"
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  // 生成每天的可選時段，每隔 2 小時一個區間
  // 邏輯：當有選擇日期時，從早上 9 點開始直到晚上 8 點，每 2 小時生成一個時間點
  const timeSlots = useMemo(() => {
    if (!selectedDay) return [];
    const slots = [];
    const startHour = 9; // 開始時間：早上 9:00
    const endHour = 20; // 結束時間：晚上 8:00 (最後一個時段)
    const interval = 2; // 時間間隔：2 小時

    for (let h = startHour; h <= endHour; h += interval) {
      const time = new Date(selectedDay);
      time.setHours(h, 0, 0, 0);
      slots.push(time);
    }
    return slots;
  }, [selectedDay]);

  const handleTimeSelect = (time: Date) => {
    booking.setBookingData("time", time);
    // 可選：若需要選擇時間後自動進入下一步驟，可在此呼叫
    // booking.nextStep();
  };

  return (
    <div
      className={cn("flex flex-col gap-8 max-w-3xl mx-auto w-full", className)}
      {...rest}
    >
      {/* Calendar Section: 日曆部分 */}
      {/* 包含月份切換按鈕、星期列、以及日期網格 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => booking.prevStep()}
            className="text-[#d32f2f] flex items-center gap-1 text-base font-medium hover:opacity-80 transition-opacity"
          >
            <LeftOutlined /> 返回
          </button>
        </div>

        <div className="flex items-center justify-between mb-8 px-4 py-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <LeftOutlined />
          </button>
          <h2 className="text-xl font-bold text-gray-800 select-none">
            {viewDate.getMonth() + 1}月 {viewDate.getFullYear()}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RightOutlined />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-4">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-medium text-gray-500 select-none"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 justify-items-center">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Time Slots Section: 時間段選擇部分 */}
      {/* 僅在選擇了日期後顯示 (selectedDay 不為空) */}
      {selectedDay && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            可選擇的開始時間
          </h3>
          <div className="flex flex-wrap gap-4">
            {timeSlots.map((time, idx) => {
              const isSelected =
                booking.data.time?.getTime() === time.getTime();

              return (
                <button
                  key={idx}
                  onClick={() => handleTimeSelect(time)}
                  className={cn(
                    "px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border-2",
                    isSelected
                      ? "bg-gray-200 border-transparent text-gray-900 shadow-inner"
                      : "bg-gray-100 border-transparent text-gray-600 hover:bg-white hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  {time.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
