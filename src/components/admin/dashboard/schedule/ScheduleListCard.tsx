"use client";
import { CalendarOutlined } from "@ant-design/icons";
import { ScheduleCard } from "../ScheduleCard";
import { SupabaseBooking, SupabaseService } from "@/types";
import { getServices } from "@/utils/backend";
import { useMemo } from "react";
import useSWR from "swr";
import { OverrideProps } from "fanyucomponents";
import { cn } from "@/utils/className";

type ScheduleListCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    title?: React.ReactNode;
    bookings: SupabaseBooking[];
  }
>;

export const ScheduleListCard = ({
  className,
  bookings,
  title,
  ...rest
}: ScheduleListCardProps) => {
  const { data: servicesResp } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    if (servicesResp?.data) {
      servicesResp.data.forEach((s) => map.set(s.id, s));
    }
    return map;
  }, [servicesResp]);

  return (
    <div
      className={cn(
        "card min-h-full flex flex-col gap-4 rounded-2xl p-5 shadow-sm",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between pb-3 border-b border-(--border)">
        <h2 className="text-lg font-bold text-(--foreground) flex items-center gap-2">
          {title || "行程列表"}
        </h2>
        <span className="text-xs font-medium text-(--muted) bg-(--background) px-2.5 py-1 rounded-full border border-(--border)">
          共 {bookings.length} 筆
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <ScheduleCard
              key={b.id}
              booking={b}
              service={servicesMap.get(b.service_id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-(--muted)">
            <div className="w-16 h-16 rounded-full bg-(--background) flex items-center justify-center mb-3 border border-(--border) border-dashed">
              <CalendarOutlined className="text-2xl" />
            </div>
            <span className="text-sm font-medium">本日暫無預約</span>
            <span className="text-xs mt-1">請選擇其他日期查看</span>
          </div>
        )}
      </div>
    </div>
  );
};
