"use client";
import { postBooking } from "@/utils/backend";
import { formatDate } from "@/utils/date";
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
  open_time: string;
  close_time: string;
  image_url: string | undefined;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  description: string | undefined;
  image_url: string | undefined;
};

export type TimeSlot = {
  start_time: `${number}:${number}:${number}`;
};

export type Info = {
  name: string;
  phone: string;
  email: string;
};

export type BookingData = {
  location: Location["id"] | undefined;
  service: Service["id"] | undefined;
  time: string | undefined;
  info: Info | undefined;
};

interface BookingContextType {
  currStep: BookingStep;
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

  const submit = useCallback(() => {
    const { location, service, time, info } = data;
    if (!location || !service || !time || !info) {
      return;
    }
    const location_id = location;
    const service_id = service;
    const booking_time = formatDate("YYYY-MM-DD HH:mm:ss", time);
    postBooking({ location_id, service_id, time: booking_time, info })
      .then((res) => {
        alert(res.message);
        if (res.success) reset();
      })
      .catch((err) => {
        alert("預約失敗，請稍後再試。");
        console.error("預約失敗:", err);
      });
  }, [data, reset]);

  const value = useMemo(
    () => ({
      currStep,
      getStepIndex,
      data,
      setBookingData,
      reset,
      submit,
    }),
    [currStep, getStepIndex, data, setBookingData, reset, submit]
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
