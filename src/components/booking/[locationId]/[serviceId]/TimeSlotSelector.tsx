"use client";
import { SupabaseLocation, SupabaseService, TimeSlot } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useCallback, useEffect, useState } from "react";
import { Calender } from "./Calender";
import { getAvailableSlots } from "@/utils/backend";
import { LoadingOutlined } from "@ant-design/icons";

type TimeSlotSelectorProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    locationId: SupabaseLocation["id"];
    serviceId: SupabaseService["id"];
    value?: Date | null;
    onChange?: (date: Date) => void;
  }
>;
export const TimeSlotSelector = ({
  className,
  locationId,
  serviceId,
  value,
  onChange,
  ...rest
}: TimeSlotSelectorProps) => {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(value || null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlerChange = useCallback(
    (date: Date) => {
      setSelectedTime(date);
      onChange?.(date);
    },
    [onChange],
  );

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAvailableSlots(
          formatDate("YYYY-MM-DD", viewDate),
          locationId,
          serviceId,
        );
        setTimeSlots(data || []);
      } catch (error) {
        console.error(error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeSlots();
  }, [locationId, serviceId, viewDate]);

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
        {isLoading ? (
          <div className="text-(--muted) text-center py-8">
            <LoadingOutlined className="text-2xl" />
          </div>
        ) : timeSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {timeSlots.map((slot) => {
              const slotDate = new Date(
                `${formatDate("YYYY-MM-DD", viewDate)}T${slot.start_time}`,
              );
              const isSelected = selectedTime?.getTime() === slotDate.getTime();
              return (
                <button
                  key={slotDate.toISOString()}
                  type="button"
                  onClick={() => handlerChange(slotDate)}
                  className={cn(
                    "btn p-2 rounded-lg font-medium transition-all",
                    {
                      secondary: isSelected,
                    },
                  )}
                >
                  {formatDate("hh:mm A", slotDate)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-(--muted) text-center py-4">
            {locationId ? "本日無可預約時段" : "請先選擇地點"}
          </div>
        )}
      </div>
    </div>
  );
};
