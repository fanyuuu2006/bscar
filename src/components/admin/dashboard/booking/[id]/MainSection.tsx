"use client";
import { TimeSlotSelector } from "@/components/booking/[locationId]/[serviceId]/TimeSlotSelector";
import { useAdminToken } from "@/hooks/useAdminToken";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking, SupabaseService } from "@/types";
import { getServices, updateBookingByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type MainSectionProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    booking: SupabaseBooking | null;
  }
>;
export const MainSection = ({
  booking,
  className,
  ...rest
}: MainSectionProps) => {
  const [newBooking, setNewBooking] = useState<SupabaseBooking | null>(booking);
  const [services, setServices] = useState<SupabaseService[]>([]);
  const { token } = useAdminToken();
  const router = useRouter();

  /**
   * 通用的欄位更新器，使用 functional update，避免依賴外部可變物件
   * 使用泛型確保 key 與 value 的型別相符
   */
  const handleChange = useCallback(
    <T extends keyof SupabaseBooking>(key: T, value: SupabaseBooking[T]) => {
      setNewBooking((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  /** 儲存變更：使用 async/await，並在成功後導回列表 */
  const handleSave = useCallback(async () => {
    if (!token || !newBooking) return;
    const res = await updateBookingByAdmin(token, newBooking);
    if (res.success) {
      router.push("/admin/dashboard/booking");
    } else {
      // 保持原有的使用者提示行為
      alert(`保存失敗${res.message ? `：${res.message}` : ""}`);
    }
  }, [newBooking, router, token]);

  /** 一次性取得服務列表 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getServices();
      if (!mounted) return;
      if (res.success && res.data) setServices(res.data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 常用表單欄位定義 memo 化，避免每次 render 重建陣列
  const customerFields = useMemo(
    () =>
      [
        { key: "customer_name", label: "姓名", type: "text" },
        { key: "customer_phone", label: "電話", type: "text" },
        { key: "customer_email", label: "電子郵件", type: "email" },
      ] as const,
    [],
  );
  // 客戶欄位鍵的型別
  type CustomerFieldKey = (typeof customerFields)[number]["key"];

  // 專用事件處理器，避免在 JSX 中建立過多匿名函式
  const onServiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("service_id", e.target.value);
    },
    [handleChange],
  );

  const onStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("status", e.target.value as SupabaseBooking["status"]);
    },
    [handleChange],
  );

  const onInputChange = useCallback(
    (key: CustomerFieldKey, e: React.ChangeEvent<HTMLInputElement>) => {
      // 由於 input 值為字串，這裡使用 unknown 轉成 booking 欄位型別，避免使用 any
      handleChange(
        key as keyof SupabaseBooking,
        e.target.value as unknown as SupabaseBooking[keyof SupabaseBooking],
      );
    },
    [handleChange],
  );

  const onDateChange = useCallback(
    (date: Date) => {
      handleChange("booking_time", formatDate("YYYY-MM-DD HH:mm:ss", date));
    },
    [handleChange],
  );

  // 若尚無 booking 則不渲染（保持原邏輯），放在 hooks 宣告之後以符合 React Hooks 規範
  if (!newBooking) return null;

  return (
    <section className={cn(className)} {...rest}>
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-3xl font-black">編輯預約</h2>

        {/* ===== 預約資訊 ===== */}
        <div className="card p-4 rounded-xl">
          <h3 className="text-2xl font-extrabold">預約資訊</h3>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-bold">預約編號</span>
              <span className="font-light">{newBooking.id}</span>
            </div>

            <div className="flex flex-col">
              <label className="font-bold">服務</label>
              <select
                value={newBooking.service_id}
                onChange={onServiceChange}
                className="p-2 border-(--border) rounded-lg bg-black/5"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="font-bold">預約時間</span>
              <span className="font-light">
                {formatDate("YYYY/MM/DD hh:mm A", newBooking.booking_time)}
              </span>
              <TimeSlotSelector
                className="w-full mt-2"
                locationId={newBooking.location_id}
                serviceId={newBooking.service_id}
                value={new Date(newBooking.booking_time)}
                onChange={onDateChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold">狀態</label>
              <select
                value={newBooking.status}
                onChange={onStatusChange}
                className="p-2 border-(--border) rounded-lg bg-black/5"
              >
                {Object.entries(statusMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===== 顧客資訊 ===== */}
        <div className="card p-4 rounded-xl">
          <h3 className="text-2xl font-extrabold">顧客資訊</h3>
          <div className="mt-2 flex flex-col gap-2">
            {customerFields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="font-bold mb-1" htmlFor={field.key}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={newBooking[field.key as keyof SupabaseBooking] || ""}
                  onChange={(e) =>
                    onInputChange(field.key as CustomerFieldKey, e)
                  }
                  className="p-2 border-(--border) rounded-lg bg-black/5"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex">
          <div className="ms-auto">
            <button
              className="btn primary rounded-xl px-6 py-2.5"
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
