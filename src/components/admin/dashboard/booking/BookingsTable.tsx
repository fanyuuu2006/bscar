"use client";
import { useAdminToken } from "@/hooks/useAdminToken";
import { statusMap } from "@/libs/booking";
import { SupabaseBooking, SupabaseService } from "@/types";
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
  ArrowDownOutlined,
} from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect, memo } from "react";
import useSWR, { useSWRConfig } from "swr";

type BookingsTableProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const BookingsTable = ({ className, ...rest }: BookingsTableProps) => {
  const { token } = useAdminToken();

  const [apiQuery, setAPIQuery] = useState<
    Parameters<typeof bookingsByAdmin>["1"]
  >({});

  const { data, isLoading } = useSWR(
    token ? ["admin-bookings", token, apiQuery] : null,
    () => bookingsByAdmin(token!, apiQuery),
  );

  const { data: servicesRes } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    servicesRes?.data?.forEach((s) => map.set(s.id, s));
    return map;
  }, [servicesRes]);

  // 查詢與篩選狀態
  // 使用 inputQuery 作為即時輸入，query 為經過防抖處理後的查詢字串
  const [inputQuery, setInputQuery] = useState("");

  const [query, setQuery] = useState("");
  const [timeAscending, setTimeAscending] = useState<boolean>(false);

  // 防抖 inputQuery -> query
  useEffect(() => {
    const id = setTimeout(() => setQuery(inputQuery.trim()), 350);
    return () => clearTimeout(id);
  }, [inputQuery]);

  const filteredBookings = useMemo(() => {
    if (!data?.data) return [];

    const q = query.trim().toLocaleLowerCase();

    // 定義篩選條件策略
    const strategies = [
      {
        enable: !!q,
        check: (b: SupabaseBooking) => {
          const serviceName = servicesMap.get(b.service_id)?.name || "";
          // 搜尋欄位清單
          const searchFields = [
            b.customer_name,
            b.customer_phone,
            b.customer_email,
            b.id,
            serviceName,
          ];
          return searchFields.some((field) => field?.toLowerCase().includes(q));
        },
      },
    ];

    // 執行篩選
    const result = data.data.filter((booking) =>
      strategies.every((s) => !s.enable || s.check(booking)),
    );

    // 排序
    return result.sort((a, b) => {
      const timeA = new Date(a.booking_time).getTime();
      const timeB = new Date(b.booking_time).getTime();
      return timeAscending ? timeA - timeB : timeB - timeA;
    });
  }, [data, query, servicesMap, timeAscending]);

  return (
    <div
      className={cn("card rounded-xl overflow-hidden flex flex-col", className)}
      {...rest}
    >
      {/* 篩選列 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-(--border) bg-gray-50/30">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-64">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="搜尋編號、姓名、電話、Email..."
              className="w-full px-3 py-2 text-sm rounded-md border border-(--border) bg-black/5 text-(--foreground) placeholder:text-(--muted)"
            />
          </div>
          <div>
            <label className="select-none flex items-center gap-2 text-sm text-(--muted)">
              <input
                type="checkbox"
                onChange={(e) => {
                  const checked = e.target.checked;
                  const today = new Date();
                  if (checked) {
                    setAPIQuery((prev) => ({
                      ...prev,
                      date: formatDate("YYYY-MM-DD", today),
                    }));
                  } else {
                    setAPIQuery((prev) => ({
                      ...prev,
                      date: undefined,
                    }));
                  }
                }}
              />
              僅顯示今日
            </label>
          </div>
        </div>

        <div className="text-xs text-(--muted) font-medium">
          共 {filteredBookings.length} 筆預約
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-(--border) bg-gray-50/50 text-xs text-(--muted)">
              <th className="px-6 py-4 font-medium whitespace-nowrap">編號</th>
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                顧客資訊
              </th>
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span>服務項目</span>
                  <select
                    value={apiQuery?.service_id || "all"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAPIQuery((prev) => ({
                        ...prev,
                        service_id: val === "all" ? undefined : val,
                      }));
                    }}
                    className="p-0 text-xs font-medium"
                  >
                    <option value="all">全部</option>
                    {servicesRes?.data?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <span>預約時間</span>
                  <button onClick={() => setTimeAscending((prev) => !prev)}>
                    <ArrowDownOutlined
                      className={cn("transition-transform", {
                        "rotate-180": timeAscending,
                      })}
                    />
                  </button>
                </div>
              </th>
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span>狀態</span>
                  <select
                    value={apiQuery?.status || "all"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAPIQuery((prev) => ({
                        ...prev,
                        status:
                          val === "all"
                            ? undefined
                            : (val as SupabaseBooking["status"]),
                      }));
                    }}
                    className="p-0 text-xs font-medium"
                  >
                    <option value="all">全部</option>
                    {Object.entries(statusMap).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-6 py-4 font-medium whitespace-nowrap text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-sm text-(--muted)"
                >
                  載入中...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-sm text-(--muted)"
                >
                  無符合條件的資料
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  item={booking}
                  service={servicesMap.get(booking.service_id)}
                  apiQuery={apiQuery}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type TableRowProps = OverrideProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  {
    item: SupabaseBooking;
    service: SupabaseService | undefined;
    apiQuery: Parameters<typeof bookingsByAdmin>["1"];
  }
>;

type OperationItem<T extends React.ElementType = React.ElementType> = {
  label: string;
  component: T;
  props: React.ComponentProps<T>;
  Icon: React.ElementType;
};

const TableRow = memo(
  ({ item, service, apiQuery, className, ...rest }: TableRowProps) => {
    const status = statusMap[item.status] ?? {
      label: item.status,
      className: "",
    };
    const { token } = useAdminToken();
    const { mutate } = useSWRConfig();

    const handleStatusChange = useCallback(
      (newStatus: SupabaseBooking["status"]) => {
        if (!token) return;
        updateBookingByAdmin(token, { ...item, status: newStatus }).then(
          (res) => {
            if (res.success) {
              mutate(["admin-bookings", token, apiQuery]);
            } else {
              alert("更新失敗");
            }
          },
        );
      },
      [token, item, mutate, apiQuery],
    );

    const operations = useMemo<OperationItem[]>(
      () => [
        {
          label: "編輯",
          component: Link,
          props: {
            className: "text-violet-600 border-violet-600 bg-violet-100",
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
            className: "text-blue-600 border-blue-600 bg-blue-100",
          },
          Icon: CheckOutlined,
        },
        {
          label: "完成",
          component: "button",
          props: {
            type: "button",
            className: "text-emerald-600 border-emerald-600 bg-emerald-100",
            onClick: () => handleStatusChange("completed"),
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
      <tr className={cn("group", className)} {...rest}>
        <td className="px-6 py-4 text-xs font-mono text-(--muted)">
          #{item.id.slice(0, 8)}...
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-(--foreground)">
              {item.customer_name}
            </span>
            <span className="text-xs text-(--muted)">
              {item.customer_phone}
            </span>
            <span className="text-xs text-(--muted)">
              {item.customer_email}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-(--foreground)">
          {service?.name || "-"}
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col text-sm">
            <span className="text-(--foreground)">
              {formatDate("YYYY/MM/DD", item.booking_time)}
            </span>
            <span className="text-xs text-(--muted)">
              {formatDate("hh:mm A", item.booking_time)}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-transparent",
              status.className,
            )}
          >
            {status.label}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-1.5">
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
  },
);

TableRow.displayName = "TableRow";
