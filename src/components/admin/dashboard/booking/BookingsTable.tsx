"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import {
  bookingsByAdmin,
  getServiceById,
} from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useEffect, useState } from "react";
import useSWR from "swr";

const statusMap: Record<
  SupabaseBooking["status"],
  { label: string; className: string }
> = {
  pending: { label: "待處理", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "已確認", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
  completed: { label: "已完成", className: "bg-gray-100 text-gray-800" },
};

type BookingsTableProps = DistributiveOmit<
  React.TableHTMLAttributes<HTMLTableElement>,
  "children"
>;

export const BookingsTable = ({ className, ...rest }: BookingsTableProps) => {
  const { token } = useAdminToken();

  const { data, isLoading } = useSWR(
    token ? ["admin-bookings", token] : null,
    () => bookingsByAdmin(token!),
  );

  const bookings = data?.data || [];

  if (isLoading) {
    return <div className="p-8 text-center text-(--muted)">載入中...</div>;
  }

  if (data?.success === false || (!isLoading && !data)) {
    return <div className="p-8 text-center text-red-500">無法載入預約資料</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center text-(--muted)">目前沒有預約資料</div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-sm text-left", className)} {...rest}>
        <thead className="text-xs uppercase bg-(--background) text-(--muted) border-b border-(--border)">
          <tr>
            <th className="px-6 py-3 font-medium whitespace-nowrap">
              預約編號
            </th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">
              顧客資訊
            </th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">
              服務項目
            </th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">
              預約時間
            </th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">狀態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border) bg-white">
          {bookings.map((item) => (
            <TableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

type TableRowProps = OverrideProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  {
    item: SupabaseBooking;
    service?: SupabaseService;
    location?: SupabaseLocation;
  }
>;

const TableRow = ({ item, className, ...rest }: TableRowProps) => {
  const [service, setService] = useState<SupabaseService | null>(null);
  const status = statusMap[item.status];

  useEffect(() => {
    const fetchData = async () => {
      const { service_id } = item;
      getServiceById(service_id)
        .then((res) => {
          if (res.success) {
            setService(res.data || null);
          } else {
            setService(null);
          }
        })
        .catch(() => {
          setService(null);
        });
    };
    fetchData();
  }, [item]);

  return (
    <tr
      className={cn(
        "hover:bg-(--background) transition-colors duration-200",
        className,
      )}
      {...rest}
    >
      <td className="px-6 py-4 font-mono text-xs text-(--muted)">
        {item.id}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-(--foreground)">
            {item.customer_name}
          </span>
          <span className="text-xs text-(--muted)">{item.customer_phone}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-(--foreground)">
        {service?.name || (
          <span className="text-(--muted)">未知服務</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-(--foreground)">
            {formatDate("YYYY/MM/DD", item.booking_time)}
          </span>
          <span className="text-xs text-(--muted)">
            {formatDate("HH:mm", item.booking_time)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            status.className,
          )}
        >
          {status.label}
        </span>
      </td>
    </tr>
  );
};
