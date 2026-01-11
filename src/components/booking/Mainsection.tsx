"use client";
import {
  BookingData,
  BookingStep,
  bookingSteps,
  Location,
  Service,
  Time,
  useBooking,
} from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";
import { Fragment, useMemo } from "react";
import { formatDate } from "@/utils/date";
import { ServiceDiv } from "./ServiceDiv";

const getDisplayValue = <K extends BookingStep>(
  step: K,
  data: BookingData[K]
) => {
  if (!data) return "";

  switch (step) {
    case "location": {
      const { city, branch } = data as Location;
      return `${city}-${branch}`;
    }
    case "service":
      return (data as Service).name;
    case "time":
      return formatDate("YYYY/MM/DD HH:MM", data as Time);
    default:
      return "";
  }
};

export const Mainsection = () => {
  const booking = useBooking();

  const StepContent = useMemo(() => {
    switch (booking.currStep) {
      case "location":
        return LocationsDiv;
      case "service":
        return ServiceDiv;
      // case "time":
      // case "info":
      default:
        return Fragment;
    }
  }, [booking.currStep]);

  return (
    <section>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {bookingSteps.map((step, index) => {
            const displayValue = getDisplayValue(
              step.value,
              booking.data[step.value]
            );

            return (
              <button
                disabled={booking.getStepIndex(booking.currStep) < index}
                key={step.value}
                className={cn(
                  `w-full text-(--muted) whitespace-nowrap font-medium`,
                  "flex flex-col items-center p-2 hover:bg-black/5 rounded-lg",
                  {
                    "text-(--primary)": booking.currStep === step.value,
                  }
                )}
                onClick={() => {
                  booking.toStep(step.value);
                }}
              >
                <span className="text-lg md:text-xl">{step.label}</span>
                {displayValue && (
                  <span className="text-xs md:text-sm mt-1 font-normal opacity-80 truncate max-w-[14ch]">
                    {displayValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* 選擇區塊 */}
        <StepContent />
      </div>
    </section>
  );
};
