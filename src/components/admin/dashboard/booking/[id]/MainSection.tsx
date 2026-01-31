import { SupabaseBooking,  SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";

type MainSectionProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    booking: SupabaseBooking | null;
    service: SupabaseService | null;
  }
>;
export const MainSection = ({
  booking,
    service,
  className,
  ...rest
}: MainSectionProps) => {
  if (!booking) return null;
  return (
    <section className={cn(className)} {...rest}>
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold">編輯預約</h2>

        {/* 預約資訊 */}
        <div className="card p-4 rounded-xl">
          <h3 className="text-lg font-bold">預約資訊</h3>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col">
                <span className="font-medium">預約編號</span>
                <span>{booking.id}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-medium">服務</span>
                <span>{service ? service.name : booking.service_id}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-medium">預約時間</span>
                <span>{formatDate("YYYY/MM/DD hh:mm A", booking.booking_time)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
