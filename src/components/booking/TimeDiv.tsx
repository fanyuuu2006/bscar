import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";
import { useEffect, useState } from "react";
import { Calender } from "./Calender";

type TimeDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const TimeDiv = ({ className, ...rest }: TimeDivProps) => {
  const booking = useBooking();
  const timeSlots = useState<Date[]>([]); // 預設為空陣列，待實作時段邏輯
  const [viewDate, setViewDate] = useState<Date>(
    booking.data.time || new Date()
  );

  useEffect(() => {
    // 從開閉店時間切割每一小時為時段
    

  }, [viewDate]);

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
        <h2 className="text-lg font-medium mb-4 mt-8">選擇時段</h2>
        <div className="text-(--muted)">時段選擇區域 (待實作)</div>
      </div>
    </div>
  );
};
