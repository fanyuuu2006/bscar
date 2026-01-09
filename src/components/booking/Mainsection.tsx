"use client";
import { bookingSteps, useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";
import { Fragment, useMemo } from "react";

export const Mainsection = () => {
  const booking = useBooking();

  const StepContent = useMemo(() => {
    switch (booking.currStep) {
      case "location":
        return LocationsDiv;
      // case "service":
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
            const data =
              step.value !== "info" ? booking.data[step.value] : undefined;
            return (
              <button
                disabled={booking.getStepIndex(booking.currStep) < index}
                key={step.value}
                className={cn(
                  `w-full text-(--muted) whitespace-nowrap font-medium`,
                  "flex flex-col items-center p-2",
                  {
                    "text-(--primary)": booking.currStep === step.value,
                  }
                )}
                onClick={() => {
                  booking.setCurrStep(step.value);
                  booking.setBookingData(step.value, undefined);
                }}
              >
                <span className="text-lg md:text-xl">{step.label}</span>
                {data && <span className="text-sm mt-1">{data}</span>}
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
