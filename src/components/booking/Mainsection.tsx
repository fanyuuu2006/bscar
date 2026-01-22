"use client";
import {
  useBooking,
} from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { useMemo } from "react";
import { ServiceDiv } from "./ServiceDiv";
import { TimeDiv } from "./TimeDiv";
import { InfoDiv } from "./InfoDiv";
import { StepNavigator } from "./StepNavigator";

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
        <StepNavigator className="w-full mb-8" />
        {/* 選擇區塊 */}
        <StepContent />
      </div>
    </section>
  );
};
