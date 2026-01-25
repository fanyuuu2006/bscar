import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { formatDate } from "@/utils/date";
import { CheckCircleFilled } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";

export type ConfirmDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    bookingData: SupabaseBooking | null;
    location: SupabaseLocation| null;
    service: SupabaseService | null;
  }
>;

export const ConfirmDiv = ({ bookingData, location, service, ...rest }: ConfirmDivProps) => {

 if (!bookingData || !location || !service) {
    return <div {...rest}>找不到預約資料。</div>;
  }

  return (
    <div {...rest}>
      {/* 頂部成功訊息 */}
      <div className="w-full flex flex-col items-center py-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-4 shadow-sm">
          <CheckCircleFilled className="text-5xl" />
        </div>
        <h1 className="text-3xl font-bold text-(--foreground) tracking-tight mb-2">
          預約完成
        </h1>
        <p className="text-(--muted)">感謝您的預約，我們已收到您的資訊。</p>
      </div>
      {/* 預約資訊卡片 */}
      <div className="w-full mt-8 p-6 card rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-(--foreground) mb-4">
          預約詳情
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-medium text-(--muted)">地點：</span>
            <span className="text-(--foreground)">
              {location.city} {location.branch}
            </span>
          </div>
          <div>
            <span className="font-medium text-(--muted)">服務項目：</span>
            <span className="text-(--foreground)">{service.name}</span>
          </div>
          <div>
            <span className="font-medium text-(--muted)">預約時間：</span>
            <span className="text-(--foreground)">
              {formatDate("YYYY/MM/DD hh:mm A", bookingData.booking_time)}
            </span>
          </div>
          <div>
            <span className="font-medium text-(--muted)">預約編號：</span>
            <span className="text-(--foreground)">{bookingData.id}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

