import { SupabaseBooking } from "@/types";
import { CheckCircleFilled } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";

export type ConfirmDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    bookingData: SupabaseBooking | null;
  }
>;

export const ConfirmDiv = ({ bookingData, ...rest }: ConfirmDivProps) => {
  if (!bookingData) {
    return <div {...rest}>找不到預約資料。</div>;
  }
  return (
    <div {...rest}>
      {/* 頂部成功訊息區塊 */}
      <div className="w-full flex flex-col items-center py-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-4 shadow-sm">
          <CheckCircleFilled className="text-5xl" />
        </div>
        <h1 className="text-3xl font-bold text-(--foreground) tracking-tight mb-2">
          預約完成
        </h1>
        <p className="text-(--muted)">感謝您的預約，我們已收到您的資訊。</p>
      </div>
    </div>
  );
};
