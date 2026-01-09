"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const bookingSteps = [
  { value: "location", label: "地點" },
  { value: "service", label: "服務" },
  { value: "time", label: "時間" },
  { value: "info", label: "資料" },
] as const;

export type BookingStep = (typeof bookingSteps)[number]["value"];
export type BookingData = {
  location: string | undefined;
  service: string | undefined;
  time: string | undefined;
  info: string | undefined;
};

interface BookingContextType {
  // 核心狀態
  currStep: BookingStep;

  // 導航動作
  setCurrStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  getStepIndex: (step: BookingStep) => number;

  // 資料操作
  data: BookingData;
  setBookingData: (key: BookingStep, value: string | undefined) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currStep, setCurrStep] = useState<BookingStep>(bookingSteps[0].value);
  const [data, setData] = useState<BookingData>({
    location: undefined,
    service: undefined,
    time: undefined,
    info: undefined,
  });

  const prevStep = useCallback(() => {
    setCurrStep((prev) => {
      const idx = bookingSteps.findIndex((s) => s.value === prev);
      if (idx > 0) return bookingSteps[idx - 1].value;
      return prev;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrStep((prev) => {
      const idx = bookingSteps.findIndex((s) => s.value === prev);
      if (idx < bookingSteps.length - 1) return bookingSteps[idx + 1].value;
      return prev;
    });
  }, []);

  const getStepIndex = useCallback((step: BookingStep) => {
    return bookingSteps.findIndex((s) => s.value === step);
  }, []);

  const setBookingData = useCallback(
    (key: BookingStep, value: string | undefined) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const value = useMemo(
    () => ({
      currStep,
      setCurrStep,
      nextStep,
      prevStep,

      getStepIndex,
      data,
      setBookingData,
    }),
    [currStep, data, getStepIndex, nextStep, prevStep, setBookingData]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking 必須在 BookingProvider 中使用");
  }
  return context;
};
