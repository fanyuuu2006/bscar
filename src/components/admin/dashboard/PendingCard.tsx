"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { RightOutlined, SnippetsOutlined } from "@ant-design/icons";
import Link from "next/link";
import useSWR from "swr";

type PendingCardProps = React.HTMLAttributes<HTMLDivElement>;

export const PendingCard = ({ className, ...rest }: PendingCardProps) => {
  const { token } = useAdminToken();

  const { data, isLoading } = useSWR(
    token ? ["admin-stats-pending", token] : null,
    () =>
      bookingsByAdmin(token!, {
        status: "pending",
      }),
  );

  const count = data?.data?.length || 0;

  return (
    <div
      className={cn(
        "card relative flex flex-col justify-between overflow-hidden rounded-3xl p-6",
        className,
      )}
      {...rest}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-(--muted)">待處理預約</p>
          <p className="mt-2 text-4xl font-bold text-(--accent)">
            {isLoading ? "-" : count}
          </p>
        </div>
        <div className="rounded-full bg-orange-50 p-3 text-(--accent)">
          <SnippetsOutlined className="text-xl" />
        </div>
      </div>
      <Link href={`/admin/dashboard/booking`} className="mt-4 flex items-center text-sm text-(--muted) hover:text-(--primary) transition-colors duration-300">
        查看詳情 <RightOutlined className="ml-1 text-xs" />
      </Link>
    </div>
  );
};
