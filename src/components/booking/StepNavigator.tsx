"use client";

import { bookingSteps } from "@/libs/booking";
import { BookingStep, Location, Service } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";
import { getDisplayValue } from "@/utils/booking";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

const INITIAL_BOOKING_DATA = {
  location: undefined,
  service: undefined,
};

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const params = useParams();

  // Explicitly cast params to string | undefined
  const locationId = params?.locationId as string | undefined;
  const serviceId = params?.serviceId as string | undefined;
  const time = params?.time as string | undefined;

  const [data, setData] = useState<{
    location: Location | undefined;
    service: Service | undefined;
  }>(INITIAL_BOOKING_DATA);

  // Derive current step from params directly
  const currentStepValue: BookingStep = (() => {
    if (time) return "info";
    if (serviceId) return "time";
    if (locationId) return "service";
    return "location";
  })();

  const getStepIndex = (step: BookingStep) =>
    bookingSteps.findIndex((s) => s.value === step);

  const handleToStep = useCallback(
    (stepValue: BookingStep) => {
      switch (stepValue) {
        case "location":
          router.push("/booking");
          break;
        case "service":
          if (locationId) router.push(`/booking/${locationId}`);
          break;
        case "time":
          if (locationId && serviceId)
            router.push(`/booking/${locationId}/${serviceId}`);
          break;
        case "info":
          if (locationId && serviceId && time)
            router.push(`/booking/${locationId}/${serviceId}/${time}`);
          break;
        default:
          break;
      }
    },
    [locationId, serviceId, time, router],
  );

  // Fetch Location
  useEffect(() => {
    if (!locationId) return;

    let isMounted = true;
    getLocationById(locationId).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setData((prev) => ({ ...prev, location: res.data ?? undefined }));
      } else {
        router.push("/booking"); // Fallback
      }
    });

    return () => {
      isMounted = false;
    };
  }, [locationId, router]);

  // Fetch Service
  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true;
    getServiceById(serviceId).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setData((prev) => ({ ...prev, service: res.data ?? undefined }));
      } else {
        // Fallback to location step if service not found
        if (locationId) router.push(`/booking/${locationId}`);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [serviceId, locationId, router]);

  // Derive display data directly during render
  // This avoids "setting state in effect" for 'time' and derived clear states
  const timeDate = time ? new Date(Number(time)) : undefined;
  const isValidTime = timeDate && !isNaN(timeDate.getTime());

  const displayData = {
    location: locationId ? data.location : undefined,
    service: serviceId ? data.service : undefined,
    time: isValidTime ? timeDate : undefined,
    info: undefined,
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
        const displayValue = displayData[step.value]
          ? getDisplayValue(step.value, displayData[step.value]!)
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
