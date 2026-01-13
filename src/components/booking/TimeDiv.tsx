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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    booking.data.time
  );
  return (
    <div className={cn("flex flex-col items-center", className)} {...rest}>
      {/* 月曆 */}
      <Calender className="w-full" value={viewDate} onChange={setViewDate} />
    </div>
  );
};
