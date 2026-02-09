"use client";
import { TimeSlotSelector } from "@/components/TimeSlotSelector";
import { useAdmin } from "@/contexts/AdminContext";
import { useModal } from "@/hooks/useModal";
import { Info, SupabaseService } from "@/types";
import { postBooking } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldInput, FieldInputProps } from "../../../FieldInput";
import { FormatDateNode } from "@/components/FormatDateNode";

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

  // 使用 useCallback 確保每次獲取最新的預設值，解決時間 stale 問題
  const getDefaultValue = useCallback(
    () => ({
      location_id: admin?.location_id,
      service_id: services.length > 0 ? services[0].id : undefined,
      time: formatDate("YYYY-MM-DD HH:mm:ss", new Date()),
      info: {
        name: "",
        phone: "",
        line: "",
      },
    }),
    [admin?.location_id, services]
  );

  const [booking, setBooking] =
    useState<Partial<Parameters<typeof postBooking>[0]>>(getDefaultValue);

  // 當 admin 資料載入完成後，確保 location_id 正確寫入
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
    []
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

  const handleCreate = useCallback(async () => {
    const { location_id, service_id, time, info } = booking;
    
    if (!location_id || !service_id || !time || !info) {
      alert("請填寫所有欄位");
      return;
    }
    if (!info.name || !info.phone) {
      alert("請填寫姓名與電話");
      return;
    }

    setLoading(true);
    try {
      const res = await postBooking({
        location_id,
        service_id,
        time,
        info: info as Info,
      });
      if (res.success) {
        modal.close();
        alert("預約建立成功");
        mutate();
        setBooking(getDefaultValue()); // 重置為最新狀態
        if (res.data?.id) {
          setTimeout(() => {
            window.location.hash = `#${res.data!.id}`;
          }, 300);
        }
      } else {
        alert(res.message || "新增失敗");
      }
    } catch (e) {
      console.error(e);
      alert("發生錯誤");
    } finally {
      setLoading(false);
    }
  }, [booking, modal, mutate, getDefaultValue]);

  const handleClose = useCallback(() => {
    setBooking(getDefaultValue());
    modal.close();
  }, [getDefaultValue, modal]);

  const infoFields: FieldInputProps["field"][] = useMemo(
    () => [
      { required: true, id: "name", label: "姓名", type: "text" },
      { required: true, id: "phone", label: "電話", type: "tel" },
      { required: true, id: "line", label: "Line ID", type: "text" },
    ],
    []
  );

  if (!admin || services.length <= 0) return null;

  return (
    <>
      <button
        onClick={modal.open}
        className={cn(
          "btn flex items-center gap-1 p-1.5 text-xs rounded-md",
          className
        )}
        {...rest}
      >
        <PlusOutlined />
        <span>新增</span>
      </button>

      <modal.Container className="animate-appear flex items-center justify-center p-4">
        {modal.isOpen && (
          <div className="card p-4 md:p-6 w-full max-w-xl max-h-full rounded-xl flex flex-col">
            <div className="flex justify-between items-center border-b border-(--border) pb-2">
              <h3 className="text-2xl font-black">
                <PlusOutlined className="mr-1" />
                新增預約
              </h3>
            </div>

            <div className="flex flex-col py-4 max-h-full overflow-y-auto gap-4">
              {/* 預約資訊區塊 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-extrabold">預約資訊</h4>
                <div className="flex flex-col gap-4 pl-1">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm">服務項目</label>
                    <select
                      id="service-select"
                      name="service_id"
                      value={booking.service_id}
                      onChange={(e) =>
                        handleChange("service_id", e.target.value)
                      }
                      className="p-2.5 border-(--border) border rounded-lg bg-gray-50/50 outline-none focus:border-(--primary) transition-colors"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="time" className="font-bold text-sm">
                      預約時間
                    </label>
                    <FormatDateNode
                      date={[booking.time ?? ""]}
                      className="font-light text-sm"
                    >
                      YYYY/MM/DD hh:mm A
                    </FormatDateNode>
                    {booking.location_id && booking.service_id ? (
                      <TimeSlotSelector
                        id="time"
                        locationId={booking.location_id}
                        serviceId={booking.service_id}
                        value={booking.time ? new Date(booking.time) : null}
                        onChange={handleDateChange}
                        className="text-sm mt-2"
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500 text-sm">
                          請先選擇服務項目
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 顧客資訊區塊 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-extrabold">顧客資訊</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {infoFields.map((field) => (
                    <FieldInput
                      key={field.id}
                      field={field}
                      value={booking.info?.[field.id as keyof Info] || ""}
                      onChange={(e) =>
                        handleInfoChange(
                          field.id as keyof Info,
                          e.target.value
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="btn secondary px-6 py-2 rounded-xl font-medium min-w-25"
                disabled={loading}
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="btn primary px-6 py-2 rounded-xl font-medium min-w-25"
                disabled={loading}
              >
                {loading ? <LoadingOutlined /> : "新增"}
              </button>
            </div>
          </div>
        )}
      </modal.Container>
    </>
  );
};
