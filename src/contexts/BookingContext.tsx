"use client";
import { createContext, useContext, useMemo, useState } from "react";

const bookingTags = [
  { value: "location", label: "地點" },
  { value: "service", label: "服務" },
  { value: "time", label: "時間" },
  { value: "info", label: "資訊" },
] as const;

export type BookingTag = (typeof bookingTags)[number]["value"];

type BookingContextType = {
  tags: typeof bookingTags;
  currTag: BookingTag;
  setCurrTag: React.Dispatch<React.SetStateAction<BookingTag>>;
};

const bookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currTag, setCurrTag] = useState<BookingTag>("location");

  const value = useMemo(
    () => ({ tags: bookingTags, currTag, setCurrTag }),
    [currTag, setCurrTag]
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
