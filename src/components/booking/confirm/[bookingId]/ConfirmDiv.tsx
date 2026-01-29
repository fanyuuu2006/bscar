import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { formatDate } from "@/utils/date";
import {
  CheckCircleFilled,
  HomeOutlined,
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
          "flex flex-col items-center justify-center p-8 space-y-4",
          className,
        )}
      >
        <div className="text-xl text-red-500">找不到預約資料</div>
        <Link href="/" className="btn primary px-8 py-3 rounded-full">
          回首頁
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
      label: "電子郵件",
      value: bookingData.customer_email,
    },
  ];

  return (
    <div {...rest} className={cn("max-w-4xl mx-auto pb-10 px-4", className)}>
      {/* 頂部成功訊息 */}
      <div className="w-full flex flex-col items-center py-10">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-6 shadow-md animate-bounce-slow">
          <CheckCircleFilled className="text-6xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-(--foreground) tracking-tight mb-3">
          預約成功
        </h1>
        <p className="text-(--muted) text-center max-w-lg text-lg">
          感謝您的預約！您的預約編號為{" "}
          <span className="font-mono font-bold text-(--primary)">
            {bookingData.id}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 預約資訊卡片 */}
        <div className="card rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-(--foreground) border-b border-(--border) pb-3 mb-6">
            預約詳細資訊
          </h2>
          <div className="flex flex-col gap-6">
            {bookingItems.map((item, index) => (
              <InfoRow key={index} {...item} />
            ))}
          </div>
        </div>

        {/* 顧客資料卡片 */}
        <div className="card rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-(--foreground) border-b border-(--border) pb-3 mb-6">
            顧客資料
          </h2>
          <div className="flex flex-col gap-6">
            {customerItems.map((item, index) => (
              <InfoRow key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* 動作按鈕 */}
      <div className="flex justify-center mt-12">
        <Link
          href="/"
          className="btn primary flex items-center gap-2 px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <HomeOutlined />
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
