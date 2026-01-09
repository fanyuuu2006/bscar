"use client";
import { createContext, useContext, useMemo, useState } from "react";

const bookingSteps = [
  { value: "location", label: "地點" },
  { value: "service", label: "服務" },
  { value: "time", label: "時間" },
  { value: "info", label: "資訊" },
] as const;

export type BookingStep = (typeof bookingSteps)[number]["value"];

type BookingContextType = {
  steps: typeof bookingSteps;
  currStep: BookingStep;
  setCurrStep: React.Dispatch<React.SetStateAction<BookingStep>>;
};

const bookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currStep, setCurrStep] = useState<BookingStep>("location");

  const value = useMemo(
    () => ({ steps: bookingSteps, currStep, setCurrStep }),
    [currStep, setCurrStep]
  );
  return (
    <bookingContext.Provider value={value}>{children}</bookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(bookingContext);
  if (!context) {
    throw new Error("useBooking 必須在 BookingProvider 中使用");
  }
  return context;
};
