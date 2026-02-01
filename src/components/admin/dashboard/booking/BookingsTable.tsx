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
import {
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";

type BookingsTableProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
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
    return data.data.sort(
      (a, b) =>
        new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime(),
    );
  }, [data]);

  // 查詢與篩選狀態
  // 使用 inputQuery 作為即時輸入，query 為經過防抖處理後的查詢字串
  const [inputQuery, setInputQuery] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");

  // 防抖 inputQuery -> query
  useEffect(() => {
    const id = setTimeout(() => setQuery(inputQuery.trim()), 350);
    return () => clearTimeout(id);
  }, [inputQuery]);

  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const serviceName = servicesMap.get(b.service_id)?.name || "";
        return (
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_phone.toLowerCase().includes(q) ||
          b.customer_email.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          serviceName.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [bookings, query, statusFilter, servicesMap]);

  return (
    <div
      className={cn("card w-full rounded-xl overflow-auto", className)}
      {...rest}
    >
      {/* 篩選列 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-(--border)">
        <div className="flex items-center gap-3 w-full">
          <input
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="搜尋顧客、電話、Email、服務或預約編號"
            className="w-full sm:w-80 px-3 py-2 rounded-md border bg-(--surface) text-(--foreground) placeholder:(--muted)"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md border bg-(--surface) text-(--foreground)"
          >
            <option value="all">全部狀態</option>
            {Object.entries(statusMap).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-(--muted) text-nowrap">
          {filteredBookings.length} 筆資料
        </div>
      </div>

      <table className={cn("w-full text-left")}>
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
          ) : filteredBookings.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-12 px-4 text-center text-sm text-(--muted)"
              >
                目前沒有符合條件的預約紀錄
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking) => (
              <TableRow
                key={booking.id}
                item={booking}
                service={servicesMap.get(booking.service_id)}
              />
            ))
          )}
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

  const handleStatusChange = useCallback(
    (newStatus: SupabaseBooking["status"]) => {
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
    },
    [item, token, mutate],
  );

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
      <td className="px-6 py-4 whitespace-nowrap">
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
