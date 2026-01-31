"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import {
  bookingsByAdmin,
  getServices,
  updateBookingByAdmin,
} from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { EditOutlined, CloseOutlined, CheckOutlined, StarOutlined } from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";

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

  const bookings = useMemo<SupabaseBooking[]>(() => {
    if (!data?.data) return [];
    return data.data.sort((a, b) =>
      new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime(),
    );
  }, [data]);

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
  const { token } = useAdminToken();
  const { mutate } = useSWRConfig();

  const handleStatusChange = useCallback((newStatus: SupabaseBooking['status']) => {
    if (!token) return;
    updateBookingByAdmin(token, { ...item, status: newStatus }).then(
      (res) => {
        if (res.success) {
            // 觸發 SWR 重新驗證以更新資料
            mutate(["admin-bookings", token]);
        } else {
          alert("更新預約狀態失敗，請稍後再試。");
        }
      },
    );
  }, [item, token, mutate]);

  const operations = useMemo<OperationItem[]>(
    () => [
      {
        label: "編輯",
        component: Link,
        props: {
          className: "text-yellow-600 border-yellow-600 bg-yellow-100",
          href: `/admin/dashboard/booking/${item.id}`,
        },
        Icon: EditOutlined,
      },
      {
        label: "確認",
        component: "button",
        props: {
          type: "button",
          onClick: () => handleStatusChange("confirmed"),
          disabled: item.status === "confirmed",
          className: "text-emerald-600 border-emerald-600 bg-emerald-100",
        },
        Icon: CheckOutlined,
      },
      {
        label: "完成",
        component: "button",
        props: {
          type: "button",
          onClick: () => handleStatusChange("completed"),
          className: "text-blue-600 border-blue-600 bg-blue-100",
          disabled: item.status === "completed",
        },
        Icon: StarOutlined,
      },
      {
        label: "取消",
        component: "button",
        props: {
          type: "button",
          onClick: () => handleStatusChange("cancelled"),
          disabled: item.status === "cancelled",
          className: "text-red-600 border-red-600 bg-red-100",
        },
        Icon: CloseOutlined,
      },
    ],
    [handleStatusChange, item.id, item.status],
  );

  return (
    <tr className={cn(className)} {...rest}>
      <td className="px-6 py-4 text-xs" title={item.id}>
        <span className="font-mono text-(--muted)">#{item.id.slice(0, 8)}...</span>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-(--foreground)">{item.customer_name}</span>
          <div className="flex flex-col text-xs text-(--muted)">
            <span>{item.customer_phone}</span>
            <span>{item.customer_email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="text-(--foreground)">{service ? service.name : "..."}</span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <div className="text-(--foreground)">{formatDate("YYYY/MM/DD", item.booking_time)}</div>
        <div className="text-xs text-(--muted)">{formatDate("hh:mm A", item.booking_time)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", status.className)}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {operations.map((oper) => {
            const { className: operClassName, ...operRest } = oper.props;
            return (
              <oper.component
                key={oper.label}
                className={cn(
                  "flex items-center p-2 rounded-md text-sm font-medium border tooltip",
                  operClassName,
                )}
                data-tooltip={oper.label}
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
