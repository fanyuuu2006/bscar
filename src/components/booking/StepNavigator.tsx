"use client";

import { bookingSteps } from "@/libs/booking";
import { BookingStep, Location, Service } from "@/types";
import { getDisplayValue } from "@/utils/booking";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Info } from "../../types/index";
import { getLocationById, getServiceById } from "@/utils/backend";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

const INITIAL_BOOKING_DATA = {
  location: undefined,
  service: undefined,
  time: undefined,
  info: undefined,
};

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const params = useParams();
  const { locationId, serviceId, time } = params;

  const [data, setData] = useState<{
    location: Location | undefined;
    service: Service | undefined;
    time: Date | undefined;
    info: Info | undefined;
  }>(INITIAL_BOOKING_DATA);

  const getCurrentStep = (): BookingStep => {
    if (time) return "info";
    if (serviceId) return "time";
    if (locationId) return "service";
    return "location";
  };

  const currentStepValue = getCurrentStep();

  const getStepIndex = useCallback((step: BookingStep) => {
    return bookingSteps.findIndex((s) => s.value === step);
  }, []);

  // 導航邏輯
  const handleToStep = useCallback(
    (stepValue: BookingStep) => {
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
    },
    [locationId, serviceId, time, router],
  );

  useEffect(() => {
    if (locationId) {
      getLocationById(locationId as string).then((res) => {
        if (res.success) {
          setData((prev) => ({
            ...prev,
            location: res.data || undefined,
          }));
        } else {
          handleToStep("location");
        }
      });
    }
    if (serviceId) {
      getServiceById(serviceId as string).then((res) => {
        if (res.success) {
          setData((prev) => ({
            ...prev,
            service: res.data || undefined,
          }));
        } else {
          handleToStep("service");
        }
      });
      if (time) {
        const timeDate = new Date(Number(time));
        setTimeout(
          () =>
            setData((prev) => ({
              ...prev,
              time: timeDate,
            })),
          0,
        );
      }
    }
  }, [handleToStep, locationId, serviceId, time]);

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
