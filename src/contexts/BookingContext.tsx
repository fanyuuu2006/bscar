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
  { value: "info", label: "填寫資料" },
] as const;

export type BookingStep = (typeof bookingSteps)[number]["value"];

export type Location = {
  id: string;
  city: string;
  branch: string;
  address: string;
  open_time: `${number}:${number}`;
  close_time: `${number}:${number}`;
  image_url?: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  description?: string;
  image_url?: string;
};

export type Time = Date;

export type Info = {
  name: string;
  phone: string;
  email: string;
};

export type BookingData = {
  location: Location | undefined;
  service: Service | undefined;
  time: Time | undefined;
  info: Info | undefined;
};

interface BookingContextType {
  currStep: BookingStep;
  toStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  getStepIndex: (step: BookingStep) => number;

  data: BookingData;

  setBookingData: <K extends keyof BookingData>(
    key: K,
    value: BookingData[K]
  ) => void;

  // 重置表單
  reset: () => void;
  // 送出預約
  submit: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

const INITIAL_DATA: BookingData = {
  location: undefined,
  service: undefined,
  time: undefined,
  info: undefined,
};

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currStep, setCurrStep] = useState<BookingStep>(bookingSteps[0].value);
  const [data, setData] = useState<BookingData>(INITIAL_DATA);

  const toStep = useCallback((step: BookingStep) => {
    // 先清除後續步驟的值
    setData((prev) => {
      const newData = { ...prev };
      const targetIdx = bookingSteps.findIndex((s) => s.value === step);
      bookingSteps.forEach((s, idx) => {
        if (idx > targetIdx) {
          newData[s.value as keyof BookingData] = undefined;
        }
      });
      return newData;
    });
    setCurrStep(step);
  }, []);

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
    <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setData(INITIAL_DATA);
    setCurrStep(bookingSteps[0].value);
  }, []);

  const submit = useCallback(() => {}, []);

  const value = useMemo(
    () => ({
      currStep,
      toStep,
      nextStep,
      prevStep,
      getStepIndex,
      data,
      setBookingData,
      reset,
      submit,
    }),
    [
      currStep,
      toStep,
      nextStep,
      prevStep,
      getStepIndex,
      data,
      setBookingData,
      reset,
      submit,
    ]
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
