"use client";
import { bookingSteps, useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";
import { useMemo } from "react";

export const Mainsection = () => {
  const booking = useBooking();

  const renderStepContent = useMemo(() => {
    switch (booking.currStep) {
      case "location":
        return <LocationsDiv />;
      // case "service":
      //     return <ServicesDiv />;
      // case "time":
      //     return <TimeDiv />;
      // case "info":
      //     return <InfoDiv />;
      default:
        return null;
    }
  }, [booking.currStep]);

  return (
    <section>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {bookingSteps.map((step, index) => {
            const data = booking.data[step.value];
            return (
              <button
                key={step.value}
                className={cn(
                  `w-full text-(--muted) whitespace-nowrap font-medium`,
                  "flex flex-col justify-center items-center p-2",
                  {
                    "text-(--primary)": booking.currStep === step.value,
                  }
                )}
                onClick={() => {
                  if (booking.getStepIndex(booking.currStep) > index) {
                    booking.setCurrStep(step.value);
                    booking.setBookingData(step.value, undefined);
                  }
                }}
              >
                <span className="text-lg md:text-xl">{step.label}</span>
                <span className="text-sm mt-1">{data ? data : "未選擇"}</span>
              </button>
            );
          })}
        </div>
        {/* 選擇區塊 */}
        {renderStepContent}
      </div>
    </section>
  );
};
