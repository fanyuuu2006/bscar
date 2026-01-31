import { SupabaseBooking, SupabaseLocation, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

type MainSectionProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    booking: SupabaseBooking | null;
    location: SupabaseLocation | null;
    service: SupabaseService | null;
  }
>;
export const MainSection = ({
  booking,
    location,
    service,
  className,
  ...rest
}: MainSectionProps) => {
  if (!booking) return null;
  return (
    <section className={cn(className)} {...rest}>
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold">編輯預約</h2>

        <div className="card p-4 rounded-xl">
          <h3 className="text-lg font-bold">預約資訊</h3>

          <div className="mt-2 flex flex-col gap-2">
            <p>
              <span className="font-medium">預約ID:</span> {booking.id}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
