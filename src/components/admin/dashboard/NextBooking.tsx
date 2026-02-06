"use client";
import { cn } from "@/utils/className";

type NextBookingCardProps = React.HTMLAttributes<HTMLDivElement>;

export const NextBookingCard = ({
  className,
  ...rest
}: NextBookingCardProps) => {

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">下一筆預約</h3>
        </div>
      </div>
    </div>
  );
};
