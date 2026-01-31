"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { bookingsByAdmin, getServices } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { useMemo } from "react";
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

  const { data: servicesRes } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    servicesRes?.data?.forEach((s) => map.set(s.id, s));
    return map;
  }, [servicesRes]);

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
          <th className="px-6 py-4 font-semibold whitespace-nowrap">狀態</th>
          <th className="px-6 py-4 font-semibold whitespace-nowrap">操作</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-(--border)">
        {isLoading ? (
          <tr>
            <td
              colSpan={6}
              className="py-12 px-4 text-center text-sm text-(--muted)"
            >
              載入中...
            </td>
          </tr>
        ) : bookings.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="py-12 px-4 text-center text-sm text-(--muted)"
            >
              目前沒有預約紀錄
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <TableRow
              key={booking.id}
              item={booking}
              service={servicesMap.get(booking.service_id)}
            />
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

type OperationItem<T extends React.ElementType = React.ElementType> = {
  label: string;
  component: T;
  props: React.ComponentProps<T>;
  Icon: React.ElementType;
};

const TableRow = ({ item, service, className, ...rest }: TableRowProps) => {
  const status = statusMap[item.status];

  const operations = useMemo<OperationItem[]>(
    () => [
      {
        label: "編輯",
        component: Link,
        props: {
          href: `/admin/dashboard/booking/${item.id}`,
          className:
            "text-blue-600 border-blue-200",
        },
        Icon: EditOutlined,
      },
      {
        label: "取消",
        component: "button",
        props: {
          type: "button",
          className:
            "text-red-600 border-red-200",
        },
        Icon: CloseOutlined,
      },
    ],
    [item.id],
  );

  return (
    <tr className={cn(className)} {...rest}>
      <td className="px-6 py-4 text-xs" title={item.id}>
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
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-2">
          {operations.map((oper) => {
            const { className: operClassName, ...operRest } = oper.props;
            return (
              <oper.component
                key={oper.label}
                title={oper.label}
                className={cn(
                  "flex items-center justify-center w-8 h-8 border rounded-md transition-colors",
                  operClassName,
                )}
                {...operRest}
              >
                <oper.Icon />
              </oper.component>
            );
          })}
        </div>
      </td>
    </tr>
  );
};
