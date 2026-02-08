"use client";
import { useModal } from "@/hooks/useModal";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { SupabaseBooking } from "@/types";

type BookingModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (id: SupabaseBooking["id"]) => void;
  }
>;

const bookingModalContext = createContext<BookingModalContextType | null>(null);

export const BookingModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [id, setId] = useState<SupabaseBooking["id"] | null>(null);
  const modal = useModal({});
  const value = useMemo(
    () => ({
      ...modal,
      open: (id: SupabaseBooking["id"]) => {
        modal.open();
        setId(id);
      },
    }),
    [modal],
  );

  return (
    <bookingModalContext.Provider value={value}>
      {children}
      <modal.Container
        data-theme={id}
        className="flex items-center justify-center p-4 z-50"
      >
        {id ? (
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg card flex flex-col items-center p-4 sm:p-6 gap-4 animate-pop"></div>
        ) : null}
      </modal.Container>
    </bookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(bookingModalContext);
  if (!context) {
    throw new Error("useBookingModal 必須在 BookingModalProvider 內使用");
  }
  return context;
};
