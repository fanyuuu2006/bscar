"use client";
import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { formatDate } from "@/utils/date";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
  StarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { cn } from "@/utils/className";
import { CopyButton } from "@/components/CopyBuuton";

export type ConfirmDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    bookingData: SupabaseBooking | null;
    location: SupabaseLocation | null;
    service: SupabaseService | null;
  }
>;

export const ConfirmDiv = ({
  bookingData,
  location,
  service,
  className,
  ...rest
}: ConfirmDivProps) => {
  if (!bookingData || !location || !service) {
    return (
      <div
        {...rest}
        className={cn(
          "flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 py-12 text-center",
          className
        )}
      >
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-red-500 mb-6 shadow-md animate-bounce-slow">
          <CloseCircleFilled className="text-6xl" />
        </div>
        <h2 className="text-3xl font-bold text-(--foreground) mb-4">
          找不到預約資料
        </h2>
        <p className="text-(--muted) text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          很抱歉，我們無法找到相關的預約資訊。
          可能是連結已過期、資料傳輸錯誤，或是該預約已被刪除。
        </p>
        <Link
          href="/"
          className="btn primary flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium"
        >
          返回首頁
        </Link>
      </div>
    );
  }

  const bookingItems = [
    {
      icon: EnvironmentOutlined,
      label: "地點",
      value: `${location.city} - ${location.branch}店`,
      detail: location.address,
    },
    {
      icon: StarOutlined,
      label: "服務",
      value: service.name,
      detail: service.description,
    },
    {
      icon: ClockCircleOutlined,
      label: "時間",
      value: formatDate("YYYY/MM/DD hh:mm A", bookingData.booking_time),
      detail: null,
    },
  ];

  const customerItems = [
    {
      icon: UserOutlined,
      label: "顧客姓名",
      value: bookingData.customer_name,
    },
    {
      icon: PhoneOutlined,
      label: "聯絡電話",
      value: bookingData.customer_phone,
    },
    {
      icon: MailOutlined,
      label:  "Line ID",
      value: bookingData.customer_line,
    },
  ];

  return (
    <div {...rest} className={cn('flex flex-col items-center gap-6',className)}>
      {/* 頂部成功訊息 */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center p-5 rounded-full bg-green-50 text-green-500 mb-4 shadow-md">
          <CheckCircleFilled className="text-5xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-(--foreground) tracking-tight mb-2">
          預約成功
        </h1>
        <p className="text-(--muted) text-center max-w-lg text-base md:text-lg mb-2">
          感謝您的預約！
        </p>

        {/* 預約編號區域 */}
        <div className="flex flex-col items-center gap-1.5 mt-4 w-full">
          <span className="text-sm font-medium text-(--muted)">預約編號</span>
          <div className="flex items-center justify-center gap-3 w-full max-w-lg">
            <span className="font-mono font-bold text-lg md:text-xl text-(--foreground) break-all text-center leading-snug selection:bg-(--primary) selection:text-white">
              {bookingData.id}
            </span>
            <div className="shrink-0 relative top-0.5">
              <CopyButton title="複製" content={bookingData.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* 預約資訊卡片 */}
        <div className="card rounded-2xl p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-(--foreground) border-b border-(--border) pb-3 mb-4">
            預約詳細資訊
          </h2>
          <div className="flex flex-col gap-4">
            {bookingItems.map((item, index) => (
              <InfoRow key={index} {...item} />
            ))}
          </div>
        </div>

        {/* 顧客資料卡片 */}
        <div className="card rounded-2xl p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-(--foreground) border-b border-(--border) pb-3 mb-4">
            顧客資料
          </h2>
          <div className="flex flex-col gap-4">
            {customerItems.map((item, index) => (
              <InfoRow key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* 動作按鈕 */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="btn primary flex items-center gap-2 px-10 py-3 rounded-full text-lg font-medium"
        >
          回到首頁
        </Link>
      </div>
    </div>
  );
};

// 輔助元件：與 InfoDiv 的樣式保持一致
const InfoRow = ({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail?: string | null;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--primary) text-(--primary-foreground) shrink-0">
      <Icon className="text-xl" />
    </div>
    <div className="flex-1 pt-0.5">
      <div className="text-sm font-medium text-(--muted) mb-0.5">{label}</div>
      <div className="text-lg font-bold text-(--foreground) leading-tight">
        {value}
      </div>
      {detail && <div className="text-sm text-(--muted) mt-1">{detail}</div>}
    </div>
  </div>
);
