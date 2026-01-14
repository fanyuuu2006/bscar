import { useBooking } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import {
  EnvironmentOutlined,
  StarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { ChangeEvent, useMemo } from "react";
import { getDisplayValue } from "../../utils/booking";

type InfoDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoDiv = ({ className, ...rest }: InfoDivProps) => {
  const booking = useBooking();

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    booking.setBookingData("info", {
      name: booking.data.info?.name || "",
      phone: booking.data.info?.phone || "",
      email: booking.data.info?.email || "",
      [name]: value,
    });
  };

  const items = useMemo(
    () => [
      {
        icon: EnvironmentOutlined,
        label: "地點",
        value: getDisplayValue("location", booking.data.location),
        key: "location",
      },
      {
        icon: StarOutlined,
        label: "服務",
        value: getDisplayValue("service", booking.data.service),
        key: "service",
      },
      {
        icon: ClockCircleOutlined,
        label: "時間",
        value: getDisplayValue("time", booking.data.time),
        key: "time",
      },
    ],
    [booking.data]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8",
        className
      )}
      {...rest}
    >
      {/* 預約資訊卡片 */}
      <div className="card p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col h-full bg-white">
        <h2 className="text-xl font-bold mb-6 text-(--foreground) flex items-center gap-2">
          <span className="text-(--primary)">▍</span>
          預約摘要
        </h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-start p-4 rounded-xl border border-(--border) hover:border-(--primary) transition-colors bg-(--background)/30"
              >
                <div className="text-2xl text-(--primary) mr-4 mt-0.5">
                  <Icon />
                </div>
                <div>
                  <div className="text-sm font-medium text-(--muted) mb-1">
                    預約{item.label}
                  </div>
                  <div className="text-lg font-bold text-(--foreground) wrap-break-word line-clamp-2">
                    {item.value || "未選擇"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 填寫資料卡片 */}
      <div className="card p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col h-full bg-white">
        <h2 className="text-xl font-bold mb-6 text-(--foreground) flex items-center gap-2">
          <span className="text-(--primary)">▍</span>
          填寫資料
        </h2>
        <div className="flex flex-col gap-5 h-full">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-(--muted) ml-1">
              姓名
            </label>
            <div className="relative group">
              <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted) group-focus-within:text-(--primary) transition-colors text-lg" />
              <input
                type="text"
                name="name"
                value={booking.data.info?.name || ""}
                onChange={handleInfoChange}
                placeholder="請輸入您的姓名"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-(--border) bg-(--background)/30 focus:bg-white focus:border-(--primary) outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-(--muted) ml-1">
              電話
            </label>
            <div className="relative group">
              <PhoneOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted) group-focus-within:text-(--primary) transition-colors text-lg" />
              <input
                type="tel"
                name="phone"
                value={booking.data.info?.phone || ""}
                onChange={handleInfoChange}
                placeholder="請輸入您的電話"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-(--border) bg-(--background)/30 focus:bg-white focus:border-(--primary) outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-(--muted) ml-1">
              電子信箱
            </label>
            <div className="relative group">
              <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted) group-focus-within:text-(--primary) transition-colors text-lg" />
              <input
                type="email"
                name="email"
                value={booking.data.info?.email || ""}
                onChange={handleInfoChange}
                placeholder="請輸入您的電子信箱"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-(--border) bg-(--background)/30 focus:bg-white focus:border-(--primary) outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              className="btn primary w-full font-bold py-3.5 px-6 rounded-xl text-lg shadow-lg shadow-(--primary)/20 hover:shadow-(--primary)/40 active:scale-[0.98] transition-all"
              onClick={() => {
                alert("預約成功！");
              }}
            >
              確認預約
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
