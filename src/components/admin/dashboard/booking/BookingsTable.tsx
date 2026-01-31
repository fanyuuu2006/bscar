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
          <thead className="bg-(--background) text-xs uppercase tracking-wider text-(--muted)">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                預約編號
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                顧客資訊
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                服務項目
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                預約時間
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                狀態
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 px-4 text-center text-sm text-(--muted)"
                >
                  載入中...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 px-4 text-center text-sm text-(--muted)"
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
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "已確認",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "已取消",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  completed: {
    label: "已完成",
    className: "bg-gray-50 text-gray-700 border-gray-200",
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
    <tr
      className={cn(className)}
      {...rest}
    >
      <td className="px-6 py-4 text-xs">
        <span className="font-mono text-(--muted)">
          #{item.id.slice(0, 8)}...
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-(--foreground)">
            {item.customer_name}
          </span>
          <div className="flex flex-col text-xs text-(--muted)">
            <span>{item.customer_phone}</span>
            <span>{item.customer_email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="text-(--foreground)">
          {service ? service.name : "..."}
        </span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <div className="text-(--foreground)">
          {formatDate("YYYY/MM/DD", item.booking_time)}
        </div>
        <div className="text-xs text-(--muted)">
          {formatDate("hh:mm A", item.booking_time)}
        </div>
      </td>
      <td className="px-6 py-4  whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            status.className,
          )}
        >
          {status.label}
        </span>
      </td>
    </tr>
  );
};
