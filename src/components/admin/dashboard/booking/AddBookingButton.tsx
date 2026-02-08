"use client";
import { TimeSlotSelector } from "@/components/booking/[locationId]/[serviceId]/TimeSlotSelector";
import { useAdmin } from "@/contexts/AdminContext";
import { useModal } from "@/hooks/useModal";
import { Info, SupabaseService } from "@/types";
import { postBooking } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { PlusOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldInput, FieldInputProps } from "../FieldInput";

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
  const [loading, setLoading] = useState(false);

  const defaultValue: Partial<Parameters<typeof postBooking>[0]> =
    useMemo(() => {
      return {
        location_id: admin?.location_id,
        service_id: services.length > 0 ? services[0].id : undefined,
        time: undefined,
        info: {
          name: "",
          phone: "",
          line: "",
        },
      };
    }, [admin?.location_id, services]);

  const [booking, setBooking] =
    useState<Partial<Parameters<typeof postBooking>[0]>>(defaultValue);

  useEffect(() => {
    if (admin?.location_id) {
      setBooking((prev) => ({
        ...prev,
        location_id: admin.location_id,
      }));
    }
  }, [admin?.location_id]);

  const handleChange = useCallback(
    <T extends keyof typeof booking>(key: T, value: (typeof booking)[T]) => {
      setBooking((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleInfoChange = useCallback((key: keyof Info, value: string) => {
    setBooking((prev) => ({
      ...prev,
      info: { ...((prev.info || {}) as Info), [key]: value },
    }));
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setBooking((prev) => ({
      ...prev,
      time: formatDate("YYYY-MM-DD HH:mm:ss", date),
    }));
  }, []);

  const handleCreate = async () => {
    if (
      !booking.location_id ||
      !booking.service_id ||
      !booking.time ||
      !booking.info
    ) {
      alert("請填寫所有欄位");
      return;
    }
    if (!booking.info.name || !booking.info.phone) {
      alert("請填寫姓名與電話");
      return;
    }

    setLoading(true);
    try {
      const res = await postBooking({
        location_id: booking.location_id,
        service_id: booking.service_id,
        time: booking.time,
        info: booking.info as Info,
      });
      if (res.success) {
        modal.close();
        alert("預約建立成功");
        mutate();
        setBooking(defaultValue);
      } else {
        alert(res.message || "新增失敗");
      }
    } catch (e) {
      console.error(e);
      alert("發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  const infoFields: FieldInputProps["field"][] = useMemo(
    () => [
      { require: true, id: "name", label: "姓名", type: "text" },
      { require: true, id: "phone", label: "電話", type: "tel" },
      { require: true, id: "line", label: "Line ID", type: "text" },
    ],
    [],
  );

  if (!admin || services.length <= 0) return null;

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

      <modal.Container className="animate-appear flex items-center justify-center p-4">
        <div className="card p-4 md:p-6 w-full max-w-xl rounded-xl flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-extrabold">新增預約</h3>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            {/* 服務選擇 */}
            <div className="flex flex-col gap-2">
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

            {/* 客戶資訊 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold">顧客資訊</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoFields.map((field) => (
                  <FieldInput
                    key={field.id}
                    field={field}
                    value={booking.info?.[field.id as keyof Info] || ""}
                    onChange={(e) =>
                      handleInfoChange(field.id as keyof Info, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>

            {/* 預約時間選擇 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold">預約時間</label>
              <div className="p-2 rounded-lg">
                {booking.location_id && booking.service_id ? (
                  <TimeSlotSelector
                    locationId={booking.location_id}
                    serviceId={booking.service_id}
                    value={booking.time ? new Date(booking.time) : null}
                    onChange={handleDateChange}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-gray-500">請先選擇服務</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={modal.close}
              className="btn secondary px-6 py-2 rounded-xl font-medium"
              disabled={loading}
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              className="btn primary px-6 py-2 rounded-xl font-medium"
              disabled={loading}
            >
              {loading ? "處理中..." : "建立預約"}
            </button>
          </div>
        </div>
      </modal.Container>
    </>
  );
};
