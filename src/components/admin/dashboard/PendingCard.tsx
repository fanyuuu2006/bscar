"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import useSWR from "swr";

type PendingCardProps = React.HTMLAttributes<HTMLDivElement>;

export const PendingCard = ({ className, ...rest }: PendingCardProps) => {
  const { token } = useAdminToken();

  const { data, isLoading } = useSWR(
    token ? ["admin-booking-pending", token] : null,
    () =>
      bookingsByAdmin(token!, {
        status: "pending",
      }),
  );

  const count = data?.data?.length || 0;

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">待處理預約</h3>
          {isLoading ? (
            <div className="h-10 w-16 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <p className="text-4xl font-bold text-(--accent)">{count}</p>
          )}
        </div>
        <div>
          <Link
            href={`/admin/dashboard/booking?status=pending`}
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
