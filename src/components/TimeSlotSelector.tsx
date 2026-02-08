"use client";
import { SupabaseLocation, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useCallback, useState } from "react";
import { Calendar } from "./Calendar";
import { getAvailableSlots } from "@/utils/backend";
import { LoadingOutlined } from "@ant-design/icons";
import { FormatDateNode } from "@/components/FormatDateNode";
import useSWR from "swr";

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

  const { data: response, isLoading } = useSWR(
    [formatDate("YYYY-MM-DD", viewDate), locationId, serviceId],
    ([date, locationId, serviceId]) =>
      getAvailableSlots(date, locationId, serviceId),
  );
  const timeSlots = response?.data || [];

  const handlerChange = useCallback(
    (date: Date) => {
      setSelectedTime(date);
      onChange?.(date);
    },
    [onChange],
  );

  return (
    <div className={cn(className)} {...rest}>
      {/* 月曆 */}
      <Calendar
        pastDateDisabled
        className="w-full text-[1em]"
        value={viewDate}
        onChange={setViewDate}
      />

      {/* 時段選擇區域 */}
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-[1.25em] font-bold flex items-center gap-2">
          可選擇時段
        </h2>
        {isLoading ? (
          <div className="text-(--muted) text-center py-8">
            <LoadingOutlined className="text-[1.5em]" />
          </div>
        ) : timeSlots.length > 0 ? (
          <div className="text-[1em] grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
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
                  <FormatDateNode date={[slotDate]}>hh:mm A</FormatDateNode>
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
