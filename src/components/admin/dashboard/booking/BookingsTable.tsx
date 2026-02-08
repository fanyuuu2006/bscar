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
import {
  CloseOutlined,
  CheckOutlined,
  StarOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  SearchOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { DistributiveOmit } from "fanyucomponents";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { BookingTableRow } from "./BookingTableRow";
import { MultiSelect } from "../../../MultiSelect";
import { AddBookingButton } from "./AddBookingButton";

type BookingsTableProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const BookingsTable = ({ className, ...rest }: BookingsTableProps) => {
  // 取得管理員 Token 以進行需授權的 API 呼叫
  const { token } = useAdminToken();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 控制預約時間的排序方向 (true: 升序, false: 降序)
  const [timeAscending, setTimeAscending] = useState<boolean>(false);

  /**
   * 根據當前 URL 的 Search Params 初始化查詢條件物件。
   * 使用 useMemo 確保只有在網址參數改變時才重新計算。
   */
  const query = useMemo(() => {
    const statusStr = searchParams.getAll("status");
    const serviceIdStr = searchParams.getAll("service_id");

    return {
      page: Number(searchParams.get("page")) || 1,
      count: Number(searchParams.get("count")) || 50,
      status:
        statusStr.length > 0
          ? (statusStr as SupabaseBooking["status"][])
          : undefined,
      service_id: serviceIdStr.length > 0 ? serviceIdStr : undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
      keyword: searchParams.get("keyword") || undefined,
    };
  }, [searchParams]);

  /**
   * 更新查詢條件並同步到網址上的輔助函式。
   *
   * @param updater - 新的查詢參數物件或更新函式
   */
  const setQuery = useCallback(
    (
      updater:
        | Parameters<typeof bookingsByAdmin>["1"]
        | ((
            prev: Parameters<typeof bookingsByAdmin>["1"],
          ) => Parameters<typeof bookingsByAdmin>["1"]),
    ) => {
      const nextQuery =
        typeof updater === "function" ? updater(query) : updater;
      const params = new URLSearchParams();

      // 只將有意義的參數寫入 URL，避免產生過長的空參數
      if (nextQuery?.page && nextQuery.page !== 1)
        params.set("page", String(nextQuery.page));
      if (nextQuery?.count && nextQuery.count !== 50)
        params.set("count", String(nextQuery.count));

      if (nextQuery?.status && Array.isArray(nextQuery.status)) {
        nextQuery.status.forEach((s) => params.append("status", s));
      }
      if (nextQuery?.service_id && Array.isArray(nextQuery.service_id)) {
        nextQuery.service_id.forEach((id) => params.append("service_id", id));
      }

      if (nextQuery?.start_date) params.set("start_date", nextQuery.start_date);
      if (nextQuery?.end_date) params.set("end_date", nextQuery.end_date);
      if (nextQuery?.keyword) params.set("keyword", nextQuery.keyword);

      // 使用 replace 更新網址，scroll: false 防止頁面跳動
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, query, router],
  );

  /**
   * 使用 SWR 取得預約列表資料。
   * 依賴於 token 與 query，當這兩者改變時會自動重新抓取資料。
   */
  const { data, isLoading, mutate } = useSWR(
    token ? ["admin-bookings", token, query] : null,
    () => bookingsByAdmin(token!, query),
  );

  // 取得所有服務項目資料，用於顯示服務名稱與篩選選單
  const { data: servicesRes } = useSWR("services", getServices);

  // 將服務資料轉換為 Map 結構，方便快速查找
  const servicesMap = useMemo(() => {
    const map = new Map<string, SupabaseService>();
    servicesRes?.data?.forEach((s) => map.set(s.id, s));
    return map;
  }, [servicesRes?.data]);

  // --- 本地 UI 狀態與防抖處理 (Debounce) ---

  // 關鍵字搜尋輸入框的本地狀態
  const [inputQuery, setInputQuery] = useState(query.keyword || "");

  // 當外部 URL 的 keyword 改變時（例如點擊瀏覽器上一頁），同步回輸入框
  useEffect(() => {
    if (query.keyword !== inputQuery) {
      setInputQuery(query.keyword || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.keyword]);

  // 防抖處理：當使用者停止輸入 350ms 後，才觸發搜尋（更新 query）
  useEffect(() => {
    const id = setTimeout(() => {
      // 只有當輸入值與當前 query 不一致時才更新，避免不必要的刷新
      if ((query.keyword || "") !== inputQuery.trim()) {
        setQuery((prev) => ({
          ...prev,
          keyword: inputQuery.trim() || undefined,
          page: 1, // 搜尋條件變更時，重置回第一頁
        }));
      }
    }, 350);
    return () => clearTimeout(id);
  }, [inputQuery, setQuery, query.keyword]);

  // 頁碼輸入框的本地狀態
  const [inputPage, setInputPage] = useState<string>(String(query.page || 1));

  // 當實際頁碼改變時，同步回頁碼輸入框
  useEffect(() => {
    setInputPage(String(query.page || 1));
  }, [query.page]);

  // 防抖處理：當使用者停止輸入頁碼 500ms 後，才觸發換頁
  useEffect(() => {
    const timer = setTimeout(() => {
      const val = parseInt(inputPage);
      if (!isNaN(val) && val >= 1 && val !== (query.page || 1)) {
        setQuery((prev) => ({ ...prev, page: val }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputPage, query.page, setQuery]);

  /**
   * 對從 API 取得已分頁的資料進行前端排序。
   * 目前後端分頁已完成，此處主要處理當前頁面內的顯示順序。
   */
  const filteredBookings = useMemo(() => {
    // 確保有資料
    if (!data?.data) return [];

    const result = data.data;

    // 依據時間升降序重新排列
    return [...result].sort((a, b) => {
      const timeA = new Date(a.booking_time).getTime();
      const timeB = new Date(b.booking_time).getTime();
      return timeAscending ? timeA - timeB : timeB - timeA;
    });
  }, [data, timeAscending]);

  /**
   * 重置所有篩選條件至預設值。
   */
  const handleReset = useCallback(() => {
    setQuery({
      page: 1,
      count: 50,
      status: undefined,
      service_id: undefined,
      start_date: undefined,
      end_date: undefined,
      keyword: undefined,
    });
    setInputQuery("");
  }, [setQuery]);

  // --- 批次操作狀態與處理 ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 當資料重新載入時（例如換頁），清空選取狀態
  useEffect(() => {
    setSelectedIds(new Set());
  }, [data]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredBookings.map((b) => b.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const bulkOperations = useMemo(() => {
    return [
      {
        key: "confirmed",
        label: "確認",
        icon: CheckOutlined,
        className: "text-blue-600 bg-blue-50 border-blue-200",
      },
      {
        key: "cancelled",
        label: "取消",
        icon: CloseOutlined,
        className: "text-red-600 bg-red-50 border-red-200",
      },
      {
        key: "completed",
        label: "完成",
        icon: StarOutlined,
        className: "text-green-600 bg-green-50 border-green-200",
      },
    ] as const satisfies {
      key: SupabaseBooking["status"];
      label: string;
      icon: React.ElementType;
      className: string;
    }[];
  }, []);

  const handleBulkAction = async (
    action: (typeof bulkOperations)[number]["key"],
  ) => {
    if (!token || selectedIds.size === 0) return;

    try {
      const promises = Array.from(selectedIds).map(async (id) => {
        const booking = filteredBookings.find((b) => b.id === id);
        if (!booking) return;

        // 如果狀態已經一樣則跳過
        if (booking.status === action) return;

        return updateBookingByAdmin(token, {
          ...booking,
          status: action as SupabaseBooking["status"],
        });
      });

      await Promise.all(promises);
      mutate();
      setSelectedIds(new Set());
    } catch (error) {
      console.error(error);
      alert("操作過程中發生錯誤");
    }
  };

  /**
   * 處理預約狀態更新的操作。
   *
   * @param booking - 目標預約物件
   * @param newStatus - 欲變更的新狀態
   */
  const handleStatusUpdate = useCallback(
    async (booking: SupabaseBooking, newStatus: SupabaseBooking["status"]) => {
      if (!token) return;
      try {
        const res = await updateBookingByAdmin(token, {
          ...booking,
          status: newStatus,
        });

        if (res.success) {
          mutate(); // 更新成功後重新抓取資料
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
      <div className="card p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3">
        {/* 關鍵字搜尋 */}
        <div className="relative col-span-2 md:col-span-4 lg:col-span-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--muted)">
            <SearchOutlined />
          </div>
          <input
            id="search-bookings"
            name="search"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="搜尋編號、姓名、電話、Line ID..."
            className="w-full py-2 pl-9 pr-4 text-xs rounded-lg border border-(--border) bg-gray-50/50 outline-none"
          />
        </div>

        {/* 服務篩選 */}
        <MultiSelect
          label="服務"
          options={
            servicesRes?.data?.map((s) => ({
              label: s.name,
              value: s.id,
            })) || []
          }
          values={query?.service_id || []}
          onChange={(vals) => {
            setQuery((prev) => ({
              ...prev,
              service_id: vals.length > 0 ? vals : undefined,
              page: 1,
            }));
          }}
          className="col-span-1 md:col-span-2 lg:col-span-2 py-2 px-4 text-xs rounded-lg border border-(--border) bg-gray-50/50"
        />

        {/* 狀態篩選 */}
        <MultiSelect
          label="狀態"
          options={Object.entries(statusMap).map(([key, val]) => ({
            label: val.label,
            value: key,
          }))}
          values={query?.status || []}
          onChange={(vals) => {
            setQuery((prev) => ({
              ...prev,
              status:
                vals.length > 0
                  ? (vals as SupabaseBooking["status"][])
                  : undefined,
              page: 1,
            }));
          }}
          className="col-span-1 md:col-span-2 lg:col-span-2 py-2 px-4 text-xs rounded-lg border border-(--border) bg-gray-50/50"
        />

        {/* 日期篩選 */}
        <div className="col-span-2 md:col-span-3 lg:col-span-3 flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-(--border) gap-1">
          <input
            id="start-date"
            name="start_date"
            type="date"
            value={query?.start_date || ""}
            className="text-xs outline-none cursor-pointer"
            onChange={(e) => {
              const val = e.target.value;
              setQuery((prev) => ({
                ...prev,
                start_date: val || undefined,
                page: 1,
              }));
            }}
          />
          <span className="text-(--muted) text-xs">至</span>
          <input
            id="end-date"
            name="end_date"
            type="date"
            value={query?.end_date || ""}
            className="text-xs outline-none cursor-pointer"
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
        <button
          onClick={handleReset}
          className="tooltip col-span-2 md:col-span-1 lg:col-span-1 p-2 flex items-center justify-center text-(--muted) rounded-lg border border-(--border) bg-gray-50/50"
          data-tooltip="清除篩選"
        >
          <ReloadOutlined />
        </button>
      </div>

      {/* 批次操作工具列 */}
      {selectedIds.size > 0 && (
        <div className="card p-3 rounded-xl flex items-center justify-between border border-(--border) animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              已選取 {selectedIds.size} 筆預約
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-(--muted) hover:text-(--foreground) underline transition-colors"
            >
              取消全選
            </button>
          </div>
          <div className="flex items-center gap-2">
            {bulkOperations.map((op) => (
              <button
                key={op.key}
                onClick={() => handleBulkAction(op.key)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs",
                  op.className,
                )}
              >
                <op.icon />
                <span>{op.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 表格區塊 */}
      <div className="card rounded-xl flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">預約列表</h3>
            <span className="text-xs text-(--muted) bg-gray-50/50 border border-gray-200 px-2 py-1 rounded-full">
              共 {filteredBookings.length} 筆
            </span>
          </div>
          <div>
            <AddBookingButton
              mutate={mutate}
              services={Array.from(servicesMap.values())}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left border-y border-(--border) border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-(--border) bg-gray-50 text-xs text-(--muted)">
                <th className="pl-5 py-3 w-4">
                  <input
                    id="select-all-bookings"
                    name="select_all"
                    type="checkbox"
                    className="cursor-pointer align-middle"
                    checked={
                      filteredBookings.length > 0 &&
                      filteredBookings.every((b) => selectedIds.has(b.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  編號
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">
                  顧客資訊
                </th>
                <th className="px-5 py-3 font-medium whitespace-nowrap text-center">
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
                <th className="px-5 py-3 font-medium whitespace-nowrap text-center">
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
                  <td colSpan={7} className="py-32 text-center">
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
                  <td colSpan={7} className="py-24 text-center">
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
                  <BookingTableRow
                    key={booking.id}
                    item={booking}
                    service={servicesMap.get(booking.service_id)}
                    onUpdate={handleStatusUpdate}
                    selected={selectedIds.has(booking.id)}
                    onSelect={handleSelectRow}
                    onEditSuccess={() => {
                      mutate();
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁控制 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-(--border)">
          <div className="flex items-center gap-2 text-xs text-(--muted)">
            <span>顯示</span>
            <select
              id="items-per-page"
              name="items_per_page"
              value={query?.count || 10}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  count: Number(e.target.value),
                  page: 1,
                }))
              }
              className="py-1 px-2 rounded-md border border-(--border) bg-gray-50/50 text-xs outline-none cursor-pointer"
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
              className="btn py-1.5 px-3 text-xs rounded-md"
            >
              上一頁
            </button>
            <div className="flex items-center gap-1.5 text-xs text-(--muted)">
              <span>第</span>
              <input
                id="page-number"
                name="page"
                type="text"
                inputMode="numeric"
                value={inputPage}
                onChange={(e) => {
                  const val = e.target.value || "0";
                  // 僅允許輸入數字
                  if (/^\d+$/.test(val)) {
                    setInputPage(val);
                  }
                }}
                className="w-10 p-1.5 text-center font-medium text-(--foreground) rounded-md border border-(--border) bg-gray-50/50 outline-none"
              />
              <span>頁</span>
            </div>
            <button
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }))
              }
              className="btn py-1.5 px-3 text-xs rounded-md"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
