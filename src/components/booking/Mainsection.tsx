"use client";
import { useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";

export const Mainsection = () => {
  const { currStep, setCurrStep, steps } = useBooking();

  return (
    <section>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {steps.map((step) => (
            <button
              key={step.value}
              className={cn(
                `w-full text-(--muted) p-2 whitespace-nowrap font-medium`,
                {
                  "text-(--primary)": currStep === step.value,
                }
              )}
              onClick={() => setCurrStep(step.value)}
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
