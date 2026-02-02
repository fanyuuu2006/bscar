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
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  InboxOutlined,
  LoadingOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect, memo } from "react";
import useSWR from "swr";

type BookingsTableProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const BookingsTable = ({ className, ...rest }: BookingsTableProps) => {
  const { token } = useAdminToken();

  const defaultQuery = useMemo(() => {
    const today = formatDate("YYYY-MM-DD", new Date());
    return {
      page: 1,
      count: 50,
      status: undefined,
      service_id: undefined,
      start_date: today,
      end_date: today,
    };
  }, []);

  const [query, setQuery] =
    useState<Parameters<typeof bookingsByAdmin>["1"]>(defaultQuery);
  const { data, isLoading, mutate } = useSWR(
    token ? ["admin-bookings", token, query] : null,
    () => bookingsByAdmin(token!, query),
  );

  const { data: servicesRes } = useSWR("services", getServices);

  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    servicesRes?.data?.forEach((s) => map.set(s.id, s));
    return map;
  }, [servicesRes?.data]);

  // 查詢與篩選狀態
  // 使用 inputQuery 作為即時輸入
  const [inputQuery, setInputQuery] = useState("");

  const [timeAscending, setTimeAscending] = useState<boolean>(true);

  // 防抖 inputQuery -> query.keyword
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        keyword: inputQuery.trim() || undefined,
      }));
    }, 350);
    return () => clearTimeout(id);
  }, [inputQuery]);

  const filteredBookings = useMemo(() => {
    // 確保有資料
    if (!data?.data) return [];

    const result = data.data;

    // 排序
    return [...result].sort((a, b) => {
      const timeA = new Date(a.booking_time).getTime();
      const timeB = new Date(b.booking_time).getTime();
      return timeAscending ? timeA - timeB : timeB - timeA;
    });
  }, [data, timeAscending]);

  const handleReset = useCallback(() => {
    setQuery(defaultQuery);
    setInputQuery("");
  }, [defaultQuery]);

  const handleStatusUpdate = useCallback(
    async (booking: SupabaseBooking, newStatus: SupabaseBooking["status"]) => {
      if (!token) return;
      try {
        const res = await updateBookingByAdmin(token, {
          ...booking,
          status: newStatus,
        });

        if (res.success) {
          mutate();
        } else {
          alert("更新失敗");
        }
      } catch (error) {
        console.error(error);
        alert("更新發生錯誤");
      }
    },
    [token, mutate],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)} {...rest}>
      {/* 篩選工具列 */}
      <div className="card p-4 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 關鍵字搜尋 */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--muted)">
              <SearchOutlined />
            </div>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="搜尋編號、姓名、電話、Email..."
              className="w-full py-2 pl-9 pr-4 text-sm rounded-lg border border-(--border) bg-gray-50/50 outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* 服務篩選 */}
            <div className="relative min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--muted)">
                <FilterOutlined />
              </div>
              <select
                value={query?.service_id || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery((prev) => ({
                    ...prev,
                    service_id: val === "all" ? undefined : val,
                    page: 1,
                  }));
                }}
                className="w-full p-2 pl-9 pr-8 text-sm rounded-lg border border-(--border) bg-gray-50/50 appearance-none outline-none cursor-pointer"
              >
                <option value="all">所有服務</option>
                {servicesRes?.data?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-(--muted) text-xs">
                <CaretDownOutlined />
              </div>
            </div>

            {/* 狀態篩選 */}
            <div className="relative min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--muted)">
                <FilterOutlined />
              </div>
              <select
                value={query?.status || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery((prev) => ({
                    ...prev,
                    status:
                      val === "all"
                        ? undefined
                        : (val as SupabaseBooking["status"]),
                    page: 1,
                  }));
                }}
                className="w-full p-2 pl-9 pr-8 text-sm rounded-lg border border-(--border) bg-gray-50/50 appearance-none outline-none cursor-pointer"
              >
                <option value="all">所有狀態</option>
                {Object.entries(statusMap).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-(--muted) text-xs">
                <CaretDownOutlined />
              </div>
            </div>

            {/* 日期篩選 */}
            <div className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-(--border) px-2 gap-1">
              <input
                type="date"
                value={query?.start_date || ""}
                className="bg-transparent border-none text-sm outline-none cursor-pointer"
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery((prev) => ({
                    ...prev,
                    start_date: val || undefined,
                    page: 1,
                  }));
                }}
              />
              <span className="text-(--muted) px-1">-</span>
              <input
                type="date"
                value={query?.end_date || ""}
                className="bg-transparent border-none text-sm outline-none cursor-pointer"
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery((prev) => ({
                    ...prev,
                    end_date: val || undefined,
                    page: 1,
                  }));
                }}
              />
            </div>

            {/* 重置按鈕 */}
            <div>
              <button
                onClick={handleReset}
                className="p-2 flex items-center justify-center text-(--muted) rounded-lg border border-(--border) bg-gray-50/50"
                title="清除篩選"
              >
                <ReloadOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 表格區塊 */}
      <div className="card rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="font-semibold">預約列表</h3>
          <span className="text-xs text-(--muted) bg-gray-50/50 px-2 py-1 rounded-full">
            共 {filteredBookings.length} 筆
          </span>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left border-y border-(--border) border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-(--border) bg-gray-50 text-xs text-(--muted)">
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  編號
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  顧客資訊
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  服務項目
                </th>
                <th
                  className="px-5 py-3 font-medium whitespace-nowrap cursor-pointer"
                  onClick={() => setTimeAscending((prev) => !prev)}
                >
                  <div className="flex items-center gap-1">
                    <span>預約時間</span>
                    <ArrowDownOutlined
                      className={cn("transition-transform duration-300", {
                        "rotate-180": timeAscending,
                      })}
                    />
                  </div>
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  狀態
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap text-center">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-(--muted)">
                      <LoadingOutlined className="text-3xl" />
                      <span className="text-sm font-medium">
                        正在載入預約資料...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-(--muted)">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 border border-(--border)">
                        <InboxOutlined className="text-2xl opacity-50" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          沒有找到符合條件的預約
                        </span>
                        <button
                          onClick={handleReset}
                          className="text-xs hover:underline transition-colors"
                        >
                          清除篩選條件
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    item={booking}
                    service={servicesMap.get(booking.service_id)}
                    onUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁控制 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-(--border)">
          <div className="flex items-center gap-2 text-sm text-(--muted)">
            <span>顯示</span>
            <select
              value={query?.count || 10}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  count: Number(e.target.value),
                  page: 1,
                }))
              }
              className="p-2 rounded-md border border-(--border) bg-gray-50/50 px-2 text-xs outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>筆 / 頁</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={query?.page === 1}
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: (prev?.page || 1) - 1 }))
              }
              className="btn py-2 px-3 text-sm rounded-md"
            >
              上一頁
            </button>
            <span className="text-sm font-medium min-w-16 text-center">
              第 {query?.page || 1} 頁
            </span>
            <button
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }))
              }
              className="btn py-2 px-3 text-sm rounded-md"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type TableRowProps = OverrideProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  {
    item: SupabaseBooking;
    service: SupabaseService | undefined;
    onUpdate: (
      booking: SupabaseBooking,
      status: SupabaseBooking["status"],
    ) => void;
  }
>;

type OperationItem<T extends React.ElementType = React.ElementType> = {
  label: string;
  component: T;
  props: React.ComponentProps<T>;
  Icon: React.ElementType;
};

const TableRow = memo(
  ({ item, service, onUpdate, className, ...rest }: TableRowProps) => {
    const status = statusMap[item.status] ?? {
      label: item.status,
      className: "",
    };

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
            onClick: () => onUpdate(item, "confirmed"),
            disabled: item.status === "confirmed",
            className:
              "text-blue-600 border-blue-600 bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed",
          },
          Icon: CheckOutlined,
        },
        {
          label: "完成",
          component: "button",
          props: {
            type: "button",
            className:
              "text-emerald-600 border-emerald-600 bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed",
            onClick: () => onUpdate(item, "completed"),
            disabled: item.status === "completed",
          },
          Icon: StarOutlined,
        },
        {
          label: "取消",
          component: "button",
          props: {
            type: "button",
            onClick: () => onUpdate(item, "cancelled"),
            disabled: item.status === "cancelled",
            className:
              "text-red-600 border-red-600 bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed",
          },
          Icon: CloseOutlined,
        },
      ],
      [item, onUpdate],
    );

    return (
      <tr className={cn("group", className)} {...rest}>
        <td className="px-5 py-3 text-xs font-mono text-(--muted)">
          #{item.id.slice(0, 8)}...
        </td>
        <td className="px-5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{item.customer_name}</span>
            <span className="text-xs text-(--muted)">
              {item.customer_phone}
            </span>
            <span className="text-xs text-(--muted)">
              {item.customer_email}
            </span>
          </div>
        </td>
        <td className="px-5 py-3 text-sm">
          <span className="flex items-center px-2 py-1 rounded-full text-xs font-medium border shrink-0 w-max border-(--border) bg-gray-50/50">
            {service?.name || "-"}
          </span>
        </td>
        <td className="px-5 py-3">
          <div className="flex flex-col text-sm">
            <span className="text-(--foreground)">
              {formatDate("YYYY/MM/DD", item.booking_time)}
            </span>
            <span className="text-xs text-(--muted)">
              {formatDate("hh:mm A", item.booking_time)}
            </span>
          </div>
        </td>
        <td className="px-5 py-3">
          <span
            className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs font-medium border shrink-0 w-max",
              status.className,
            )}
          >
            {status.label}
          </span>
        </td>
        <td className="px-5 py-3 text-sm text-center whitespace-nowrap">
          {/* 操作按鈕群組 */}
          <div className="flex items-center justify-center gap-1.5">
            {operations.map((oper) => {
              const { className: operClassName, ...operRest } = oper.props;
              const Component = oper.component;
              return (
                <Component
                  key={oper.label}
                  className={cn(
                    "flex items-center p-2 rounded-md text-sm font-medium border tooltip",
                    operClassName,
                  )}
                  data-tooltip={oper.label}
                  {...operRest}
                >
                  <oper.Icon />
                </Component>
              );
            })}
          </div>
        </td>
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";
