"use client";

import { useBookingData } from "@/hooks/useBookingData";
import { bookingSteps } from "@/libs/booking";
import { BookingStep } from "@/types";
import { getDisplayValue } from "@/utils/booking";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const data = useBookingData();

  const currentStepValue = useMemo<BookingStep>(() => {
    if (data.time) return "info";
    if (data.service) return "time";
    if (data.location) return "service";
    return "location";
  }, [data.location, data.service, data.time]);

  // 優化：只計算一次當前步驟索引，避免在 map 中重複查找
  const currentStepIndex = useMemo(
    () => bookingSteps.findIndex((s) => s.value === currentStepValue),
    [currentStepValue],
  );

  const handleToStep = useCallback(
    (stepValue: BookingStep) => {
      const { location, service, time } = data;
      switch (stepValue) {
        case "location":
          router.push("/booking");
          break;
        case "service":
          if (location) router.push(`/booking/${location.id}`);
          break;
        case "time":
          if (location && service)
            router.push(`/booking/${location.id}/${service.id}`);
          break;
        case "info":
          if (location && service && time)
            router.push(`/booking/${location.id}/${service.id}/${time}`);
          break;
      }
    },
    [router, data],
  );

  return (
    <div
      className={cn(
        "flex items-center gap-6 overflow-x-auto pb-4 border-b border-(--border)",
        className,
      )}
      {...rest}
    >
      {bookingSteps.map((step, index) => {
        const displayValue = data[step.value]
          ? getDisplayValue(step.value, data[step.value]!)
          : undefined;

        const isActive = currentStepValue === step.value;
        const isDisabled = currentStepIndex < index;

        return (
          <button
            disabled={isDisabled}
            key={step.value}
            className={cn(
              `w-full h-[3em] whitespace-nowrap font-medium`,
              "flex flex-col justify-center items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            onClick={() => handleToStep(step.value)}
          >
            <span
              className={cn("text-lg md:text-xl", {
                "font-extrabold": isActive,
              })}
            >
              {step.label}
            </span>
            {displayValue && (
              <span className="text-xs md:text-sm text-(--muted) mt-1 font-normal opacity-80">
                {displayValue}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
