import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useState } from "react";
import { Calender } from "./Calender";

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const [viewDate, setViewDate] = useState<Date>(
    booking.data.time || new Date()
  );
  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      {/* 月曆 */}
      <Calender
        pastDateDisabled
        className="w-full text-sm md:text-base"
        value={viewDate}
        onChange={setViewDate}
      />
      {/* 時段選擇區域 */}
      <div className="w-full">
        <h2 className="text-lg font-medium mb-4 mt-8 text-(--foreground)">
          選擇時段
        </h2>
      </div>
    </div>
  );
};
