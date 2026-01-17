import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";
import { useCallback, useEffect, useState } from "react";
import { Calender } from "./Calender";

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [viewDate, setViewDate] = useState<Date>(
    booking.data.time || new Date()
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  useEffect(() => {
    // 從開閉店時間切割每一小時為時段
    const location = booking.data.location;
    if (!location) {
      return;
    }

    const { open_time, close_time } = location;

    // 解析時間字串 "HH:mm"
    const [openH, openM] = open_time.split(":").map(Number);
    const [closeH, closeM] = close_time.split(":").map(Number);

    const start = new Date(viewDate);
    start.setHours(openH, openM, 0, 0);

    const end = new Date(viewDate);
    end.setHours(closeH, closeM, 0, 0);

    const slots: Date[] = [];
    const current = new Date(start);

    // 每小時產生一個時段，直到結束時間前
    while (current < end) {
      slots.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }

    setTimeout(() => setTimeSlots(slots), 0);
  }, [viewDate, booking.data.location]);

  const handleTimeSelect = useCallback((slot: Date) => {
    setSelectedTime(slot);
  }, []);

  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      {/* 月曆 */}
      <Calender
        pastDateDisabled
        className="w-full text-sm md:text-base lg:text-lg"
        value={viewDate}
        onChange={setViewDate}
      />
      {/* 時段選擇區域 */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-6 mt-8 flex items-center gap-2">
          可選擇時段
        </h2>
        {timeSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime?.getTime() === slot.getTime();
              return (
                <button
                  key={slot.toISOString()}
                  type="button"
                  onClick={() => handleTimeSelect(slot)}
                  className={cn("btn p-2 rounded-lg font-medium", {
                    secondary: isSelected,
                  })}
                >
                  {formatDate("HH:mm", slot)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-(--muted) text-center py-4">
            {booking.data.location ? "本日無可預約時段" : "請先選擇地點"}
          </div>
        )}
        {/* 確認預約區域 */}
        {selectedTime && (
          <div className="mt-8 flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-(--muted)">已選擇時段</span>
              <span className="text-2xl font-bold text-(--foreground)">
                {formatDate("YYYY/MM/DD HH:mm", selectedTime)}
              </span>
            </div>
            <button
              className="btn primary w-full max-w-md py-3 rounded-xl font-bold text-lg"
              onClick={() => {
                booking.setBookingData("time", selectedTime);
                booking.nextStep();
              }}
            >
              確認並前往下一步
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
