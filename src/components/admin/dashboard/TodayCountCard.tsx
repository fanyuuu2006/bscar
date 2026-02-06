"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { CalendarOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";

type TodayCountCardProps = React.HTMLAttributes<HTMLDivElement>;

export const TodayCountCard = ({ className, ...rest }: TodayCountCardProps) => {
  const { token } = useAdminToken();

  const strToday = useMemo(() => formatDate("YYYY-MM-DD", new Date()), []);

  const { data, isLoading } = useSWR(
    token ? ["admin-booking-today", token] : null,
    () => {
      return bookingsByAdmin(token!, {
        start_date: strToday,
        end_date: strToday,
        status: "confirmed",
      });
    },
  );

  const count = data?.data?.length || 0;

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col h-full gap-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-(--foreground)">
          <CalendarOutlined className="text-blue-500" />
          今日預約總數
        </h3>
        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-blue-600 tracking-tight font-mono">
                {count}
              </span>
              <span className="text-base text-(--muted) font-medium">筆</span>
            </div>
          </div>
        )}
        <div>
          <Link
            href={`/admin/dashboard/booking?start_date=${strToday}&end_date=${strToday}`}
            className="group flex items-center text-sm font-medium text-(--muted) transition-colors duration-300 hover:text-(--primary)"
          >
            查看詳情
            <RightOutlined className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
