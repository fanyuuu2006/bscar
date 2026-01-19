import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";
import { useCallback, useMemo, useState } from "react";
import { Calender } from "./Calender";
import { generateTimeSlot } from "@/utils/booking";

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const [viewDate, setViewDate] = useState<Date>(
    booking.data.time || new Date()
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleTimeSelect = useCallback((slot: Date) => {
    setSelectedTime(slot);
  }, []);

  const timeSlots = useMemo(() => {
    const { location, service } = booking.data;
    if (!location || !service) return [];
    return generateTimeSlot(
      viewDate,
      location.open_time,
      location.close_time,
      service.duration
    );
  }, [booking.data, viewDate]);

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
