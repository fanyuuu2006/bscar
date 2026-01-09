"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const bookingSteps = [
  { id: 1, value: "location", label: "地點" },
  { id: 2, value: "service", label: "服務" },
  { id: 3, value: "time", label: "時間" },
  { id: 4, value: "info", label: "資訊" },
] as const;

export type BookingStep = (typeof bookingSteps)[number]["value"];

export type Location = {
  id: string;
  city: string; // 例如：台北
  branch: string; // 例如：信義店
  address: string;
  imageUrl?: string; // 若為 undefined 則顯示預設圖標
};

type BookingContextType = {
  data: Record<
    BookingStep,
    { get: () => string | undefined; set: (value: string) => void }
  >;
  currStep: BookingStep;
  setCurrStep: React.Dispatch<React.SetStateAction<BookingStep>>;
  prevStep: () => void;
  nextStep: () => void;
};

const bookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currStep, setCurrStep] = useState<BookingStep>("location");
  const [data, setData] = useState<Record<BookingStep, string | undefined>>({
    location: undefined,
    service: undefined,
    time: undefined,
    info: undefined,
  });

  const prevStep = useCallback(() => {
    setCurrStep((prev) => {
      const currentIndex = bookingSteps.findIndex(
        (step) => step.value === prev
      );
      if (currentIndex > 0) {
        return bookingSteps[currentIndex - 1].value;
      }
      return prev;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrStep((prev) => {
      const currentIndex = bookingSteps.findIndex(
        (step) => step.value === prev
      );
      if (currentIndex < bookingSteps.length - 1) {
        return bookingSteps[currentIndex + 1].value;
      }
      return prev;
    });
  }, []);

  const value = useMemo(
    () => ({ currStep, setCurrStep, data, prevStep, nextStep }),
    [currStep, data, prevStep, nextStep]
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
