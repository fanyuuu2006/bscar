"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
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
  const [service, setService] = useState<SupabaseService | null>(null);
  const [services, setServices] = useState<SupabaseService[]>([]);
  const { token } = useAdminToken();
  const router = useRouter();
  const handleSave = useCallback(() => {
    if (!token || !newBooking) return;
    updateBookingByAdmin(token, newBooking).then((res) => {
      if (res.success) {
        router.push("/admin/dashboard/booking");
      } else {
        alert("保存失敗，請稍後再試");
      }
    });
  }, [newBooking, router, token]);

  useEffect(() => {
    const fetchData = async () => {
      getServices().then((res) => {
        if (res.success && res.data) {
          setServices(res.data);
          res.data.forEach((s) => {
            if (s.id === newBooking?.service_id) {
              setService(s);
            }
          });
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
              <span className="font-bold">服務</span>
              <span className="font-light">
                {service ? service.name : newBooking.service_id}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">預約時間</span>
              <span className="font-light">
                {formatDate("YYYY/MM/DD hh:mm A", newBooking.booking_time)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex">
          <div className="ms-auto">
            <button className="btn primary rounded-xl px-6 py-2.5" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
