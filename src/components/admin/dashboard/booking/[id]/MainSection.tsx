"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking, SupabaseService } from "@/types";
import { getServices, updateBookingByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

  const handleChange = useCallback(
    <T extends keyof SupabaseBooking>(key: T, value: SupabaseBooking[T]) => {
      if (!newBooking) return;
      setNewBooking({
        ...newBooking,
        [key]: value,
      });
    },
    [newBooking],
  );

  const handleSave = useCallback(() => {
    if (!token || !newBooking) return;
    updateBookingByAdmin(token, newBooking).then((res) => {
      if (res.success) {
        router.push("/admin/dashboard/booking");
      } else {
        alert(`保存失敗${res.message ? `：${res.message}` : ""}`);
      }
    });
  }, [newBooking, router, token]);

  useEffect(() => {
    const fetchData = async () => {
      getServices().then((res) => {
        if (res.success && res.data) {
          setServices(res.data);
        }
      });
    };
    fetchData();
  }, [newBooking?.service_id]);

  if (!newBooking) return null;
  return (
    <section className={cn(className)} {...rest}>
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-3xl font-black">編輯預約</h2>

        {/* 預約資訊 */}
        <div className="card p-4 rounded-xl">
          <h3 className="text-2xl font-extrabold">預約資訊</h3>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-bold">預約編號</span>
              <span className="font-light">{newBooking.id}</span>
            </div>
            <div className="flex flex-col">
              <label className="font-bold mb-1">服務</label>
              <select
                value={newBooking.service_id}
                onChange={(e) => {
                  const sid = e.target.value;
                  handleChange("service_id", sid);
                }}
                className="mt-1 p-2 border border-(--border) rounded-lg bg-(--input-background) text-(--foreground)"
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
            </div>
            <div className="flex flex-col">
              <span className="font-bold">狀態</span>
              <span className="font-light">
                {statusMap[newBooking.status]
                  ? statusMap[newBooking.status].label
                  : newBooking.status}
              </span>
            </div>
          </div>
        </div>

        {/* 顧客資訊 */}
        <div className="card p-4 rounded-xl">
          <h3 className="text-2xl font-extrabold">顧客資訊</h3>
          <div className="mt-2 flex flex-col gap-2">
            {[
              { key: "customer_name", label: "姓名", type: "text" },
              {
                key: "customer_phone",
                label: "電話",
                type: "text",
              },
              {
                key: "customer_email",
                label: "電子郵件",
                type: "email",
              },
            ].map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="font-bold mb-1" htmlFor={field.key}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={newBooking[field.key as keyof SupabaseBooking] || ""}
                  onChange={(e) =>
                    handleChange(
                      field.key as keyof SupabaseBooking,
                      e.target.value,
                    )
                  }
                  className="mt-1 p-2 border border-(--border) rounded-lg bg-(--input-background) text-(--foreground)"
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
