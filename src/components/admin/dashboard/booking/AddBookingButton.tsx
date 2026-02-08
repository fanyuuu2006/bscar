"use client";
import { TimeSlotSelector } from "@/components/booking/[locationId]/[serviceId]/TimeSlotSelector";
import { useAdmin } from "@/contexts/AdminContext";
import { useModal } from "@/hooks/useModal";
import { SupabaseService } from "@/types";
import { postBooking } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { PlusOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useCallback, useState } from "react";

type AddBookingButtonProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    mutate: () => void;
    services: SupabaseService[];
  }
>;

export const AddBookingButton = ({
  services,
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
    service_id: services.length > 0 ? services[0].id : undefined,
    time: undefined,
    info: undefined,
  });

  const handleChange = useCallback(
    <T extends keyof typeof booking>(key: T, value: (typeof booking)[T]) => {
      setBooking((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  if (!admin || services.length < 0) return null;

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

      <modal.Container className="animate-appear flex items-center justify-center">
        <div className="card p-6 w-full max-w-md rounded-xl">
          <h3 className="text-lg font-semibold mb-4">新增預約</h3>
          <div className="flex flex-col gap-4">
            {/* 服務選擇 */}
            <div className="flex flex-col">
              <label className="font-bold">服務</label>
              <select
                value={booking.service_id}
                onChange={(e) => handleChange("service_id", e.target.value)}
                className="p-2 border-(--border) border rounded-lg bg-gray-50/50"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 預約時間選擇 */}
            <div className="flex flex-col">
              <TimeSlotSelector
                locationId={admin.location_id}
                serviceId={booking.service_id!}
                value={booking.time ? new Date(booking.time) : undefined}
                onChange={(date) =>
                  handleChange(
                    "time",
                    date ? formatDate("YYYY-MM-DD HH:mm:ss", date) : undefined,
                  )
                }
              />
            </div>
          </div>
        </div>
      </modal.Container>
    </>
  );
};
