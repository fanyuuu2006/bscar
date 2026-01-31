"use client";
import { SupabaseLocation, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TimeSlotSelector } from "./TimeSlotSelector";

type TimeDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    locationId: SupabaseLocation["id"];
    serviceId: SupabaseService["id"];
  }
>;
export const TimeDiv = ({
  className,
  locationId,
  serviceId,
  ...rest
}: TimeDivProps) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const router = useRouter();

  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      <TimeSlotSelector
        className="w-full"
        locationId={locationId}
        serviceId={serviceId}
        value={selectedTime}
        onChange={setSelectedTime}
      />
      {/* 確認預約區域 */}
      {selectedTime && (
        <div className="mt-8 flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-(--muted)">已選擇時段</span>
            <span className="text-2xl font-bold text-(--foreground)">
              {formatDate("YYYY/MM/DD hh:mm A", selectedTime)}
            </span>
          </div>
          <button
            className="btn primary w-full max-w-md py-3 rounded-xl font-bold text-lg"
            onClick={() => {
              router.push(
                `/booking/${locationId}/${serviceId}/${selectedTime.getTime()}`,
              );
            }}
          >
            確認並前往下一步
          </button>
        </div>
      )}
    </div>
  );
};
