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
import { useMemo } from "react";
import { formatDate } from "@/utils/date";
import { ServiceDiv } from "./ServiceDiv";
import { TimeDiv } from "./TimeDiv";
import { InfoDiv } from "./InfoDiv";

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
      return formatDate("YYYY/MM/DD HH:mm", data as Time);
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
      case "time":
        return TimeDiv;
      case "info":
        return InfoDiv;
      default:
        return "div";
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
            const isActive = booking.currStep === step.value;

            return (
              <button
                disabled={booking.getStepIndex(booking.currStep) < index}
                key={step.value}
                className={cn(
                  `w-full h-[3em] whitespace-nowrap font-medium`,
                  "flex flex-col justify-center items-center rounded-lg"
                )}
                onClick={() => {
                  booking.toStep(step.value);
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
                  <span className="text-xs md:text-sm  text-(--muted) mt-1 font-normal opacity-80">
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
