"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { bookingsByAdmin, getServiceById } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { useEffect, useState } from "react";
import useSWR from "swr";

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

  return (
    <table className={cn("w-full text-left", className)} {...rest}>
      <thead className="text-xs bg-(--background) text-(--muted) border-b border-(--border)">
        <tr>
          <th className="px-6 py-3 font-medium whitespace-nowrap">預約編號</th>
          <th className="px-6 py-3 font-medium whitespace-nowrap">顧客資訊</th>
          <th className="px-6 py-3 font-medium whitespace-nowrap">服務項目</th>
          <th className="px-6 py-3 font-medium whitespace-nowrap">預約時間</th>
          <th className="px-6 py-3 font-medium whitespace-nowrap">狀態</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-(--border) bg-white">
        {isLoading ? (
          <tr>
            <td
              colSpan={5}
              className="py-6 px-4 text-center text-sm text-(--muted)"
            >
              載入中...
            </td>
          </tr>
        ) : bookings.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="py-6 px-4 text-center text-sm text-(--muted)"
            >
              目前沒有預約紀錄
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <TableRow key={booking.id} item={booking} />
          ))
        )}
      </tbody>
    </table>
  );
};

const statusMap: Record<
  SupabaseBooking["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "待處理",
    className: "bg-yellow-100 text-yellow-900 border-yellow-900",
  },
  confirmed: {
    label: "已確認",
    className: "bg-green-100 text-green-900 border-green-900",
  },
  cancelled: {
    label: "已取消",
    className: "bg-red-100 text-red-900 border-red-900",
  },
  completed: {
    label: "已完成",
    className: "bg-gray-100 text-gray-900 border-gray-900",
  },
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
    <tr className={cn(className)} {...rest}>
      <td className="py-6 px-4 text-xs truncate max-w-[14ch]" title={item.id}>
        <span className="">{item.id}</span>
      </td>
      <td className="py-6 px-4 text-sm">
        <div className="flex flex-col">
          <span className="font-medium text-(--foreground)">
            {item.customer_name}
          </span>
          <span className="text-(--muted)">{item.customer_phone}</span>
          <span className="text-(--muted)">{item.customer_email}</span>
        </div>
      </td>
      <td className="py-6 px-4 text-sm">
        <span className="font-medium text-(--foreground)">
          {service ? service.name : "載入中..."}
        </span>
      </td>
      <td className="py-6 px-4 text-sm">
        {formatDate("YYYY/MM/DD hh:mm A", item.booking_time)}
      </td>
      <td className="py-6 px-4">
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            status.className,
          )}
        >
          {status.label}
        </span>
      </td>
    </tr>
  );
};
