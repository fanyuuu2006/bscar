"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { RightOutlined } from "@ant-design/icons";
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
      });
    },
  );

  const count = data?.data?.length || 0;

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">今日預約總數</h3>
          {isLoading ? (
            <div className="h-10 w-16 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <p className="text-4xl font-bold text-(--accent)">{count}</p>
          )}
        </div>
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
