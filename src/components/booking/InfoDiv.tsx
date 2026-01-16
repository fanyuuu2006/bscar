import { useBooking, type Info } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import {
  EnvironmentOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { getDisplayValue } from "../../utils/booking";

type InfoDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoDiv = ({ className, ...rest }: InfoDivProps) => {
  const booking = useBooking();
  const items = useMemo(
    () => [
      {
        icon: EnvironmentOutlined,
        label: "地點",
        value: getDisplayValue("location", booking.data.location),
        detail: booking.data.location?.address,
        key: "location",
      },
      {
        icon: StarOutlined,
        label: "服務",
        value: getDisplayValue("service", booking.data.service),
        detail: booking.data.service?.description,
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

  const formFields = [
    {
      id: "name",
      label: "姓名",
      type: "text",
      // valider: undefined,
    },
    {
      id: "phone",
      label: "電話",
      type: "tel",
      // valider : isValidPhone,
    },
    {
      id: "email",
      label: "電子郵件",
      type: "email",
      // valider : isValidEmail,
    },
  ] as const;

  const handleInfoChange = (
    key: keyof Info,
    value: string,
    valider?: (val: string) => boolean
  ) => {
    if (valider && !valider(value)) {
      return;
    }
    const currentInfo = booking.data.info || { name: "", phone: "", email: "" };
    booking.setBookingData("info", {
      ...currentInfo,
      [key]: value,
    });
  };

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
        onSubmit={(e) => {
          e.preventDefault();
          alert("預約已送出！");
        }}
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
                  "after:content-['*'] after:ml-0.5 after:text-(--accent)"
                )}
              >
                {field.label}
              </label>
              <input
                required
                id={field.id}
                type={field.type}
                value={booking.data.info?.[field.id] || ""}
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
