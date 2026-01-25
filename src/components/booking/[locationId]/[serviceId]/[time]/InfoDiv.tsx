"use client";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import {
  EnvironmentOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { getDisplayValue } from "@/utils/booking";
import { postBooking } from "@/utils/backend";
import { formatDate } from "@/utils/date";
import { Info, SupabaseLocation, SupabaseService } from "@/types";

type InfoDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    location: SupabaseLocation;
    service: SupabaseService;
    time: Date;
  }
>;

export const InfoDiv = ({
  className,
  location,
  service,
  time,
  ...rest
}: InfoDivProps) => {
  const [data, setData] = useState<Info>({ name: "", phone: "", email: "" });

  const items = useMemo(() => {
    if (!location || !service || !time) return [];
    return [
      {
        icon: EnvironmentOutlined,
        label: "地點",
        value: getDisplayValue("location", location),
        detail: location?.address,
        key: "location",
      },
      {
        icon: StarOutlined,
        label: "服務",
        value: getDisplayValue("service", service),
        detail: service?.description,
        key: "service",
      },
      {
        icon: ClockCircleOutlined,
        label: "時間",
        value: getDisplayValue("time", time),
        key: "time",
      },
    ];
  }, [location, service, time]);

  const formFields = [
    {
      id: "name",
      label: "姓名",
      type: "text",
    },
    {
      id: "phone",
      label: "電話",
      type: "tel",
    },
    {
      id: "email",
      label: "電子郵件",
      type: "email",
    },
  ] as const;

  const handleInfoChange = useCallback((key: keyof Info, value: string) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!location || !service || !time) return;
      postBooking({
        location_id: location.id,
        service_id: service.id,
        time: formatDate("YYYY-MM-DD HH:mm:ss", time),
        info: data,
      })
        .then((res) => {
          if (res.success) {
          } else {
            alert(res.message || "預約失敗，請稍後再試。");
          }
        })
        .catch((err) => {
          alert("預約失敗，請稍後再試。");
          console.error("預約失敗:", err);
        });
    },
    [location, service, time, data],
  );

  return (
    <div
      className={cn("w-full grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      {...rest}
    >
      {/* 預約摘要卡片 */}
      <div className="card flex flex-col gap-4 p-4 md:p-6 overflow-hidden rounded-2xl">
        <h2 className="text-2xl font-bold text-(--foreground) border-b border-(--border) pb-2">
          預約摘要
        </h2>

        <div className="flex flex-col gap-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--primary) text-(--primary-foreground) shrink-0">
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-sm font-medium text-(--muted) mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-lg font-bold text-(--foreground)">
                    {item.value || (
                      <span className="opacity-50 font-normal">尚未選擇</span>
                    )}
                  </div>
                  {item.detail && (
                    <div className="text-sm text-(--muted) mt-1 flex flex-col gap-1">
                      {item.detail.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 個人資料表單 */}
      <form
        className="card flex flex-col gap-4 p-4 md:p-6 overflow-hidden rounded-2xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-(--foreground) border-b border-(--border) pb-2">
          填寫資料
        </h2>
        <div className="flex flex-col gap-4">
          {formFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label
                htmlFor={field.id}
                className={cn(
                  "text-sm font-medium text-(--foreground)",
                  "after:content-['*'] after:ml-0.5 after:text-(--accent)",
                )}
              >
                {field.label}
              </label>
              <input
                required
                id={field.id}
                type={field.type}
                value={data[field.id]}
                onChange={(e) => handleInfoChange(field.id, e.target.value)}
                placeholder={`請輸入您的${field.label}`}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--background) text-(--foreground) focus:outline-hidden focus:border-(--primary) transition-all"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-(--primary) text-(--primary-foreground) font-bold text-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            送出預約
          </button>
        </div>
      </form>
    </div>
  );
};
