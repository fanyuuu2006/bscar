"use client";

import { bookingSteps } from "@/libs/booking";
import { BookingStep } from "@/types";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useParams, useRouter } from "next/navigation";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const params = useParams();
  const { locationId, serviceId, time } = params;

  // 根據 URL 參數判斷目前步驟
  const getCurrentStep = (): BookingStep => {
    if (time) return "info";
    if (serviceId) return "time";
    if (locationId) return "service";
    return "location";
  };

  const currentStepValue = getCurrentStep();

  const getStepIndex = (step: BookingStep) => {
    return bookingSteps.findIndex((s) => s.value === step);
  };

  // 導航邏輯
  const handleToStep = (stepValue: BookingStep) => {
    switch (stepValue) {
      case "location":
        router.push("/booking");
        break;
      case "service":
        if (locationId) {
          router.push(`/booking/${locationId}`);
        }
        break;
      case "time":
        if (locationId && serviceId) {
          router.push(`/booking/${locationId}/${serviceId}`);
        }
        break;
      case "info":
        if (locationId && serviceId && time) {
          router.push(`/booking/${locationId}/${serviceId}/${time}`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-6 overflow-x-auto pb-4 border-b border-(--border)",
        className,
      )}
      {...rest}
    >
      {bookingSteps.map((step, index) => {
        const displayValue = null;

        const isActive = currentStepValue === step.value;
        const currentStepIndex = getStepIndex(currentStepValue);

        return (
          <button
            disabled={currentStepIndex < index}
            key={step.value}
            className={cn(
              `w-full h-[3em] whitespace-nowrap font-medium`,
              "flex flex-col justify-center items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            onClick={() => {
              handleToStep(step.value);
            }}
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
