"use client";
import { bookingSteps, useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";

export const Mainsection = () => {
  const { currStep, setCurrStep, getStepIndex, setBookingData } = useBooking();

  return (
    <section>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {bookingSteps.map((step, index) => (
            <button
              key={step.value}
              className={cn(
                `w-full text-(--muted) p-2 whitespace-nowrap font-medium`,
                {
                  "text-(--primary)": currStep === step.value,
                }
              )}
              onClick={() => {
                if (getStepIndex(currStep) > index) {
                  setCurrStep(step.value);
                  setBookingData(step.value, undefined);
                }
              }}
            >
              {step.label}
            </button>
          ))}
        </div>
        <LocationsDiv />
      </div>
    </section>
  );
};
