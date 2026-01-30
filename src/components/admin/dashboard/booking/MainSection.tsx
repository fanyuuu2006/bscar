"use client";

import { useAdminToken } from "@/hooks/useAdminToken";
import { bookingsByAdmin } from "@/utils/backend";
import { formatDate } from "@/utils/date";
import useSWR from "swr";

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待處理", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "已確認", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
  completed: { label: "已完成", className: "bg-gray-100 text-gray-800" },
};

export const MainSection = () => {
  const { token } = useAdminToken();

  const { data, error, isLoading } = useSWR(
    token ? ["admin-bookings", token] : null,
    () => bookingsByAdmin(token!),
  );

  if (isLoading) {
    return (
      <section className="flex h-full w-full items-center justify-center p-4">
        <div className="text-lg text-gray-500">載入中...</div>
      </section>
    );
  }

  if (error || (data && !data.success)) {
    return (
      <section className="flex h-full w-full items-center justify-center p-4">
        <div className="text-lg text-red-500">
          載入失敗: {error?.message || data?.message || "未知錯誤"}
        </div>
      </section>
    );
  }

  const bookings = data?.data || [];

  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800">預約管理</h1>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  預約編號
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  客戶資訊
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  服務內容
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  預約時間
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    目前沒有預約紀錄
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const statusInfo = statusMap[booking.status] || {
                    label: booking.status,
                    className: "bg-gray-100 text-gray-800",
                  };
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        <span title={booking.id}>
                          {booking.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">
                          {booking.customer_name}
                        </div>
                        <div>{booking.customer_phone}</div>
                        <div className="text-xs text-gray-400">
                          {booking.customer_email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col gap-1">
                          <span className="w-fit rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            位置: {booking.location_id.slice(0, 8)}...
                          </span>
                          <span className="w-fit rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                            服務: {booking.service_id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div>
                          {formatDate("YYYY/MM/DD", booking.booking_time)}
                        </div>
                        <div className="text-xs">
                          {formatDate("HH:mm", booking.booking_time)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
