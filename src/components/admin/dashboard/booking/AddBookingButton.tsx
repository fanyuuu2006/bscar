"use client";
import { useAdmin } from "@/contexts/AdminContext";
import { useModal } from "@/hooks/useModal";
import { postBooking } from "@/utils/backend";
import { cn } from "@/utils/className";
import { PlusOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useState } from "react";

type AddBookingButtonProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    mutate: () => void;
  }
>;

export const AddBookingButton = ({
  mutate,
  className,
  ...rest
}: AddBookingButtonProps) => {
  const modal = useModal({});
  const { admin } = useAdmin();
  const [booking, setBooking] = useState<
    Partial<Parameters<typeof postBooking>[0]>
  >({
    location_id: admin?.location_id,
    service_id: undefined,
    time: undefined,
    info: undefined,
  });

  return (
    <>
      <button
        onClick={modal.open}
        className={cn(
          "btn flex items-center gap-1 p-1.5 text-xs rounded-md",
          className,
        )}
        {...rest}
      >
        <PlusOutlined />
        <span className="tooltip-text">新增預約</span>
      </button>

      <modal.Container className="flex items-center justify-center">
        <div className="card p-6 w-full max-w-md"></div>
      </modal.Container>
    </>
  );
};
